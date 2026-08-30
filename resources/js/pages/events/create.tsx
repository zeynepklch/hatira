import { Form, Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
    create,
    index,
    store,
} from '@/actions/App/Http/Controllers/EventController';

export default function EventsCreate() {
    return (
        <>
            <Head title="Yeni etkinlik" />

            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4">
                <Heading
                    title="Yeni etkinlik"
                    description="Birlikte geçirdiğiniz dönemin hatıra alanını oluşturun"
                />

                <Form {...store.form()} className="space-y-6">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Etkinlik adı</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    autoFocus
                                    placeholder="Özgür Yazılım Yaz Kampı 2026 — Laravel"
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
                                    placeholder="Dokuz gün boyunca aynı sınıfta eğitim alan Laravel sınıfının ortak hatıra alanı."
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
                                    placeholder="Bolu"
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
                                    className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                />
                                <InputError message={errors.long_description} />
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing && <Spinner />}
                                Etkinliği oluştur
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

EventsCreate.layout = {
    breadcrumbs: [
        {
            title: 'Etkinliklerim',
            href: index(),
        },
        {
            title: 'Yeni etkinlik',
            href: create(),
        },
    ],
};
