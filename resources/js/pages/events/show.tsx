import { Form, Head, Link, setLayoutProps } from '@inertiajs/react';
import { Pencil, UserRound, Users } from 'lucide-react';
import Heading from '@/components/heading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useInitials } from '@/hooks/use-initials';
import {
    edit,
    index,
    show,
} from '@/actions/App/Http/Controllers/EventController';
import { edit as editProfile } from '@/actions/App/Http/Controllers/Events/ProfileController';
import { index as myImpressions } from '@/actions/App/Http/Controllers/Events/ImpressionController';
import { index as memoriesIndex } from '@/actions/App/Http/Controllers/Events/MemoryController';
import { index as participantsIndex } from '@/actions/App/Http/Controllers/Events/ParticipantController';
import { show as eventYearbook } from '@/actions/App/Http/Controllers/Events/YearbookController';
import { show as participantShow } from '@/actions/App/Http/Controllers/Events/ParticipantProfileController';
import type { EventDetail } from '@/types';

type FeedItem = {
    type: 'memory' | 'impression' | 'participant';
    occurred_at: string | null;
    headline: string;
};

type Props = {
    event: EventDetail;
    feed: FeedItem[];
};

export default function EventsShow({ event, feed }: Props) {
    const initials = useInitials();

    setLayoutProps({
        breadcrumbs: [
            {
                title: 'Etkinliklerim',
                href: index(),
            },
            {
                title: event.name,
                href: show(event),
            },
        ],
    });

    return (
        <>
            <Head title={event.name} />

            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4">
                {event.cover_url && (
                    <img
                        src={event.cover_url}
                        alt=""
                        className="h-48 w-full rounded-xl object-cover"
                    />
                )}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <Heading
                        title={event.name}
                        description={event.description}
                    />
                    <Badge variant="secondary">{event.status_label}</Badge>
                </div>

                <p className="text-muted-foreground text-sm">
                    {event.starts_on}
                    {event.ends_on ? ` — ${event.ends_on}` : ''}
                    {event.location ? ` · ${event.location}` : ''}
                </p>

                {event.long_description && (
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-sm whitespace-pre-wrap">
                                {event.long_description}
                            </p>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Birlikte olanlar</CardTitle>
                        <CardDescription>
                            Birine dokunarak etkinlik profiline gidebilirsin.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-3">
                        {event.participants.map((participant) => (
                            <Link
                                key={participant.ulid}
                                href={participantShow([event, participant])}
                                prefetch
                                className="flex w-16 flex-col items-center gap-1"
                            >
                                <Avatar className="size-12">
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
                                <span className="w-full truncate text-center text-xs">
                                    {participant.name}
                                </span>
                            </Link>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Son olanlar</CardTitle>
                        <CardDescription>
                            Beğeni yok, sıralama yok. Sadece neler olduğunu
                            hatırlamak için.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {feed.length === 0 ? (
                            <p className="text-muted-foreground text-sm">
                                Henüz akışta bir şey yok. Bir anı bırakmak veya
                                birine dair ilk cümleyi yazmak yeterli.
                            </p>
                        ) : (
                            feed.map((item, index) => (
                                <p
                                    key={`${item.type}-${item.occurred_at}-${index}`}
                                    className="text-sm"
                                >
                                    {item.headline}
                                </p>
                            ))
                        )}
                    </CardContent>
                </Card>

                <div className="flex flex-wrap gap-2">
                    <Button asChild>
                        <Link href={participantsIndex(event)} prefetch>
                            <Users />
                            Katılımcılar
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={editProfile(event)} prefetch>
                            <UserRound />
                            Etkinlik profilim
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={eventYearbook(event)} prefetch>
                            Yıllık
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={memoriesIndex(event)} prefetch>
                            Anılar
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={myImpressions(event)} prefetch>
                            Yazdığım izlenimler
                        </Link>
                    </Button>
                    {event.can_moderate && (
                        <Button variant="outline" asChild>
                            <Link
                                href={`/events/${event.ulid}/moderation`}
                                prefetch
                            >
                                Moderasyon
                            </Link>
                        </Button>
                    )}
                    {event.is_owner && (
                        <Button variant="outline" asChild>
                            <Link href={edit(event)} prefetch>
                                <Pencil />
                                Düzenle
                            </Link>
                        </Button>
                    )}
                    {!event.is_owner && (
                        <Form
                            action={`/events/${event.ulid}/participation`}
                            method="delete"
                        >
                            <Button type="submit" variant="ghost">
                                Etkinlikten ayrıl
                            </Button>
                        </Form>
                    )}
                </div>
            </div>
        </>
    );
}
