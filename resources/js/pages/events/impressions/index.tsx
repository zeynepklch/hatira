import { Form, Head, Link, setLayoutProps } from '@inertiajs/react';
import Heading from '@/components/heading';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    index as eventsIndex,
    show as eventShow,
} from '@/actions/App/Http/Controllers/EventController';
import {
    destroy,
    index,
    update,
} from '@/actions/App/Http/Controllers/Events/ImpressionController';
import { show as participantShow } from '@/actions/App/Http/Controllers/Events/ParticipantProfileController';
import type { EventDetail } from '@/types';

export type PresentedImpression = {
    ulid: string;
    body: string;
    created_at: string | null;
    event_day_label: string;
    attachments: { ulid: string; url: string }[];
    can_update: boolean;
    can_delete: boolean;
    can_hide?: boolean;
    can_report?: boolean;
    author_name?: string;
    author_ulid?: string;
    shows_author_name?: boolean;
    subject_name?: string;
    subject_ulid?: string;
};

type Props = {
    event: Pick<EventDetail, 'ulid' | 'name'>;
    impressions: PresentedImpression[];
};

export default function MyImpressions({ event, impressions }: Props) {
    setLayoutProps({
        breadcrumbs: [
            { title: 'Etkinliklerim', href: eventsIndex() },
            { title: event.name, href: eventShow(event) },
            { title: 'Yazdıklarım', href: index(event) },
        ],
    });

    const grouped = impressions.reduce<Record<string, PresentedImpression[]>>(
        (groups, impression) => {
            const key = impression.subject_ulid ?? 'unknown';
            groups[key] = [...(groups[key] ?? []), impression];
            return groups;
        },
        {},
    );

    return (
        <>
            <Head title={`${event.name} — Yazdıklarım`} />

            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4">
                <Heading
                    title="Yazdığın izlenimler"
                    description="Aynı kişi hakkında zaman içinde bıraktığın cümleler burada durur."
                />

                {impressions.length === 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Henüz kimse hakkında yazmadın</CardTitle>
                            <CardDescription>
                                Tanıştığın birine dair ilk cümleni
                                bırakabilirsin. Zorunlu değil.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ) : (
                    Object.entries(grouped).map(([subjectUlid, items]) => (
                        <Card key={subjectUlid}>
                            <CardHeader>
                                <CardTitle>
                                    {items[0]?.subject_ulid ? (
                                        <Link
                                            href={participantShow([
                                                event,
                                                {
                                                    ulid: items[0].subject_ulid,
                                                },
                                            ])}
                                            className="hover:underline"
                                        >
                                            {items[0].subject_name}
                                        </Link>
                                    ) : (
                                        items[0]?.subject_name
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {items.map((impression) => (
                                    <ImpressionCard
                                        key={impression.ulid}
                                        event={event}
                                        impression={impression}
                                    />
                                ))}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </>
    );
}

function ImpressionCard({
    event,
    impression,
}: {
    event: Pick<EventDetail, 'ulid' | 'name'>;
    impression: PresentedImpression;
}) {
    return (
        <div className="space-y-2 border-t pt-4 first:border-t-0 first:pt-0">
            <p className="text-muted-foreground text-xs">
                {impression.event_day_label}
                {impression.shows_author_name === false ? ' · İsimsiz' : ''}
            </p>
            <p className="text-sm whitespace-pre-wrap">{impression.body}</p>
            {impression.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {impression.attachments.map((attachment) => (
                        <img
                            key={attachment.ulid}
                            src={attachment.url}
                            alt=""
                            className="h-24 rounded-md object-cover"
                        />
                    ))}
                </div>
            )}
            <div className="flex flex-wrap gap-2">
                {impression.can_update && (
                    <Form
                        {...update.form([event, impression])}
                        className="grid w-full gap-2"
                    >
                        <textarea
                            name="body"
                            defaultValue={impression.body}
                            rows={3}
                            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
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
                                        impression.shows_author_name !== false
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
                                        impression.shows_author_name === false
                                    }
                                />
                                İsimsiz göster
                            </label>
                        </fieldset>
                        <Button type="submit" size="sm" variant="outline">
                            Düzelt
                        </Button>
                    </Form>
                )}
                {impression.can_delete && (
                    <Form {...destroy.form([event, impression])}>
                        <Button type="submit" size="sm" variant="ghost">
                            Kaldır
                        </Button>
                    </Form>
                )}
            </div>
        </div>
    );
}
