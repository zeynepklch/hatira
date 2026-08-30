import { Form, Head, Link, setLayoutProps } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
    index as eventsIndex,
    show,
} from '@/actions/App/Http/Controllers/EventController';
import {
    destroy,
    index,
    store,
} from '@/actions/App/Http/Controllers/Events/ParticipantController';
import { store as storeBulk } from '@/actions/App/Http/Controllers/Events/BulkParticipantController';
import { show as participantShow } from '@/actions/App/Http/Controllers/Events/ParticipantProfileController';
import {
    destroy as revokeInvitation,
    store as sendInvitation,
} from '@/actions/App/Http/Controllers/Events/ParticipantInvitationController';
import type { EventDetail, ParticipantSummary } from '@/types';

type Props = {
    event: Pick<
        EventDetail,
        'ulid' | 'name' | 'is_owner' | 'can_manage_participants'
    >;
    participants: ParticipantSummary[];
};

export default function EventParticipantsIndex({ event, participants }: Props) {
    const initials = useInitials();

    setLayoutProps({
        breadcrumbs: [
            {
                title: 'Etkinliklerim',
                href: eventsIndex(),
            },
            {
                title: event.name,
                href: show(event),
            },
            {
                title: 'Katılımcılar',
                href: index(event),
            },
        ],
    });

    return (
        <>
            <Head title={`${event.name} — Katılımcılar`} />

            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4">
                <Heading
                    title="Katılımcılar"
                    description="Hesabı olmayan kişiler de bu listede yer alabilir. E-posta adresi olanlara davet gönderebilirsin."
                />

                {participants.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {participants.map((participant) => (
                            <Link
                                key={`card-${participant.ulid}`}
                                href={participantShow([event, participant])}
                                prefetch
                                className="hover:bg-muted/40 flex flex-col items-center gap-2 rounded-xl border p-4"
                            >
                                <Avatar className="size-16">
                                    {participant.photo_url && (
                                        <AvatarImage
                                            src={participant.photo_url}
                                            alt={participant.name}
                                        />
                                    )}
                                    <AvatarFallback>
                                        {initials(participant.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-center text-sm font-medium">
                                    {participant.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                )}

                {participants.length === 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Henüz kimse eklenmedi</CardTitle>
                            <CardDescription>
                                İlk katılımcıyı ekleyerek listeyi
                                oluşturabilirsiniz.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {participants.length} kişi listede
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="divide-y">
                            {participants.map((participant) => (
                                <div
                                    key={participant.ulid}
                                    className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {participant.name}
                                        </p>
                                        <p className="text-muted-foreground text-sm">
                                            {participant.email ??
                                                'E-posta eklenmedi'}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant="secondary">
                                            {participant.status_label}
                                        </Badge>
                                        {participant.can_invite && (
                                            <Form
                                                {...sendInvitation.form([
                                                    event,
                                                    participant,
                                                ])}
                                            >
                                                {({ processing }) => (
                                                    <Button
                                                        type="submit"
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={processing}
                                                    >
                                                        {participant.status ===
                                                        'not_invited'
                                                            ? 'Davet gönder'
                                                            : 'Yeniden gönder'}
                                                    </Button>
                                                )}
                                            </Form>
                                        )}
                                        {participant.can_revoke && (
                                            <Form
                                                {...revokeInvitation.form([
                                                    event,
                                                    participant,
                                                ])}
                                            >
                                                {({ processing }) => (
                                                    <Button
                                                        type="submit"
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={processing}
                                                    >
                                                        Daveti iptal et
                                                    </Button>
                                                )}
                                            </Form>
                                        )}
                                        {participant.can_delete && (
                                            <Form
                                                {...destroy.form([
                                                    event,
                                                    participant,
                                                ])}
                                            >
                                                {({ processing }) => (
                                                    <Button
                                                        type="submit"
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={processing}
                                                    >
                                                        Kaldır
                                                    </Button>
                                                )}
                                            </Form>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {event.can_manage_participants && (
                    <>
                        <Card>
                            <CardHeader>
                                <CardTitle>Tek tek ekle</CardTitle>
                                <CardDescription>
                                    Yalnızca ad yeterlidir. E-posta daveti için
                                    isteğe bağlıdır.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    {...store.form(event)}
                                    resetOnSuccess
                                    className="grid gap-4 sm:grid-cols-2"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="name">Ad</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    required
                                                    placeholder="Ali Berk"
                                                />
                                                <InputError
                                                    message={errors.name}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="email">
                                                    E-posta{' '}
                                                    <span className="text-muted-foreground">
                                                        (isteğe bağlı)
                                                    </span>
                                                </Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="ali@example.com"
                                                />
                                                <InputError
                                                    message={errors.email}
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                >
                                                    {processing && <Spinner />}
                                                    Katılımcı ekle
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </Form>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Toplu ekle</CardTitle>
                                <CardDescription>
                                    Her satıra bir kişi yazın. Biçim:{' '}
                                    <span className="font-medium">
                                        Ad, e-posta
                                    </span>{' '}
                                    veya yalnızca ad.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    {...storeBulk.form(event)}
                                    resetOnSuccess
                                    className="grid gap-4"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="list">
                                                    Katılımcı listesi
                                                </Label>
                                                <textarea
                                                    id="list"
                                                    name="list"
                                                    rows={6}
                                                    placeholder={
                                                        'Ali Berk, ali@example.com\nAyşe Yılmaz, ayse@example.com\nMehmet Demir'
                                                    }
                                                    className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                                />
                                                <InputError
                                                    message={
                                                        errors.list ??
                                                        errors.participants
                                                    }
                                                />
                                            </div>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing && <Spinner />}
                                                Listeyi ekle
                                            </Button>
                                        </>
                                    )}
                                </Form>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </>
    );
}
