import { Head, Link } from '@inertiajs/react';
import { CalendarPlus } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    create,
    index,
    show,
} from '@/actions/App/Http/Controllers/EventController';
import type { EventSummary } from '@/types';

type Props = {
    events: EventSummary[];
};

export default function EventsIndex({ events }: Props) {
    return (
        <>
            <Head title="Etkinliklerim" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <Heading
                        title="Etkinliklerim"
                        description="Sahibi olduğunuz ve katıldığınız etkinlikler"
                    />
                    <Button asChild>
                        <Link href={create()}>
                            <CalendarPlus />
                            Yeni etkinlik
                        </Link>
                    </Button>
                </div>

                {events.length === 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Henüz bir etkinliğiniz yok</CardTitle>
                            <CardDescription>
                                Birlikte geçirdiğiniz dönemin zaman kapsülünü
                                oluşturmak için ilk etkinliği siz açabilirsiniz.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {events.map((event) => (
                            <Link key={event.ulid} href={show(event)} prefetch>
                                <Card className="hover:bg-muted/40 h-full transition-colors">
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-2">
                                            <CardTitle>{event.name}</CardTitle>
                                            <Badge variant="secondary">
                                                {event.status_label}
                                            </Badge>
                                        </div>
                                        <CardDescription>
                                            {event.starts_on}
                                            {event.ends_on
                                                ? ` — ${event.ends_on}`
                                                : ''}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-muted-foreground text-sm">
                                        <p>{event.description}</p>
                                        <p className="mt-3">
                                            {event.participants_count} katılımcı
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

EventsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Etkinliklerim',
            href: index(),
        },
    ],
};
