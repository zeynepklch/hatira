import { Form, Head, setLayoutProps } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
    destroy,
    edit,
    index,
    show,
    update,
} from '@/actions/App/Http/Controllers/EventController';
import {
    destroy as destroyCover,
    update as updateCover,
} from '@/actions/App/Http/Controllers/Events/EventCoverController';
import type { EventFormValues } from '@/types';

type Props = {
    event: EventFormValues;
    transferable_participants: { ulid: string; name: string }[];
    allowed_statuses: string[];
};

export default function EventsEdit({
    event,
    transferable_participants,
    allowed_statuses,
}: Props) {
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
            {
                title: 'Düzenle',
                href: edit(event),
            },
        ],
    });

    return (
        <>
            <Head title={`${event.name} — Düzenle`} />

            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4">
                <Heading
                    title="Etkinliği düzenle"
                    description="Etkinlik bilgilerini güncelleyin"
                />

                {event.cover_url && (
                    <img
                        src={event.cover_url}
                        alt=""
                        className="h-40 w-full rounded-xl object-cover"
                    />
                )}

                <Form
                    {...updateCover.form(event)}
                    encType="multipart/form-data"
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <div className="grid gap-2">
                            <Label htmlFor="cover">Kapak görseli</Label>
                            <Input
                                id="cover"
                                name="cover"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                required
                            />
                            <InputError message={errors.cover} />
                            <Button
                                type="submit"
                                variant="outline"
                                disabled={processing}
                            >
                                {processing && <Spinner />}
                                Kapağı yükle
                            </Button>
                        </div>
                    )}
                </Form>

                {event.cover_url && (
                    <Form {...destroyCover.form(event)}>
                        {({ processing }) => (
                            <Button
                                type="submit"
                                variant="ghost"
                                disabled={processing}
                            >
                                Kapağı kaldır
                            </Button>
                        )}
                    </Form>
                )}

                <Form {...update.form(event)} className="space-y-6">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Etkinlik adı</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    autoFocus
                                    defaultValue={event.name}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">
                                    Kısa açıklama
                                </Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    required
                                    rows={3}
                                    defaultValue={event.description}
                                    className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="location">
                                    Konum{' '}
                                    <span className="text-muted-foreground">
                                        (isteğe bağlı)
                                    </span>
                                </Label>
                                <Input
                                    id="location"
                                    name="location"
                                    defaultValue={event.location ?? ''}
                                />
                                <InputError message={errors.location} />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="starts_on">
                                        Başlangıç tarihi
                                    </Label>
                                    <Input
                                        id="starts_on"
                                        name="starts_on"
                                        type="date"
                                        required
                                        defaultValue={event.starts_on}
                                    />
                                    <InputError message={errors.starts_on} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="ends_on">
                                        Bitiş tarihi{' '}
                                        <span className="text-muted-foreground">
                                            (isteğe bağlı)
                                        </span>
                                    </Label>
                                    <Input
                                        id="ends_on"
                                        name="ends_on"
                                        type="date"
                                        defaultValue={event.ends_on ?? ''}
                                    />
                                    <InputError message={errors.ends_on} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="long_description">
                                    Uzun açıklama{' '}
                                    <span className="text-muted-foreground">
                                        (isteğe bağlı)
                                    </span>
                                </Label>
                                <textarea
                                    id="long_description"
                                    name="long_description"
                                    rows={5}
                                    defaultValue={event.long_description ?? ''}
                                    className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                />
                                <InputError message={errors.long_description} />
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing && <Spinner />}
                                Değişiklikleri kaydet
                            </Button>
                        </>
                    )}
                </Form>

                <Form
                    action={`/events/${event.ulid}/status`}
                    method="put"
                    className="space-y-4"
                >
                    <Heading
                        title="Yaşam döngüsü"
                        description="Tamamlanmış etkinlikte içerik kaybolmaz. Yıllık kilitlenirse yeni izlenim ve anı yazılamaz."
                    />
                    {allowed_statuses.length === 0 && (
                        <input
                            type="hidden"
                            name="status"
                            value={event.status}
                        />
                    )}
                    {allowed_statuses.length > 0 && (
                        <div className="grid gap-2">
                            <Label htmlFor="status">Yeni durum</Label>
                            <select
                                id="status"
                                name="status"
                                className="border-input dark:bg-input/30 rounded-md border bg-transparent px-3 py-2 text-sm"
                                defaultValue={event.status}
                            >
                                <option value={event.status}>
                                    {event.status}
                                </option>
                                {allowed_statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="hidden"
                            name="allows_content_after_close"
                            value="0"
                        />
                        <input
                            type="checkbox"
                            name="allows_content_after_close"
                            value="1"
                            defaultChecked={
                                event.allows_content_after_close !== false
                            }
                        />
                        Hatıralar açık kalsın
                    </label>
                    <Button type="submit" variant="outline">
                        Durumu kaydet
                    </Button>
                </Form>

                {transferable_participants.length > 0 && (
                    <Form
                        action={`/events/${event.ulid}/owner`}
                        method="put"
                        className="space-y-4"
                    >
                        <Heading
                            title="Sahipliği devret"
                            description="Yalnızca etkinliğe bağlı aktif bir katılımcıya devredebilirsin."
                        />
                        <select
                            name="participant_ulid"
                            className="border-input dark:bg-input/30 rounded-md border bg-transparent px-3 py-2 text-sm"
                        >
                            {transferable_participants.map((participant) => (
                                <option
                                    key={participant.ulid}
                                    value={participant.ulid}
                                >
                                    {participant.name}
                                </option>
                            ))}
                        </select>
                        <Button type="submit" variant="outline">
                            Devret
                        </Button>
                    </Form>
                )}

                <Form {...destroy.form(event)}>
                    {({ processing }) => (
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={processing}
                        >
                            Etkinliği sil
                        </Button>
                    )}
                </Form>
            </div>
        </>
    );
}
