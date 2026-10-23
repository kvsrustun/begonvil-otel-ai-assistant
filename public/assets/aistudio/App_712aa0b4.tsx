import React, { useState, useRef, useEffect } from 'react';
import { Send, RotateCcw, Copy, Check, Sparkles, BedDouble, Car, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  latencyMs?: number;
}

const SUGGESTIONS = [
  { icon: Clock, text: "Giriş ve çıkış saatleri kaçta?" },
  { icon: BedDouble, text: "Deniz manzaralı deluxe oda fiyatı nedir?" },
  { icon: Car, text: "Bodrum Havalimanı'ndan 2 kişi için transfer ücreti ne kadar?" },
  { icon: HeartHandshake, text: "Evcil hayvan kabul ediyor musunuz?" },
  { icon: Sparkles, text: "Kahvaltı servisi saat kaçta ve fiyata dahil mi?" },
  { icon: ShieldCheck, text: "Erken rezervasyon indiriminiz var mı?" }
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: "Merhaba! Begonvil Butik Otel'e hoş geldiniz 🌺\n\nBen otelimizin akıllı resepsiyon asistanıyım. Oda tiplerimiz, konaklama kurallarımız, güncel fiyatlarımız ve VIP havalimanı transferimiz hakkında merak ettiğiniz tüm soruları memnuniyetle yanıtlarım.\n\nSize bugün nasıl yardımcı olabilirim?",
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!messageText) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });
      const data = await res.json();

      const assistantMsg: Message = {
        id: 'ast-' + Date.now(),
        sender: 'assistant',
        text: data.answer || "Sorunuza şu an yanıt verilemiyor, lütfen tekrar deneyiniz.",
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        latencyMs: data.latencyMs
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'assistant',
          text: "Bağlantı sırasında bir aksaklık oluştu. Lütfen sorunuzu tekrar iletiniz.",
          timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
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
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col text-slate-800 antialiased selection:bg-rose-100 selection:text-rose-900">
      {/* Top Chic Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-stone-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          {/* Logo & Hotel Brand */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-white text-xl shadow-md shadow-rose-600/20">
              🌺
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <span>Begonvil Butik Otel</span>
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                Akıllı Resepsiyon Asistanı
              </p>
            </div>
          </div>

          {/* Model Status & Reset */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-stone-600 font-medium font-mono text-[11px]">kvsrustun/begonvil-otel-1.5b</span>
            </div>

            <button
              onClick={handleResetChat}
              title="Yeni Sohbet Başlat"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 border border-stone-200 transition text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Temizle</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Conversation Canvas */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col">
        {/* Messages Container */}
        <div className="flex-1 space-y-5 pb-6">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {!isUser ? (
                  <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-base shrink-0 shadow-2xs">
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
              <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-base shrink-0">
                🌺
              </div>
              <div className="bg-white border border-stone-200/80 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs flex items-center space-x-2 text-stone-400 text-xs">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-bounce delay-150"></span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-bounce delay-300"></span>
                <span className="text-stone-500 ml-1.5 font-medium">Model yanıt hazırlıyor...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Chips */}
        {messages.length <= 2 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2.5 px-1">
              Hızlı Sorular
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTIONS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(item.text)}
                    disabled={isLoading}
                    className="p-3 rounded-xl bg-white hover:bg-rose-50/50 border border-stone-200 hover:border-rose-200 text-left text-xs text-slate-700 transition flex items-center gap-2.5 group cursor-pointer shadow-2xs hover:shadow-xs"
                  >
                    <div className="w-6 h-6 rounded-lg bg-stone-100 group-hover:bg-rose-100/70 text-stone-600 group-hover:text-rose-700 flex items-center justify-center shrink-0 transition">
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
            className="bg-white rounded-2xl p-2 border border-stone-300/80 shadow-lg shadow-stone-200/40 flex items-center gap-2 focus-within:border-rose-500 focus-within:ring-3 focus-within:ring-rose-500/15 transition"
          >
            <input
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

          <div className="text-center mt-2.5">
            <span className="text-[11px] text-stone-400">
              Begonvil Butik Otel • Qwen2.5-1.5B İnce Ayarlı Model (kvsrustun/begonvil-otel-1.5b)
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
