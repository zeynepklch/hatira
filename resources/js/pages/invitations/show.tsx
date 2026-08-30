import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/actions/App/Http/Controllers/InvitationController';
import { login, register } from '@/routes';

type Props = {
    token: string;
    event: {
        name: string;
        description: string;
        location: string | null;
        starts_on: string;
        ends_on: string | null;
    };
    invitee_name: string;
    inviter_name: string;
    is_authenticated: boolean;
    email_mismatch: boolean;
    already_joined: boolean;
};

export default function InvitationShow({
    token,
    event,
    invitee_name,
    inviter_name,
    is_authenticated,
    email_mismatch,
    already_joined,
}: Props) {
    return (
        <>
            <Head title={`${event.name} daveti`} />

            <div className="flex flex-col gap-6">
                <div className="space-y-2">
                    <p className="text-muted-foreground text-sm">
                        {inviter_name} seni davet etti
                    </p>
                    <h1 className="text-2xl font-semibold">{event.name}</h1>
                    <p className="text-muted-foreground text-sm">
                        {event.starts_on}
                        {event.ends_on ? ` — ${event.ends_on}` : ''}
                        {event.location ? ` · ${event.location}` : ''}
                    </p>
                    <p className="text-sm">{event.description}</p>
                    <p className="text-sm">
                        Bu davet{' '}
                        <span className="font-medium">{invitee_name}</span> için
                        hazırlandı.
                    </p>
                </div>

                <div className="bg-muted/50 space-y-3 rounded-lg p-4 text-sm">
                    <p className="font-medium">
                        Katılırken şunları kabul etmiş olursun:
                    </p>
                    <ul className="text-muted-foreground list-disc space-y-2 pl-5">
                        <li>
                            Buradaki şeyler birlikte geçirdiğiniz dönemin
                            hatırası olarak kalacak. İnsanlar hakkında eğlenceli
                            ve samimi şeyler yazabilirsiniz; ancak hakaret,
                            aşağılama, taciz, özel bilgi paylaşımı veya
                            insanları rahatsız etmek için bu alanı kullanmayın.
                        </li>
                        <li>
                            Etkinlikteki diğer kişiler senin hakkında yazı
                            yazabilir ve bu içerikler diğer katılımcılar
                            tarafından görülebilir.
                        </li>
                        <li>
                            Bazı içerikler yazar adı gösterilmeden, isimsiz
                            paylaşılabilir.
                        </li>
                        <li>
                            Yazdığın içerikler ve yüklenen görseller yıllık
                            çıktılarında yer alabilir.
                        </li>
                    </ul>
                </div>

                {already_joined ? (
                    <p className="text-sm">Bu daveti zaten kabul ettin.</p>
                ) : email_mismatch ? (
                    <p className="text-destructive text-sm">
                        Bu davet başka bir e-posta adresine gönderildi.
                        Davetteki e-posta ile giriş yapman gerekiyor.
                    </p>
                ) : is_authenticated ? (
                    <Form {...store.form(token)} className="grid gap-4">
                        {({ processing, errors }) => (
                            <>
                                <div className="flex items-start gap-3">
                                    <Checkbox
                                        id="consent"
                                        name="consent"
                                        value="1"
                                        required
                                    />
                                    <Label
                                        htmlFor="consent"
                                        className="leading-5"
                                    >
                                        İçerik kurallarını ve rıza metnini
                                        okudum, kabul ediyorum.
                                    </Label>
                                </div>
                                <InputError
                                    message={
                                        errors.consent ?? errors.invitation
                                    }
                                />
                                <Button type="submit" disabled={processing}>
                                    {processing && <Spinner />}
                                    Daveti kabul et
                                </Button>
                            </>
                        )}
                    </Form>
                ) : (
                    <div className="grid gap-3">
                        <Button asChild>
                            <Link href={register()}>
                                Hesap oluştur ve katıl
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={login()}>Giriş yap</Link>
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}

InvitationShow.layout = {
    title: 'Etkinlik daveti',
    description: 'Sana özel bir hatıra alanına davet edildin',
};
