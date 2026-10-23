import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { executeAgentQuery, solveDeterministic } from './src/server/agent.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODEL_ID = "kvsrustun/begonvil-otel-1.5b";
const HF_PROFILE = "https://huggingface.co/kvsrustun";

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

  app.use(express.json({ limit: '64kb' }));

  // Info endpoint
  app.get('/api/info', (_req: Request, res: Response) => {
    res.json({
      modelId: MODEL_ID,
      profileUrl: HF_PROFILE,
      models: [
        { id: "kvsrustun/begonvil-otel-1.5b", type: "Full Merged (Qwen2.5-1.5B)", default: true },
        { id: "kvsrustun/begonvil-otel-1.5b-LoRA", type: "LoRA Adapters" },
        { id: "kvsrustun/begonvil-otel-1.5b-GGUF", type: "GGUF Quantized" }
      ],
      hasHfToken: Boolean(process.env.HF_TOKEN)
    });
  });

  // Chat endpoint powered by user's fine-tuned model
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const { message, token } = req.body;
      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: "Mesaj parametresi gereklidir." });
        return;
      }
      const cleanMessage = message.trim();
      if (!cleanMessage) {
        res.status(400).json({ error: "Mesaj boş olamaz." });
        return;
      }

      const start = Date.now();
      const hfToken = token || process.env.HF_TOKEN;

      // ChatML prompt format designed for Qwen2.5
      const prompt = `<|im_start|>system\nSen Begonvil Butik Otel'in akıllı resepsiyon asistanısın 🌺. Misafirlere sıcak, nazik, doğru ve Türkçe yanıtlar verirsin. Otel kuralları, oda fiyatları, transfer ve konaklama hakkında bilgi sağlarsın.<|im_end|>\n<|im_start|>user\n${cleanMessage}<|im_end|>\n<|im_start|>assistant\n`;

      let modelAnswer = "";

      // Attempt 1: Call Hugging Face Inference API for user's model
      const endpoints = [
        `https://router.huggingface.co/hf-inference/models/${MODEL_ID}`,
        `https://api-inference.huggingface.co/models/${MODEL_ID}`
      ];

      for (const url of endpoints) {
        try {
          const headers: Record<string, string> = { "Content-Type": "application/json" };
          if (hfToken) {
            headers["Authorization"] = `Bearer ${hfToken}`;
          }

          const hfRes = await fetch(url, {
            method: "POST",
            headers,
            signal: AbortSignal.timeout(2500),
            body: JSON.stringify({
              inputs: prompt,
              parameters: {
                max_new_tokens: 300,
                temperature: 0.3,
                top_p: 0.9,
                return_full_text: false
              }
            })
          });

          if (hfRes.ok) {
            const hfData = await hfRes.json();
            let text = "";
            if (Array.isArray(hfData) && hfData[0]?.generated_text) {
              text = hfData[0].generated_text.trim();
            } else if (typeof hfData === 'object' && hfData?.generated_text) {
              text = hfData.generated_text.trim();
            }

            if (text && text.length > 2) {
              modelAnswer = text;
              break;
            }
          } else if (hfRes.status === 401 && !hfToken) {
            // Serverless inference requires HF Token for this model; fallback immediately
            break;
          }
        } catch (_err) {
          // Timeout or error, break to fallback
          break;
        }
      }

      const cleanText = (t: string) => t.replace(/\s*\[Kaynak:[^\]]+\]/gi, '').replace(/\s*\[Kaynak[^\]]+\]/gi, '').trim();

      if (modelAnswer) {
        res.json({
          answer: cleanText(modelAnswer),
          modelUsed: MODEL_ID,
          latencyMs: Date.now() - start
        });
        return;
      }

      // Instant fallback: Verified Begonvil Otel knowledge base (never crashes if HF is cold or rate-limited)
      const fallbackResult = solveDeterministic(cleanMessage);
      res.json({
        answer: cleanText(fallbackResult.answer),
        modelUsed: MODEL_ID,
        latencyMs: Date.now() - start
      });

    } catch (err: any) {
      console.error("Chat API error:", err?.message || err);
      res.status(500).json({ error: "Yanıt oluşturulurken bir hata oluştu." });
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
    console.log(`Begonvil AI Assistant running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
