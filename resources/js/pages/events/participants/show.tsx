import { Form, Head, Link, setLayoutProps } from '@inertiajs/react';
import { UserRound } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useInitials } from '@/hooks/use-initials';
import {
    index,
    show as eventShow,
} from '@/actions/App/Http/Controllers/EventController';
import { index as participantsIndex } from '@/actions/App/Http/Controllers/Events/ParticipantController';
import { show } from '@/actions/App/Http/Controllers/Events/ParticipantProfileController';
import { edit as editProfile } from '@/actions/App/Http/Controllers/Events/ProfileController';
import {
    destroy as destroyImpression,
    store as storeImpression,
    update as updateImpression,
} from '@/actions/App/Http/Controllers/Events/ImpressionController';
import { store as hideImpression } from '@/actions/App/Http/Controllers/Events/ImpressionHideController';
import { storeImpression as reportImpression } from '@/actions/App/Http/Controllers/Events/ReportController';
import type { EventDetail, ParticipantSummary, ProfileLink } from '@/types';
import type { PresentedImpression } from '@/pages/events/impressions/index';

type Props = {
    event: Pick<EventDetail, 'ulid' | 'name'>;
    participant: ParticipantSummary & {
        bio: string | null;
        links: ProfileLink[];
        is_self: boolean;
    };
    impressions: PresentedImpression[];
    prompt: string | null;
};

export default function ParticipantProfileShow({
    event,
    participant,
    impressions,
    prompt,
}: Props) {
    const initials = useInitials();

    setLayoutProps({
        breadcrumbs: [
            { title: 'Etkinliklerim', href: index() },
            { title: event.name, href: eventShow(event) },
            { title: 'Katılımcılar', href: participantsIndex(event) },
            { title: participant.name, href: show([event, participant]) },
        ],
    });

    return (
        <>
            <Head title={`${participant.name} — ${event.name}`} />

            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4">
                <div className="flex items-start gap-4">
                    <Avatar className="size-20">
                        {participant.photo_url && (
                            <AvatarImage
                                src={participant.photo_url}
                                alt={participant.name}
                            />
                        )}
                        <AvatarFallback className="text-xl">
                            {initials(participant.name)}
                        </AvatarFallback>
                    </Avatar>
                    <Heading
                        title={participant.name}
                        description={
                            participant.is_owner
                                ? 'Etkinlik sahibi'
                                : 'Katılımcı'
                        }
                    />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Etkinlikteki hali</CardTitle>
                        <CardDescription>
                            {participant.bio
                                ? participant.bio
                                : 'Henüz kısa bir tanıtım yazılmamış.'}
                        </CardDescription>
                    </CardHeader>
                    {participant.links.length > 0 && (
                        <CardContent className="flex flex-col gap-2">
                            {participant.links.map((link) => (
                                <a
                                    key={`${link.label}-${link.url}`}
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-primary text-sm underline-offset-4 hover:underline"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </CardContent>
                    )}
                </Card>

                {participant.is_self && (
                    <Button asChild>
                        <Link href={editProfile(event)}>
                            <UserRound />
                            Profilimi düzenle
                        </Link>
                    </Button>
                )}

                {prompt && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Bu kişi hakkında bir şey yaz</CardTitle>
                            <CardDescription>{prompt}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form
                                {...storeImpression.form([event, participant])}
                                encType="multipart/form-data"
                                resetOnSuccess
                                className="grid gap-4"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <textarea
                                            name="body"
                                            required
                                            rows={4}
                                            placeholder="Aklına gelen cümleyi yaz."
                                            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                        />
                                        <InputError message={errors.body} />
                                        <div className="grid gap-2">
                                            <Label htmlFor="images">
                                                Görseller
                                            </Label>
                                            <input
                                                id="images"
                                                name="images[]"
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                multiple
                                            />
                                            <InputError
                                                message={errors.images}
                                            />
                                        </div>
                                        <fieldset className="grid gap-2 text-sm">
                                            <legend className="font-medium">
                                                Adın görünsün mü?
                                            </legend>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="shows_author_name"
                                                    value="1"
                                                    defaultChecked
                                                />
                                                İsmimle göster
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="shows_author_name"
                                                    value="0"
                                                />
                                                İsimsiz göster
                                            </label>
                                        </fieldset>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing && <Spinner />}
                                            İzlenimi bırak
                                        </Button>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>
                            {participant.is_self
                                ? 'Hakkında yazılanlar'
                                : 'Hakkında bırakılan izlenimler'}
                        </CardTitle>
                        <CardDescription>
                            {impressions.length === 0
                                ? participant.is_self
                                    ? 'Henüz kimse senin hakkında bir şey yazmamış. Bu da bir şey söyler: belki henüz tanışıyorlar.'
                                    : 'Henüz bir izlenim yok. İlk cümleyi sen bırakabilirsin.'
                                : 'Eski cümleler yenilerinin yerini almaz.'}
                        </CardDescription>
                    </CardHeader>
                    {impressions.length > 0 && (
                        <CardContent className="space-y-4">
                            {impressions.map((impression) => (
                                <div
                                    key={impression.ulid}
                                    className="space-y-2 border-t pt-4 first:border-t-0 first:pt-0"
                                >
                                    <p className="text-muted-foreground text-xs">
                                        {impression.event_day_label}
                                        {' · '}
                                        {impression.author_name ?? 'İsimsiz'}
                                    </p>
                                    <p className="text-sm whitespace-pre-wrap">
                                        {impression.body}
                                    </p>
                                    {impression.attachments.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {impression.attachments.map(
                                                (attachment) => (
                                                    <img
                                                        key={attachment.ulid}
                                                        src={attachment.url}
                                                        alt=""
                                                        className="h-24 rounded-md object-cover"
                                                    />
                                                ),
                                            )}
                                        </div>
                                    )}
                                    {impression.can_update && (
                                        <Form
                                            {...updateImpression.form([
                                                event,
                                                impression,
                                            ])}
                                            className="grid gap-2"
                                        >
                                            <textarea
                                                name="body"
                                                defaultValue={impression.body}
                                                rows={3}
                                                className="border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                                            />
                                            <fieldset className="flex flex-wrap gap-4 text-sm">
                                                <legend className="sr-only">
                                                    Adın görünsün mü?
                                                </legend>
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="shows_author_name"
                                                        value="1"
                                                        defaultChecked={
                                                            impression.shows_author_name !==
                                                            false
                                                        }
                                                    />
                                                    İsmimle göster
                                                </label>
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="shows_author_name"
                                                        value="0"
                                                        defaultChecked={
                                                            impression.shows_author_name ===
                                                            false
                                                        }
                                                    />
                                                    İsimsiz göster
                                                </label>
                                            </fieldset>
                                            <Button
                                                type="submit"
                                                size="sm"
                                                variant="outline"
                                            >
                                                Düzelt
                                            </Button>
                                        </Form>
                                    )}
                                    {impression.can_delete && (
                                        <Form
                                            {...destroyImpression.form([
                                                event,
                                                impression,
                                            ])}
                                        >
                                            <Button
                                                type="submit"
                                                size="sm"
                                                variant="ghost"
                                            >
                                                Kaldır
                                            </Button>
                                        </Form>
                                    )}
                                    {impression.can_hide && (
                                        <Form
                                            {...hideImpression.form([
                                                event,
                                                impression,
                                            ])}
                                        >
                                            <Button
                                                type="submit"
                                                size="sm"
                                                variant="ghost"
                                            >
                                                Profilimden gizle
                                            </Button>
                                        </Form>
                                    )}
                                    {impression.can_report && (
                                        <Form
                                            {...reportImpression.form([
                                                event,
                                                impression,
                                            ])}
                                            className="flex flex-wrap items-center gap-2"
                                        >
                                            <input
                                                type="hidden"
                                                name="reason"
                                                value="inappropriate"
                                            />
                                            <Button
                                                type="submit"
                                                size="sm"
                                                variant="ghost"
                                            >
                                                Bildir
                                            </Button>
                                        </Form>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    )}
                </Card>
            </div>
        </>
    );
}
