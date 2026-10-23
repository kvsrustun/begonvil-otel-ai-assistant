# 🌺 Begonvil Otel AI Assistant

[![Backend Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Frontend React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Language TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Build Tool Vite](https://img.shields.io/badge/Build%20Tool-Vite-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![AI Model Hugging Face](https://img.shields.io/badge/AI%20Model-Hugging%20Face-FFD21E?logo=huggingface&logoColor=black)](https://huggingface.co/kvsrustun/begonvil-otel-1.5b)
[![AI API Gemini](https://img.shields.io/badge/AI%20API-Gemini-8E75B2?logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Project AI Assistant](https://img.shields.io/badge/Project-AI%20Assistant-blueviolet)](https://github.com/kvsrustun/begonvil-otel-ai-assistant)

<p align="center">
  Begonvil Otel için geliştirilen, otel bilgilerini kullanarak misafir sorularını yanıtlamayı ve oda seçenekleri ile fiyatlandırma sürecini kolaylaştırmayı amaçlayan yapay zekâ destekli bir otel asistanı.
</p>

## İçindekiler

- [1. Proje Özeti ve Motivasyon](#1-proje-özeti-ve-motivasyon)
- [2. Temel Özellikler](#2-temel-özellikler)
  - [2.1. Otel Misafir Asistanı](#21-otel-misafir-asistanı)
  - [2.2. RAG Tabanlı Bilgi Getirme](#22-rag-tabanlı-bilgi-getirme)
  - [2.3. Oda Verisi ve Filtreleme](#23-oda-verisi-ve-filtreleme)
  - [2.4. Fiyat Hesaplama](#24-fiyat-hesaplama)
  - [2.5. Güvenlik ve Yanıt Kontrolü](#25-güvenlik-ve-yanıt-kontrolü)
  - [2.6. Model Yanıt Mekanizması](#26-model-yanıt-mekanizması)
- [3. Sistem Mimarisi](#3-sistem-mimarisi)
- [4. Teknoloji Yığını](#4-teknoloji-yığını)
- [5. Proje Yapısı](#5-proje-yapısı)
- [6. Kurulum ve Kullanım](#6-kurulum-ve-kullanım)
- [7. Test ve Doğrulama](#7-test-ve-doğrulama)
- [8. Proje Bağlantıları](#8-proje-bağlantıları)
- [9. Sınırlamalar](#9-sınırlamalar)
- [10. Geliştirici](#10-geliştirici)

---

## 1. Proje Özeti ve Motivasyon

Begonvil Otel AI Assistant, otel misafirlerinin konaklama öncesinde veya konaklama sırasında ihtiyaç duyabileceği bilgilere daha hızlı ulaşmasını sağlamak amacıyla geliştirilen yapay zekâ destekli bir asistandır.

Proje, doğal dilde yazılan kullanıcı sorularını ele alarak otel bilgileri, oda seçenekleri ve fiyatlandırma gibi konularda yardımcı olmayı hedefler.

---

## 2. Temel Özellikler

### 2.1. Otel Misafir Asistanı

Kullanıcıların doğal dilde ilettiği sorulara yanıt vermek üzere tasarlanmıştır. Amaç, misafirlerin otel hakkındaki bilgilere sohbet tabanlı bir arayüz üzerinden ulaşabilmesidir.

### 2.2. RAG Tabanlı Bilgi Getirme

Retrieval-Augmented Generation (RAG), yanıt oluşturulmadan önce ilgili bilgilerin bir veri kaynağından getirilmesini sağlayan bir yaklaşımdır.

### 2.3. Oda Verisi ve Filtreleme

Oda seçenekleriyle ilgili sorularda mevcut otel verilerinin kullanılması hedeflenir. Uygun oda seçenekleri, oda özellikleri ve ilgili filtreler dikkate alınarak değerlendirilebilir.

### 2.4. Fiyat Hesaplama

Konaklama süresi ve gecelik fiyat bilgileri kullanılarak toplam tutarın hesaplanması amaçlanır.

Örnek:

- Gecelik fiyat: 11.500 TL
- Konaklama süresi: 3 gece
- Toplam tutar: 34.500 TL

### 2.5. Güvenlik ve Yanıt Kontrolü

Kullanıcı girdilerinin işlenmesi ve oluşturulan yanıtların otel bilgileriyle tutarlı olması hedeflenir. Yapay zekâ yanıtlarının her zaman doğru olacağı garanti edilemez.

### 2.6. Model Yanıt Mekanizması

Proje kapsamında Hugging Face üzerinde yayımlanan bir modelden yararlanılması hedeflenmektedir. Model entegrasyonu ve varsa alternatif yanıt mekanizmaları, yanıt oluşturma sürecini destekler.

---

## 3. Sistem Mimarisi

```text
Kullanıcı
   |
   v
React + TypeScript Arayüzü
   |
   v
Sunucu / API Katmanı
   |
   v
Otel Verilerinin Getirilmesi
   |
   v
Yapay Zekâ Modeli
   |
   v
Yanıtın Kullanıcıya Sunulması
```

Genel çalışma akışı:

1. Kullanıcı sohbet arayüzü üzerinden soru iletir.
2. İstek sunucu tarafına aktarılır.
3. Soruyla ilgili otel bilgilerinin belirlenmesi amaçlanır.
4. Model mevcut bilgiler doğrultusunda yanıt oluşturur.
5. Yanıt kullanıcıya gösterilir.

---

## 4. Teknoloji Yığını

| Teknoloji | Kullanım Alanı |
|---|---|
| React | Kullanıcı arayüzü |
| TypeScript | Tip güvenli uygulama geliştirme |
| Vite | Geliştirme ve derleme |
| Node.js | Sunucu tarafı çalışma ortamı |
| Express | API yönetimi, kullanılıyorsa |
| Hugging Face | Model barındırma ve çıkarım |
| Gemini API | Yapay zekâ entegrasyonu, kullanılıyorsa |
| Python | Yardımcı betikler ve veri/model işlemleri |
| Environment Variables | API anahtarları ve yapılandırma |

---

## 5. Proje Yapısı

```text
begonvil-otel-ai-assistant/
├── public/
│   └── assets/
├── src/
│   ├── data/
│   │   └── hotelData.ts
│   └── server/
│       └── agent.ts
├── .env.example
├── .gitignore
├── index.html
├── metadata.json
├── package.json
├── package-lock.json
├── bun.lock
├── proje_cozum.py
├── server.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 6. Kurulum ve Kullanım

### 6.1. Gereksinimler

- Node.js ve npm
- Git
- Kullanılan yapay zekâ servisleri için gerekli API erişimi

### 6.2. Depoyu Klonlama

```bash
git clone https://github.com/kvsrustun/begonvil-otel-ai-assistant.git
cd begonvil-otel-ai-assistant
```

### 6.3. Bağımlılıkları Yükleme

```bash
npm install
```

### 6.4. Ortam Değişkenlerini Yapılandırma

`.env.example` dosyasını örnek alarak `.env` dosyası oluşturun.

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Örnek yapılandırma:

```env
HF_TOKEN=your_huggingface_token
GEMINI_API_KEY=your_gemini_api_key
```

Değişken adlarını projenin kaynak kodunda kullanılan adlarla eşleştirin. `.env` dosyasını GitHub'a yüklemeyin.

### 6.5. Geliştirme Sunucusunu Başlatma

```bash
npm run dev
```

Bu komutun kullanılabilmesi için `package.json` dosyasında `dev` script'inin tanımlı olması gerekir.

### 6.6. Üretim Derlemesi

```bash
npm run build
```

---

## 7. Test ve Doğrulama

Aşağıdaki senaryolar test sürecinde değerlendirilebilir:

1. Otel hakkında genel bir soru sorma.
2. Oda seçenekleri hakkında bilgi isteme.
3. Konaklama süresine göre toplam fiyat hesaplama.
4. Eksik veya belirsiz bilgi içeren soru gönderme.
5. Yapay zekâ servisine erişilemediğinde hata yönetimini kontrol etme.
6. API anahtarı eksik veya geçersiz olduğunda uygulamanın davranışını inceleme.

---

## 8. Proje Bağlantıları

- **GitHub Deposu:** [begonvil-otel-ai-assistant](https://github.com/kvsrustun/begonvil-otel-ai-assistant)
- **Hugging Face Modeli:** [kvsrustun/begonvil-otel-1.5b](https://huggingface.co/kvsrustun/begonvil-otel-1.5b)
- **Geliştirici GitHub Profili:** [kvsrustun](https://github.com/kvsrustun)

---

## 9. Sınırlamalar

- Yanıtların doğruluğu kullanılan otel verilerinin kapsamına ve güncelliğine bağlıdır.
- Yapay zekâ tarafından oluşturulan yanıtlar hatalı veya eksik olabilir.
- Gerçek oda müsaitliği ve rezervasyon durumu ayrıca doğrulanmalıdır.
- API erişimi ve servis kullanılabilirliği uygulamanın çalışmasını etkileyebilir.
- Örnek fiyat hesaplamaları güncel rezervasyon fiyatlarını garanti etmez.

---

## 10. Geliştirici

**Kevser Üstün**

Bilgisayar Mühendisliği mezunu. Yazılım geliştirme ve yapay zekâ uygulamalarıyla ilgilenmektedir.

- GitHub: [@kvsrustun](https://github.com/kvsrustun)

---

<p align="center">
  <sub>Begonvil Otel AI Assistant — Yapay zekâ destekli otel asistanı projesi.</sub>
</p>

---

<p align="center">
  <sub>Begonvil Otel AI Assistant — Yapay zekâ destekli otel asistanı projesi.</sub>
</p>
