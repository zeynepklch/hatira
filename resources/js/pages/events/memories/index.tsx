import { Form, Head, setLayoutProps } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
    index as eventsIndex,
    show as eventShow,
} from '@/actions/App/Http/Controllers/EventController';
import {
    destroy,
    index,
    store,
    update,
} from '@/actions/App/Http/Controllers/Events/MemoryController';
import { storeMemory as reportMemory } from '@/actions/App/Http/Controllers/Events/ReportController';
import type { EventDetail } from '@/types';

export type PresentedMemory = {
    ulid: string;
    body: string;
    occurred_on: string | null;
    created_at: string | null;
    event_day_label: string;
    display_date: string;
    author_name: string;
    author_ulid: string;
    author_photo_url: string | null;
    attachments: { ulid: string; url: string }[];
    can_update: boolean;
    can_delete: boolean;
    can_report?: boolean;
};

type Props = {
    event: Pick<EventDetail, 'ulid' | 'name'> & {
        starts_on: string;
        ends_on: string | null;
    };
    memories: PresentedMemory[];
};

export default function EventMemories({ event, memories }: Props) {
    setLayoutProps({
        breadcrumbs: [
            { title: 'Etkinliklerim', href: eventsIndex() },
            { title: event.name, href: eventShow(event) },
            { title: 'Anılar', href: index(event) },
        ],
    });

    return (
        <>
            <Head title={`${event.name} — Anılar`} />

            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4">
                <Heading
                    title="Anılar"
                    description="Bu etkinlikte birlikte yaşananlar. Belirli bir kişiye değil, hepimize ait."
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Bir anı bırak</CardTitle>
                        <CardDescription>
                            İstersen olayın gerçek gününü de yazabilirsin.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            {...store.form(event)}
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
                                        placeholder="Bugün ne oldu?"
                                        className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                    />
                                    <InputError message={errors.body} />
                                    <div className="grid gap-2">
                                        <Label htmlFor="occurred_on">
                                            Olayın günü
                                        </Label>
                                        <input
                                            id="occurred_on"
                                            name="occurred_on"
                                            type="date"
                                            className="border-input dark:bg-input/30 rounded-md border bg-transparent px-3 py-2 text-sm"
                                        />
                                        <InputError
                                            message={errors.occurred_on}
                                        />
                                    </div>
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
                                        <InputError message={errors.images} />
                                    </div>
                                    <Button type="submit" disabled={processing}>
                                        {processing && <Spinner />}
                                        Anıyı paylaş
                                    </Button>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>

                {memories.length === 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Henüz anı yok</CardTitle>
                            <CardDescription>
                                İlk anıyı sen bırakabilirsin.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ) : (
                    memories.map((memory) => (
                        <Card key={memory.ulid}>
                            <CardHeader>
                                <CardTitle>{memory.author_name}</CardTitle>
                                <CardDescription>
                                    {memory.event_day_label}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p className="text-sm whitespace-pre-wrap">
                                    {memory.body}
                                </p>
                                {memory.attachments.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {memory.attachments.map(
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
                                {memory.can_update && (
                                    <Form
                                        {...update.form([event, memory])}
                                        className="grid gap-2"
                                    >
                                        <textarea
                                            name="body"
                                            defaultValue={memory.body}
                                            rows={3}
                                            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                                        />
                                        <input
                                            type="date"
                                            name="occurred_on"
                                            defaultValue={
                                                memory.occurred_on ?? ''
                                            }
                                            className="border-input dark:bg-input/30 rounded-md border bg-transparent px-3 py-2 text-sm"
                                        />
                                        <Button
                                            type="submit"
                                            size="sm"
                                            variant="outline"
                                        >
                                            Düzelt
                                        </Button>
                                    </Form>
                                )}
                                {memory.can_delete && (
                                    <Form {...destroy.form([event, memory])}>
                                        <Button
                                            type="submit"
                                            size="sm"
                                            variant="ghost"
                                        >
                                            Kaldır
                                        </Button>
                                    </Form>
                                )}
                                {memory.can_report && (
                                    <Form
                                        {...reportMemory.form([event, memory])}
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
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </>
    );
}
