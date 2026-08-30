import { Form, Head, setLayoutProps } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    index as eventsIndex,
    show as eventShow,
} from '@/actions/App/Http/Controllers/EventController';
import { update } from '@/actions/App/Http/Controllers/Events/ModerationController';
import type { EventDetail } from '@/types';

type ReportItem = {
    ulid: string;
    reason: string;
    note: string | null;
    status: string;
    reporter_name: string;
    body: string;
    type: string;
};

type Props = {
    event: Pick<EventDetail, 'ulid' | 'name'>;
    reports: ReportItem[];
};

export default function EventModeration({ event, reports }: Props) {
    setLayoutProps({
        breadcrumbs: [
            { title: 'Etkinliklerim', href: eventsIndex() },
            { title: event.name, href: eventShow(event) },
            { title: 'Moderasyon', href: '#' },
        ],
    });

    return (
        <>
            <Head title={`${event.name} — Moderasyon`} />

            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4">
                <Heading
                    title="Moderasyon"
                    description="Bildirilen içerikleri incele. Gizlemek kaydı durdurur, kaldırmak kalıcıdır."
                />

                {reports.length === 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Açık bildirim yok</CardTitle>
                            <CardDescription>
                                Bir şey bildirildiğinde burada durur.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ) : (
                    reports.map((report) => (
                        <Card key={report.ulid}>
                            <CardHeader>
                                <CardTitle>
                                    {report.type} · {report.reason}
                                </CardTitle>
                                <CardDescription>
                                    {report.reporter_name} bildirdi ·{' '}
                                    {report.status}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p className="text-sm whitespace-pre-wrap">
                                    {report.body}
                                </p>
                                {report.note && (
                                    <p className="text-muted-foreground text-sm">
                                        {report.note}
                                    </p>
                                )}
                                {report.status === 'open' && (
                                    <div className="flex flex-wrap gap-2">
                                        <Form {...update.form([event, report])}>
                                            <input
                                                type="hidden"
                                                name="action"
                                                value="hide"
                                            />
                                            <Button
                                                type="submit"
                                                size="sm"
                                                variant="outline"
                                            >
                                                Gizle
                                            </Button>
                                        </Form>
                                        <Form {...update.form([event, report])}>
                                            <input
                                                type="hidden"
                                                name="action"
                                                value="remove"
                                            />
                                            <Button
                                                type="submit"
                                                size="sm"
                                                variant="destructive"
                                            >
                                                Kaldır
                                            </Button>
                                        </Form>
                                        <Form {...update.form([event, report])}>
                                            <input
                                                type="hidden"
                                                name="action"
                                                value="dismiss"
                                            />
                                            <Button
                                                type="submit"
                                                size="sm"
                                                variant="ghost"
                                            >
                                                Görmezden gel
                                            </Button>
                                        </Form>
                                    </div>
                                )}
                                <p className="text-muted-foreground text-xs">
                                    Kaldırılan içerik daha önce üretilmiş yıllık
                                    çıktılarından geri alınamaz.
                                </p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </>
    );
}
