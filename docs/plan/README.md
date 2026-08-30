# Geliştirme Planı — Navigasyon ve Güncelleme Protokolü

Bu klasör, uzun sürecek geliştirmede bağlamın kaybolmaması için tutulan **yaşayan** doküman setidir.
Kod değiştiğinde bu dosyalar da değişir. Hiçbiri "bir kez yazılıp bırakılan" doküman değildir.

## Dosya haritası

| Dosya                            | Ne için                                                                                 |
| -------------------------------- | --------------------------------------------------------------------------------------- |
| [`../prd.md`](../prd.md)         | Ürün tanımı. Değişmez referans. Kapsam tartışması buradan başlar.                       |
| [`roadmap.md`](roadmap.md)       | 7 fazın özeti ve güncel durumu. "Nerede kaldık?" sorusunun cevabı.                      |
| [`decisions.md`](decisions.md)   | Numaralı karar kaydı (D-001, D-002...). "Bunu neden böyle yapmıştık?" sorusunun cevabı. |
| [`data-model.md`](data-model.md) | Tabloların, ilişkilerin ve enum'ların güncel hâli. Şemanın tek gerçek kaynağı.          |
| [`phases/`](phases/)             | Faz başına bir dosya: görev listesi, kabul kriterleri, çalışma günlüğü.                 |

## Güncelleme protokolü

Bu protokol zorunludur. Her fazda aynı sırayla işletilir.

### Git iş akışı

Her faz, `main`'den açılan **kendi branch'inde** yapılır. İsim: `phase-NN-slug`
(ör. `phase-02-invitations`). Bir sonraki faza, kullanıcı söylemeden başlanmaz.

Fazın bittiği düşünüldüğünde, merge'den önce:

1. `composer ci:check` yeşil olana kadar test/lint hataları düzeltilir.
2. Bugbot döngüsü çalıştırılır; bulgu kalmayana kadar sürer.
3. Her şey yolundaysa phase branch'i `main`'e birleştirilir.

### Faz başlarken

1. `main`'den `phase-NN-slug` branch'i açılır; iş bu branch'te kalır.
2. `roadmap.md` içinde ilgili fazın durumunu **Devam ediyor** yap, başlangıç tarihini yaz.
3. İlgili `phases/phase-XX-*.md` dosyasının başındaki durumu **Devam ediyor** yap.
4. Faz dosyasındaki görev listesini ve kabul kriterlerini oku. Eksik varsa fazı bölmeden önce görevi ekle.

### Faz sürerken

1. Bir görev bitince faz dosyasındaki kutusunu `[x]` yap. Görev kutusunu iş bitmeden işaretleme.
2. Şema değiştiyse **aynı commit içinde** `data-model.md` güncellenir.
3. Kalıcı bir teknik karar alındıysa `decisions.md` içine yeni bir `D-XXX` kaydı eklenir. Eski kararlar silinmez; geçersiz kalan karar `Durum: Değiştirildi (bkz. D-YYY)` olarak işaretlenir.
4. Plan dışına çıkan bir iş yapıldıysa faz dosyasının **Çalışma günlüğü** bölümüne tarihli bir satır eklenir. Günlük, "neden böyle oldu" bilgisinin tutulduğu yerdir.
5. Bir iş bilinçli olarak sonraya bırakıldıysa faz dosyasının **Devredilen işler** bölümüne yazılır ve hedef faza taşınır.

### Faz kapanırken

1. Kabul kriterlerinin her maddesi tek tek doğrulanır.
2. `vendor/bin/pint --dirty --format agent` çalıştırılır.
3. `composer ci:check` yeşil olmalıdır (npm lint + phpstan + pint + pest).
4. Bugbot, phase branch'teki değişiklikleri inceler; bulgu kalmayana kadar düzeltilir ve tekrar çalıştırılır.
5. Faz dosyasının durumu **Tamamlandı** yapılır, bitiş tarihi yazılır.
6. `roadmap.md` güncellenir.
7. Fazda ortaya çıkan kalıcı kodlama kuralları Laravel Boost'un `record-rule` aracıyla `.ai/rules` altına kaydedilir.
8. Phase branch `main`'e birleştirilir. Sonraki faz, kullanıcı söyleyene kadar açılmaz.

## `docs/plan` ile `.ai/rules` farkı

İki ayrı iş yapıyorlar, karıştırılmamalı:

- **`docs/plan`** — plan, ilerleme ve gerekçe. İnsan için. "Ne yapacağız, nerede kaldık, neden böyle karar verdik."
- **`.ai/rules`** — uyulması zorunlu kodlama kuralları. Ajan için. "Bu dosya yolunda çalışırken şu deseni kullan."

Bir konu ikisine de girebilir: kararın gerekçesi `decisions.md` içine, kararın uygulama kuralı `.ai/rules` içine yazılır.
