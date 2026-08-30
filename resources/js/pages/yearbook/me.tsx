import { Head, Link } from '@inertiajs/react';
import { index as eventsIndex } from '@/actions/App/Http/Controllers/EventController';
import type { PresentedImpression } from '@/pages/events/impressions/index';
import type { PresentedMemory } from '@/pages/events/memories/index';

type PersonalEvent = {
    ulid: string;
    name: string;
    cover_url: string | null;
    starts_on: string;
    profile: {
        name: string;
        bio: string | null;
        photo_url: string | null;
    };
    about_me: PresentedImpression[];
    written_by_me: PresentedImpression[];
    my_memories: PresentedMemory[];
};

type Props = {
    events: PersonalEvent[];
};

export default function MyYearbook({ events }: Props) {
    return (
        <>
            <Head title="Benim yıllığım" />

            <div className="yearbook-screen-only mx-auto flex max-w-3xl justify-between gap-4 p-4 print:hidden">
                <Link href={eventsIndex()} className="text-sm underline">
                    Etkinliklerime dön
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
                Bu dosya senin hatıran. Yalnızca görebileceğin içerikler var.
            </p>

            {events.length === 0 ? (
                <p className="mx-auto max-w-3xl px-6 py-10">
                    Henüz bir etkinlik yıllığın yok.
                </p>
            ) : (
                events.map((event) => (
                    <article
                        key={event.ulid}
                        className="yearbook-break mx-auto max-w-3xl px-6 py-10"
                    >
                        {event.cover_url && (
                            <img
                                src={event.cover_url}
                                alt=""
                                className="mb-6 h-48 w-full rounded-xl object-cover"
                            />
                        )}
                        <h1 className="text-3xl font-semibold">{event.name}</h1>
                        <p className="mt-2 text-sm">{event.starts_on}</p>
                        <h2 className="mt-8 text-xl font-semibold">
                            {event.profile.name}
                        </h2>
                        {event.profile.bio && (
                            <p className="mt-2">{event.profile.bio}</p>
                        )}

                        <h3 className="mt-8 text-lg font-semibold">
                            Hakkımda yazılanlar
                        </h3>
                        {event.about_me.length === 0 ? (
                            <p className="mt-2 text-sm">Henüz bir cümle yok.</p>
                        ) : (
                            event.about_me.map((impression) => (
                                <p
                                    key={impression.ulid}
                                    className="yearbook-section mt-3 whitespace-pre-wrap"
                                >
                                    <span className="text-muted-foreground text-xs">
                                        {impression.author_name ?? 'İsimsiz'} ·{' '}
                                        {impression.event_day_label}
                                    </span>
                                    <br />
                                    {impression.body}
                                </p>
                            ))
                        )}

                        <h3 className="mt-8 text-lg font-semibold">
                            Benim yazdıklarım
                        </h3>
                        {event.written_by_me.length === 0 ? (
                            <p className="mt-2 text-sm">
                                Bu etkinlikte henüz yazmadın.
                            </p>
                        ) : (
                            event.written_by_me.map((impression) => (
                                <p
                                    key={impression.ulid}
                                    className="yearbook-section mt-3 whitespace-pre-wrap"
                                >
                                    <span className="text-muted-foreground text-xs">
                                        {impression.subject_name} ·{' '}
                                        {impression.event_day_label}
                                    </span>
                                    <br />
                                    {impression.body}
                                </p>
                            ))
                        )}

                        <h3 className="mt-8 text-lg font-semibold">
                            Bıraktığım anılar
                        </h3>
                        {event.my_memories.length === 0 ? (
                            <p className="mt-2 text-sm">Anı bırakmadın.</p>
                        ) : (
                            event.my_memories.map((memory) => (
                                <p
                                    key={memory.ulid}
                                    className="yearbook-section mt-3 whitespace-pre-wrap"
                                >
                                    {memory.body}
                                </p>
                            ))
                        )}
                    </article>
                ))
            )}
        </>
    );
}
