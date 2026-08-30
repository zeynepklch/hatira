import { Form, Head, setLayoutProps } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { index, show } from '@/actions/App/Http/Controllers/EventController';
import {
    edit,
    update,
} from '@/actions/App/Http/Controllers/Events/ProfileController';
import type { EventDetail, ProfileLink } from '@/types';

type Props = {
    event: Pick<EventDetail, 'ulid' | 'name'>;
    profile: {
        name: string;
        bio: string | null;
        links: ProfileLink[];
        photo_url: string | null;
    };
};

export default function EventProfileEdit({ event, profile }: Props) {
    setLayoutProps({
        breadcrumbs: [
            { title: 'Etkinliklerim', href: index() },
            { title: event.name, href: show(event) },
            { title: 'Etkinlik profilim', href: edit(event) },
        ],
    });

    const defaultLinks = [
        ...profile.links,
        ...Array.from(
            { length: Math.max(0, 5 - profile.links.length) },
            () => ({
                label: '',
                url: '',
            }),
        ),
    ];

    return (
        <>
            <Head title={`${event.name} — Profilim`} />

            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4">
                <Heading
                    title="Etkinlik profilin"
                    description="Yıllar sonra hatırlanmanı kolaylaştıracak kısa bir tanıtım."
                />

                {profile.photo_url && (
                    <img
                        src={profile.photo_url}
                        alt={profile.name}
                        className="size-24 rounded-full object-cover"
                    />
                )}

                <Form
                    {...update.form(event)}
                    encType="multipart/form-data"
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="photo">Profil fotoğrafı</Label>
                                <Input
                                    id="photo"
                                    name="photo"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                />
                                <InputError message={errors.photo} />
                            </div>

                            {profile.photo_url && (
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        name="remove_photo"
                                        value="1"
                                    />
                                    Fotoğrafı kaldır
                                </label>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="bio">
                                    Kısa açıklama{' '}
                                    <span className="text-muted-foreground">
                                        (isteğe bağlı)
                                    </span>
                                </Label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    rows={4}
                                    maxLength={280}
                                    defaultValue={profile.bio ?? ''}
                                    placeholder="Laravel öğrenmek için geldim. Kamp sonunda galiba en çok gece yapılan sohbetleri hatırlayacağım."
                                    className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                />
                                <InputError message={errors.bio} />
                            </div>

                            {defaultLinks.map((link, index) => (
                                <div
                                    key={`${link.label}-${index}`}
                                    className="grid gap-4 sm:grid-cols-2"
                                >
                                    <div className="grid gap-2">
                                        <Label htmlFor={`links-${index}-label`}>
                                            Bağlantı adı
                                        </Label>
                                        <Input
                                            id={`links-${index}-label`}
                                            name={`links[${index}][label]`}
                                            defaultValue={link.label}
                                            placeholder="Site"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor={`links-${index}-url`}>
                                            Adres
                                        </Label>
                                        <Input
                                            id={`links-${index}-url`}
                                            name={`links[${index}][url]`}
                                            defaultValue={link.url}
                                            placeholder="https://"
                                        />
                                    </div>
                                </div>
                            ))}
                            <InputError
                                message={
                                    errors.links ??
                                    errors['links.0.url'] ??
                                    errors['links.0.label']
                                }
                            />

                            <Button type="submit" disabled={processing}>
                                {processing && <Spinner />}
                                Profili kaydet
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}
