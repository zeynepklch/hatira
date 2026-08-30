# Hatıra

Belirli bir etkinlikte bir araya gelen insanların birbirleri hakkındaki izlenimlerini ve ortak anılarını sakladığı, davete kapalı bir hatıra alanı. Klasik bir yıllığın zamana yayılan hali: aynı kişi hakkında birden fazla cümle durur, eskiler silinmez.

Arayüz yalnızca Türkçedir. Parola denir, şifre denmez. Yazarı gizlenen izlenimler **isimsiz**dir, anonim değil.

## Ne var

- Etkinlik ve katılımcı yönetimi, davet token'ı, e-posta eşleşmeli katılım
- Etkinlik profili, kapak ve katılımcı fotoğrafları
- İsimli veya isimsiz izlenimler (15 dakikalık düzeltme penceresi)
- Anılar, etkinlik akışı, sessiz bildirimler
- Bildirme, gizleme, sahip moderasyonu, etkinlik yaşam döngüsü, sahiplik devri, ayrılma
- Etkinlik yıllığı ve kişisel yıllık; PDF tarayıcı yazdırması ile (`@media print`)

Kapsam dışı: puan, reaksiyon, yorum dizisi, genel açık etkinlik, herkese açık yıllık bağlantısı. Ayrıntı için [`docs/prd.md`](docs/prd.md) ve [`docs/plan/roadmap.md`](docs/plan/roadmap.md).

## Stack

Laravel 13, PHP 8.5, Inertia v3, React 19, Fortify, Wayfinder, Tailwind v4, Pest, Pint, PHPStan.

## Kurulum

PHP 8.3+, Composer, Node 22 ve npm gerekir. Varsayılan veritabanı SQLite.

```bash
composer setup
php artisan migrate --seed
composer run dev
```

`composer setup` `.env` yoksa kopyalar, anahtar üretir, migrate eder, npm paketlerini kurar ve frontend'i derler. Geliştirme sunucusu `http://localhost:8000`.

Örnek veri (`ugur@example.com` / `password`): kamp etkinliği, birkaç katılımcı, izlenim ve anı. Diğer seed katılımcıların henüz kullanıcı hesabı yoktur; davetle bağlanırlar.

## Komutlar

| Komut                        | Ne yapar                                       |
| ---------------------------- | ---------------------------------------------- |
| `composer run dev`           | PHP, kuyruk, log ve Vite'ı birlikte açar       |
| `composer ci:check`          | Frontend lint, TypeScript, Pint, PHPStan, Pest |
| `php artisan test --compact` | Yalnızca testler                               |
| `vendor/bin/pint --dirty`    | PHP biçimlendirme                              |

GitHub Actions `main` ve PR'larda `composer setup` + `composer ci:check` çalıştırır.

## Kararlar ve plan

Yaşayan plan [`docs/plan/`](docs/plan/README.md) altındadır. Kalıcı teknik kararlar `docs/plan/decisions.md` içinde D-001…D-017 olarak durur. Yıllıkta isimsiz yazar asla sızmaz; ayrılan katılımcıların görünür içerikleri yıllığın tarihsel bütünlüğü için kalır.
