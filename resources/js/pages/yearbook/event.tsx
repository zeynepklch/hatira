import { Head, Link } from '@inertiajs/react';
import { show as eventShow } from '@/actions/App/Http/Controllers/EventController';
import type { PresentedImpression } from '@/pages/events/impressions/index';
import type { PresentedMemory } from '@/pages/events/memories/index';

type YearbookParticipant = {
    ulid: string;
    name: string;
    bio: string | null;
    photo_url: string | null;
    impressions: PresentedImpression[];
};

type Props = {
    event: {
        ulid: string;
        name: string;
        description: string;
        long_description: string | null;
        location: string | null;
        cover_url: string | null;
        starts_on: string;
        ends_on: string | null;
    };
    memories: PresentedMemory[];
    participants: YearbookParticipant[];
};

export default function EventYearbook({
    event,
    memories,
    participants,
}: Props) {
    return (
        <>
            <Head title={`${event.name} — Yıllık`} />

            <div className="yearbook-screen-only mx-auto flex max-w-3xl justify-between gap-4 p-4 print:hidden">
                <Link href={eventShow(event)} className="text-sm underline">
                    Etkinliğe dön
                </Link>
                <button
                    type="button"
                    onClick={() => window.print()}
                    className="text-sm underline"
                >
                    PDF olarak kaydet
                </button>
            </div>
            <p className="yearbook-screen-only text-muted-foreground mx-auto max-w-3xl px-4 pb-6 text-sm print:hidden">
                Yazdır penceresinden “PDF olarak kaydet”i seç. Web’de görünmeyen
                hiçbir şey bu çıktıya girmez.
            </p>

            <article className="yearbook-break mx-auto max-w-3xl px-6 py-10">
                {event.cover_url && (
                    <img
                        src={event.cover_url}
                        alt=""
                        className="mb-6 h-64 w-full rounded-xl object-cover"
                    />
                )}
                <h1 className="text-4xl font-semibold">{event.name}</h1>
                <p className="mt-2 text-sm">
                    {event.starts_on}
                    {event.ends_on ? ` — ${event.ends_on}` : ''}
                    {event.location ? ` · ${event.location}` : ''}
                </p>
                <p className="mt-4 text-base">{event.description}</p>
                {event.long_description && (
                    <p className="mt-4 whitespace-pre-wrap">
                        {event.long_description}
                    </p>
                )}
            </article>

            <section className="yearbook-break yearbook-section mx-auto max-w-3xl px-6 py-10">
                <h2 className="mb-6 text-2xl font-semibold">Katılımcılar</h2>
                <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
                    {participants.map((participant) => (
                        <div
                            key={participant.ulid}
                            className="flex flex-col items-center gap-2"
                        >
                            {participant.photo_url ? (
                                <img
                                    src={participant.photo_url}
                                    alt=""
                                    className="size-20 rounded-full object-cover"
                                />
                            ) : (
                                <div className="bg-muted size-20 rounded-full" />
                            )}
                            <p className="text-center text-sm">
                                {participant.name}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="yearbook-break mx-auto max-w-3xl px-6 py-10">
                <h2 className="mb-6 text-2xl font-semibold">Anılar</h2>
                {memories.length === 0 ? (
                    <p>Bu etkinlikte henüz ortak bir anı yok.</p>
                ) : (
                    memories.map((memory) => (
                        <div
                            key={memory.ulid}
                            className="yearbook-section mb-8"
                        >
                            <p className="text-muted-foreground text-xs">
                                {memory.author_name} · {memory.event_day_label}
                            </p>
                            <p className="mt-2 whitespace-pre-wrap">
                                {memory.body}
                            </p>
                        </div>
                    ))
                )}
            </section>

            {participants.map((participant) => (
                <section
                    key={participant.ulid}
                    className="yearbook-break mx-auto max-w-3xl px-6 py-10"
                >
                    <div className="mb-6 flex items-center gap-4">
                        {participant.photo_url && (
                            <img
                                src={participant.photo_url}
                                alt=""
                                className="size-16 rounded-full object-cover"
                            />
                        )}
                        <div>
                            <h2 className="text-2xl font-semibold">
                                {participant.name}
                            </h2>
                            {participant.bio && (
                                <p className="text-sm">{participant.bio}</p>
                            )}
                        </div>
                    </div>
                    {participant.impressions.length === 0 ? (
                        <p>Hakkında henüz görünür bir izlenim yok.</p>
                    ) : (
                        participant.impressions.map((impression) => (
                            <div
                                key={impression.ulid}
                                className="yearbook-section mb-6"
                            >
                                <p className="text-muted-foreground text-xs">
                                    {impression.event_day_label} ·{' '}
                                    {impression.author_name ?? 'İsimsiz'}
                                </p>
                                <p className="mt-2 whitespace-pre-wrap">
                                    {impression.body}
                                </p>
                            </div>
                        ))
                    )}
                </section>
            ))}
        </>
    );
}
