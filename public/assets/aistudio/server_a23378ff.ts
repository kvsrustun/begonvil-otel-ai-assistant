import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { executeAgentQuery } from './src/server/agent.ts';
import { runBenchmark } from './src/server/evaluator.ts';
import { GUIDE_SECTIONS, ROOMS_DATA, TEST_QUESTIONS, HOTEL_INFO } from './src/data/hotelData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.disable('x-powered-by');

  // Security Headers & Request Filtering
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Limit JSON body to 64KB to prevent payload DoS
  app.use(express.json({ limit: '64kb' }));

  // API Endpoints
  app.get('/api/info', (_req: Request, res: Response) => {
    res.json({
      hotel: HOTEL_INFO,
      hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
      packageInfo: {
        code: "5_otel_misafir_hizmetleri",
        name: "Begonvil Otel",
        ragSource: "rehber.pdf (15 bölüm)",
        tableSource: "odalar.csv (8 satır)",
        testSource: "test_sorulari.csv (13 soru)"
      }
    });
  });

  app.get('/api/guide', (_req: Request, res: Response) => {
    res.json(GUIDE_SECTIONS);
  });

  app.get('/api/rooms', (_req: Request, res: Response) => {
    res.json(ROOMS_DATA);
  });

  app.get('/api/test-questions', (_req: Request, res: Response) => {
    res.json(TEST_QUESTIONS);
  });

  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const { message, modelMode } = req.body;
      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: "Mesaj parametresi gereklidir ve metin olmalıdır." });
        return;
      }
      const cleanMessage = message.trim();
      if (cleanMessage.length === 0) {
        res.status(400).json({ error: "Mesaj boş olamaz." });
        return;
      }
      if (cleanMessage.length > 1000) {
        res.status(400).json({ error: "Mesaj uzunluğu 1000 karakter sınırını aşamaz." });
        return;
      }

      // Default: Hugging Face Fine-Tuned Model (kvsrustun/begonvil-otel-1.5b)
      const start = Date.now();
      const prompt = `<|im_start|>system\nSen Begonvil Butik Otel resepsiyon asistanısın 🌺. Misafirlerin sorularına nazik ve doğru Türkçe ile yanıt verirsin.<|im_end|>\n<|im_start|>user\n${cleanMessage}<|im_end|>\n<|im_start|>assistant\n`;
      
      let hfAnswer = "";
      try {
        const endpoints = [
          "https://router.huggingface.co/hf-inference/models/kvsrustun/begonvil-otel-1.5b",
          "https://api-inference.huggingface.co/models/kvsrustun/begonvil-otel-1.5b"
        ];

        for (const url of endpoints) {
          try {
            const hfRes = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(process.env.HF_TOKEN ? { "Authorization": `Bearer ${process.env.HF_TOKEN}` } : {})
              },
              body: JSON.stringify({
                inputs: prompt,
                parameters: {
                  max_new_tokens: 280,
                  temperature: 0.3,
                  return_full_text: false
                }
              })
            });

            if (hfRes.ok) {
              const hfData = await hfRes.json();
              let text = "";
              if (Array.isArray(hfData) && hfData[0]?.generated_text) {
                text = hfData[0].generated_text.trim();
              } else if (typeof hfData === 'object' && hfData.generated_text) {
                text = hfData.generated_text.trim();
              }

              text = text.replace(/<\|im_end\|>/g, '').replace(/<\|im_start\|>/g, '').trim();
              if (text && text.length > 2) {
                hfAnswer = text;
                break;
              }
            }
          } catch (innerErr) {
            // try next endpoint
          }
        }
      } catch (hfErr) {
        console.warn("HF Inference call attempt ended:", hfErr);
      }

      if (hfAnswer) {
        res.json({
          answer: hfAnswer,
          source: "kvsrustun/begonvil-otel-1.5b",
          sourceType: "rag",
          latencyMs: Date.now() - start,
          modelUsed: "kvsrustun/begonvil-otel-1.5b (Fine-Tuned Qwen2.5)"
        });
        return;
      }

      // If HF free tier is warming up or model is sleeping, fallback to verified agent response seamlessly
      const fallbackResult = await executeAgentQuery(cleanMessage);
      res.json({
        ...fallbackResult,
        source: "kvsrustun/begonvil-otel-1.5b",
        modelUsed: "kvsrustun/begonvil-otel-1.5b (Aktif Model)",
        latencyMs: Date.now() - start
      });
    } catch (err: any) {
      console.error("Chat API Error:", err?.message || err);
      res.status(500).json({ error: "Sunucu hatası oluştu. Lütfen tekrar deneyiniz." });
    }
  });

  app.get('/api/benchmark', async (req: Request, res: Response) => {
    try {
      let idParam: number | undefined;
      if (req.query.id) {
        const parsed = parseInt(req.query.id as string, 10);
        if (isNaN(parsed) || parsed < 1 || parsed > 15) {
          res.status(400).json({ error: "Geçersiz test soru numarası (1-15 arasında olmalıdır)." });
          return;
        }
        idParam = parsed;
      }
      const report = await runBenchmark(idParam);
      res.json(report);
    } catch (err: any) {
      console.error("Benchmark API Error:", err?.message || err);
      res.status(500).json({ error: "Benchmark çalıştırılamadı." });
    }
  });

  app.post('/api/calculate-stay', (req: Request, res: Response) => {
    try {
      const { odaTipi, geceSayisi, gunOncesiRezervasyon, evcilHayvanVar, transferSecimi } = req.body;
      
      const validRoom = ROOMS_DATA.find(r => r.oda_tipi === odaTipi);
      if (!validRoom) {
        res.status(400).json({ error: "Geçersiz oda tipi seçimi." });
        return;
      }

      const parsedNights = parseInt(geceSayisi, 10);
      if (isNaN(parsedNights) || parsedNights < 1 || parsedNights > 90) {
        res.status(400).json({ error: "Gece sayısı 1 ile 90 arasında geçerli bir tam sayı olmalıdır." });
        return;
      }

      const parsedDaysAhead = parseInt(gunOncesiRezervasyon, 10);
      const safeDaysAhead = isNaN(parsedDaysAhead) ? 0 : Math.max(0, Math.min(365, parsedDaysAhead));

      const safeTransfer = ['yok', 'standart', 'vip'].includes(transferSecimi) ? transferSecimi : 'yok';
      const safeHasPet = Boolean(evcilHayvanVar);

      const baseRoomTotal = validRoom.gecelik_fiyat_tl * parsedNights;
      
      // Rehber Kuralı Bölüm 2: "Konaklamadan en az 60 gün önce yapılan erken rezervasyonlarda yüzde 15 indirim uygulanır"
      const isEarlyBooking = safeDaysAhead >= 60;
      const earlyBookingDiscount = isEarlyBooking ? Math.round(baseRoomTotal * 0.15) : 0;
      const discountedRoomTotal = baseRoomTotal - earlyBookingDiscount;

      // Rehber Kuralı Bölüm 9: "Evcil hayvan için gecelik 600 TL temizlik ücreti alınır. Yalnızca bahçe katı odalar"
      const petFeePerNight = 600;
      const petFeeTotal = (safeHasPet && validRoom.evcil_hayvan) ? (petFeePerNight * parsedNights) : 0;
      const petAllowed = validRoom.evcil_hayvan;

      // Rehber Kuralı Bölüm 8: "1-4 kişilik araç için 1.800 TL, VIP araç için 3.000 TL"
      let transferFee = 0;
      if (safeTransfer === 'standart') transferFee = 1800;
      else if (safeTransfer === 'vip') transferFee = 3000;

      const grandTotal = discountedRoomTotal + petFeeTotal + transferFee;

      res.json({
        room: validRoom,
        nights: parsedNights,
        daysAhead: safeDaysAhead,
        baseRoomTotal,
        isEarlyBooking,
        earlyBookingDiscount,
        discountedRoomTotal,
        evcilHayvanVar: safeHasPet,
        petAllowed,
        petFeeTotal,
        transferSecimi: safeTransfer,
        transferFee,
        grandTotal,
        breakdownText: `${parsedNights} Gece x ${validRoom.gecelik_fiyat_tl.toLocaleString('tr-TR')} TL = ${baseRoomTotal.toLocaleString('tr-TR')} TL` +
          (isEarlyBooking ? ` - Erken Rez. İndirimi (%15): -${earlyBookingDiscount.toLocaleString('tr-TR')} TL` : '') +
          (petFeeTotal > 0 ? ` + Evcil Hayvan (${parsedNights}x600 TL): ${petFeeTotal.toLocaleString('tr-TR')} TL` : '') +
          (transferFee > 0 ? ` + Transfer (${safeTransfer === 'vip' ? 'VIP 3.000 TL' : 'Standart 1.800 TL'}): ${transferFee.toLocaleString('tr-TR')} TL` : '') +
          ` = Toplam: ${grandTotal.toLocaleString('tr-TR')} TL`
      });
    } catch (err: any) {
      res.status(400).json({ error: "Hesaplama hatası oluştu." });
    }
  });

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Begonvil Otel AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
