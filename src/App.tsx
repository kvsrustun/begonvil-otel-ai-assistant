import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  RotateCcw,
  Copy,
  Check,
  Sparkles,
  BedDouble,
  Car,
  Clock,
  HeartHandshake,
  Coffee,
  Ban,
  ExternalLink,
  Info,
  X,
  KeyRound,
  Calculator,
  MessageSquare
} from 'lucide-react';
import { CalculatorPage } from './components/CalculatorPage.tsx';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
  latencyMs?: number;
}

const QUICK_SUGGESTIONS = [
  { icon: Clock, text: "Giriş ve çıkış saatleri kaçta?" },
  { icon: BedDouble, text: "Deniz Manzaralı Suit 3 gece ne kadar?" },
  { icon: Car, text: "Havalimanından VIP transfer hizmetiniz var mı?" },
  { icon: HeartHandshake, text: "Evcil hayvan kabul ediyor musunuz?" },
  { icon: Coffee, text: "Kahvaltı açık büfe mi ve saat kaça kadar?" },
  { icon: Ban, text: "Balkonda veya odada sigara içilebilir mi?" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'calculator'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-init',
      sender: 'assistant',
      text: "Merhaba, Begonvil Butik Otel'e hoş geldiniz 🌺\n\nBen otelimizin akıllı resepsiyon asistanıyım. Oda tiplerimiz, fiyatlarımız, erken rezervasyon indirimi, havalimanı transferi ve otel kurallarımız hakkında merak ettiğiniz her şeyi bana sorabilirsiniz.\n\nAyrıca yukarıdaki 'Fiyat & Hesaplayıcı' sayfasından rezervasyonunuzun detaylı tutar dökümünü canlı olarak da hesaplayabilirsiniz.\n\nBugün size nasıl yardımcı olabilirim?",
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [userToken, setUserToken] = useState(() => localStorage.getItem('hf_user_token') || '');
  const [savedTokenSuccess, setSavedTokenSuccess] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, activeTab]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          token: userToken.trim() || undefined
        })
      });

      const data = await res.json();

      const cleanAnswer = (data.answer || "Sorunuza şu an yanıt verilemiyor, lütfen tekrar deneyiniz.")
        .replace(/\s*\[Kaynak:[^\]]+\]/gi, '')
        .replace(/\s*\[Kaynak[^\]]+\]/gi, '')
        .trim();

      const assistantMsg: Message = {
        id: 'ast-' + Date.now(),
        sender: 'assistant',
        text: cleanAnswer,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        latencyMs: data.latencyMs
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (_err) {
      setMessages(prev => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'assistant',
          text: "Bağlantı sırasında bir aksaklık oluştu. Lütfen sorunuzu tekrar iletiniz.",
          timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
          source: "Hata"
        }
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleSendFromCalculator = (query: string) => {
    setActiveTab('chat');
    setTimeout(() => {
      handleSend(query);
    }, 100);
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        sender: 'assistant',
        text: "Sohbet sıfırlandı. Begonvil Butik Otel hakkında dilediğiniz soruyu sorabilirsiniz 🌺",
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        source: "kvsrustun/begonvil-otel-1.5b"
      }
    ]);
  };

  const handleSaveToken = () => {
    if (userToken.trim()) {
      localStorage.setItem('hf_user_token', userToken.trim());
    } else {
      localStorage.removeItem('hf_user_token');
    }
    setSavedTokenSuccess(true);
    setTimeout(() => setSavedTokenSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col text-slate-800 antialiased selection:bg-rose-100 selection:text-rose-900">
      {/* Top Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-stone-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          {/* Logo & Hotel Brand */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white text-xl shadow-md shadow-rose-600/20 ring-1 ring-rose-500/20">
              🌺
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900">
                  Begonvil Butik Otel
                </h1>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  Resepsiyon AI
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                7/24 Akıllı Misafir Asistanı
              </p>
            </div>
          </div>

          {/* Tab Navigation: AI Asistanı vs Hesaplayıcı */}
          <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-white text-rose-800 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>AI Asistanı</span>
            </button>

            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
                activeTab === 'calculator'
                  ? 'bg-white text-rose-800 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Fiyat Hesaplayıcı</span>
            </button>
          </div>

          {/* Model Status & Actions */}
          <div className="hidden sm:flex items-center space-x-2">
            <a
              href="https://huggingface.co/kvsrustun/begonvil-otel-1.5b"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full bg-stone-100 hover:bg-rose-50 hover:border-rose-300 border border-stone-200 text-xs transition cursor-pointer group"
              title="Hugging Face model sayfasını aç"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-stone-700 group-hover:text-rose-800 font-semibold font-mono text-[11px]">
                kvsrustun
              </span>
              <ExternalLink className="w-3 h-3 text-stone-400 group-hover:text-rose-600" />
            </a>

            <button
              onClick={() => setShowInfoModal(true)}
              className="p-1.5 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 border border-stone-200 transition cursor-pointer"
              title="Model Detayları"
            >
              <Info className="w-4 h-4" />
            </button>

            {activeTab === 'chat' && (
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 border border-stone-200 transition cursor-pointer"
                title="Sohbeti Temizle"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col">
        {activeTab === 'calculator' ? (
          <CalculatorPage onSendToChat={handleSendFromCalculator} />
        ) : (
          <>
            {/* Messages Thread */}
            <div className="flex-1 space-y-5 pb-6">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {!isUser ? (
                      <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-base shrink-0 shadow-2xs">
                        🌺
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-semibold shrink-0 shadow-2xs">
                        Siz
                      </div>
                    )}

                    <div className={`max-w-[85%] sm:max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-xs transition-all ${
                          isUser
                            ? 'bg-rose-700 text-white rounded-tr-xs shadow-rose-700/10'
                            : 'bg-white text-slate-800 border border-stone-200/80 rounded-tl-xs shadow-stone-200/50'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.text}</div>

                        {!isUser && (
                          <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between gap-4 text-[11px] text-stone-400">
                            <div className="flex items-center gap-2">
                              <span>{msg.timestamp}</span>
                              {msg.latencyMs && (
                                <>
                                  <span>•</span>
                                  <span>{msg.latencyMs} ms</span>
                                </>
                              )}
                            </div>

                            <button
                              onClick={() => copyText(msg.id, msg.text)}
                              className="hover:text-stone-700 flex items-center gap-1 transition cursor-pointer"
                              title="Metni Kopyala"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-600 font-medium">Kopyalandı</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Kopyala</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-base shrink-0">
                    🌺
                  </div>
                  <div className="bg-white border border-stone-200/80 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs flex items-center space-x-2 text-stone-400 text-xs">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-bounce delay-150"></span>
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-bounce delay-300"></span>
                    <span className="text-stone-600 ml-1.5 font-medium">kvsrustun/begonvil-otel-1.5b yanıtlıyor...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion Chips */}
            {messages.length <= 2 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2.5 px-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  <span>Sıkça Sorulan Sorular</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {QUICK_SUGGESTIONS.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSend(item.text)}
                        disabled={isLoading}
                        className="p-3 rounded-xl bg-white hover:bg-rose-50/60 border border-stone-200 hover:border-rose-200 text-left text-xs text-slate-700 transition flex items-center gap-2.5 group cursor-pointer shadow-2xs hover:shadow-xs"
                      >
                        <div className="w-7 h-7 rounded-lg bg-stone-100 group-hover:bg-rose-100/70 text-stone-600 group-hover:text-rose-700 flex items-center justify-center shrink-0 transition">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-medium group-hover:text-rose-950">{item.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Floating Input Dock */}
            <div className="sticky bottom-4 z-20 pt-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="bg-white rounded-2xl p-2 border border-stone-300/80 shadow-lg shadow-stone-200/50 flex items-center gap-2 focus-within:border-rose-500 focus-within:ring-3 focus-within:ring-rose-500/15 transition"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Begonvil Otel hakkında dilediğinizi sorun..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 placeholder-stone-400 outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-xl bg-rose-700 hover:bg-rose-800 disabled:opacity-40 disabled:hover:bg-rose-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-700/20 transition cursor-pointer"
                  title="Gönder"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="text-center mt-2.5 flex items-center justify-center gap-2 text-[11px] text-stone-400">
                <span>Model:</span>
                <a
                  href="https://huggingface.co/kvsrustun/begonvil-otel-1.5b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-600 font-mono font-medium hover:text-rose-700 hover:underline flex items-center gap-1"
                >
                  <span>kvsrustun/begonvil-otel-1.5b</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <span>•</span>
                <span>Qwen2.5-1.5B Fine-Tuned</span>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Model & Settings Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-lg">
                  🌺
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Model Detayları</h3>
                  <p className="text-xs text-stone-500">Hugging Face Eğitilmiş Yapay Zekâ Modeli</p>
                </div>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Model Repositories */}
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block">
                kvsrustun Hugging Face Depoları:
              </span>

              <a
                href="https://huggingface.co/kvsrustun/begonvil-otel-1.5b"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-stone-50 hover:bg-rose-50 border border-stone-200 hover:border-rose-200 flex items-center justify-between transition group"
              >
                <div>
                  <div className="font-mono text-xs font-bold text-slate-900 group-hover:text-rose-900">
                    kvsrustun/begonvil-otel-1.5b
                  </div>
                  <div className="text-[11px] text-stone-500">Tam Birleştirilmiş Model (Qwen2.5-1.5B)</div>
                </div>
                <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-rose-600" />
              </a>

              <a
                href="https://huggingface.co/kvsrustun/begonvil-otel-1.5b-LoRA"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-stone-50 hover:bg-rose-50 border border-stone-200 hover:border-rose-200 flex items-center justify-between transition group"
              >
                <div>
                  <div className="font-mono text-xs font-bold text-slate-900 group-hover:text-rose-900">
                    kvsrustun/begonvil-otel-1.5b-LoRA
                  </div>
                  <div className="text-[11px] text-stone-500">LoRA Adaptör Ağırlıkları</div>
                </div>
                <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-rose-600" />
              </a>

              <a
                href="https://huggingface.co/kvsrustun/begonvil-otel-1.5b-GGUF"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-stone-50 hover:bg-rose-50 border border-stone-200 hover:border-rose-200 flex items-center justify-between transition group"
              >
                <div>
                  <div className="font-mono text-xs font-bold text-slate-900 group-hover:text-rose-900">
                    kvsrustun/begonvil-otel-1.5b-GGUF
                  </div>
                  <div className="text-[11px] text-stone-500">GGUF Kuantize Edilmiş Model (Ollama / Llama.cpp)</div>
                </div>
                <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-rose-600" />
              </a>
            </div>

            {/* Optional HF Token Field */}
            <div className="pt-3 border-t border-stone-100 space-y-2">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-stone-500" />
                <span>Hugging Face Access Token (İsteğe Bağlı)</span>
              </label>
              <p className="text-[11px] text-stone-500">
                Modelinize Hugging Face API kotası olmadan doğrudan istek göndermek isterseniz <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">hf_...</code> tokenınızı ekleyebilirsiniz.
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={userToken}
                  onChange={(e) => setUserToken(e.target.value)}
                  placeholder="hf_..."
                  className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono outline-none focus:border-rose-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={handleSaveToken}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer"
                >
                  {savedTokenSuccess ? 'Kaydedildi ✓' : 'Kaydet'}
                </button>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
