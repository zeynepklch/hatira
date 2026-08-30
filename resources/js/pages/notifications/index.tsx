import { Form, Head, Link, setLayoutProps } from '@inertiajs/react';
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
    destroy,
    index,
} from '@/actions/App/Http/Controllers/NotificationController';

type NotificationItem = {
    id: string;
    type: string;
    message: string;
    url: string | null;
    read_at: string | null;
    created_at: string | null;
};

type Props = {
    notifications: NotificationItem[];
};

export default function NotificationsIndex({ notifications }: Props) {
    setLayoutProps({
        breadcrumbs: [{ title: 'Bildirimler', href: index() }],
    });

    return (
        <>
            <Head title="Bildirimler" />

            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4">
                <div className="flex items-start justify-between gap-4">
                    <Heading
                        title="Bildirimler"
                        description="Etkinliklerden gelen sessiz haberler."
                    />
                    {notifications.length > 0 && (
                        <Form {...destroy.form()}>
                            <Button type="submit" variant="ghost" size="sm">
                                Temizle
                            </Button>
                        </Form>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Şimdilik sessiz</CardTitle>
                            <CardDescription>
                                Yeni bir anı, izlenim veya katılım olduğunda
                                burada görünür.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="divide-y">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className="py-4 first:pt-6 last:pb-6"
                                >
                                    {notification.url ? (
                                        <Link
                                            href={notification.url}
                                            className="text-sm hover:underline"
                                        >
                                            {notification.message}
                                        </Link>
                                    ) : (
                                        <p className="text-sm">
                                            {notification.message}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}
