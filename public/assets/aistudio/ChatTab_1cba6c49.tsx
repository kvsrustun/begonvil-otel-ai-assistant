import React, { useState } from 'react';
import { Send, Sparkles, BookOpen, Database, ShieldAlert, CheckCircle2, ChevronDown, ChevronUp, Copy, Check, RefreshCw } from 'lucide-react';
import { TEST_QUESTIONS } from '../data/hotelData.ts';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  source?: string;
  sourceType?: 'rag' | 'table' | 'table_calc' | 'out_of_scope';
  retrievedSections?: { id: number; title: string; snippet: string }[];
  queriedRooms?: any[];
  toolCallsExecuted?: string[];
  latencyMs?: number;
  timestamp: string;
}

export const ChatTab: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: "Merhaba! Ben Begonvil Otel AI Misafir Asistanıyım. 15 bölümlük Otel Misafir Rehberimiz ve Oda Veri Tabanımız hakkında tüm sorularınızı yanıtlamaya hazırım. Hızlıca test etmek için aşağıdaki hazır bitirme projesi sorularına tıklayabilir veya dilediğiniz soruyu yazabilirsiniz.",
      source: "Begonvil Otel AI Sistemi",
      sourceType: "rag",
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [modelMode, setModelMode] = useState<'hf_model' | 'verified_agent'>('hf_model');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, modelMode })
      });
      const data = await response.json();

      const assistantMessage: Message = {
        id: 'msg-res-' + Date.now(),
        sender: 'assistant',
        text: data.answer,
        source: data.source,
        sourceType: data.sourceType,
        retrievedSections: data.retrievedSections,
        queriedRooms: data.queriedRooms,
        toolCallsExecuted: data.toolCallsExecuted,
        latencyMs: data.latencyMs,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        id: 'msg-err-' + Date.now(),
        sender: 'assistant',
        text: "Üzgünüm, sorunuzu işlerken bir iletişim hatası oluştu. Lütfen tekrar deneyiniz.",
        source: "Hata",
        sourceType: "out_of_scope",
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getSourceBadge = (msg: Message) => {
    if (!msg.sourceType) return null;
    switch (msg.sourceType) {
      case 'rag':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kaynak: {msg.source || 'Rehber PDF'}</span>
          </span>
        );
      case 'table':
      case 'table_calc':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Database className="w-3.5 h-3.5" />
            <span>Kaynak: {msg.source || 'odalar.csv Tablosu'}</span>
          </span>
        );
      case 'out_of_scope':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-300">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Güvenlik: Rehberde Bilgi Yok (Halüsinasyon Engellendi)</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Quick Benchmark Prompt Panel */}
      <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>Hızlı Test Soruları (Bootcamp)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Projeye ait 13 resmi test sorusunu tek tıkla asistana yönlendirerek yanıtları ve kaynak eşleşmesini anında görün:
          </p>
        </div>

        <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
          {TEST_QUESTIONS.map((q) => {
            const isOutOfScope = q.category === 'out_of_scope';
            const isTable = q.category === 'table' || q.category === 'table_calc';
            return (
              <button
                key={q.id}
                onClick={() => handleSendMessage(q.soru)}
                disabled={isLoading}
                className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-start justify-between group hover:shadow-sm cursor-pointer ${
                  isOutOfScope
                    ? 'border-amber-200 bg-amber-50/60 hover:bg-amber-100/70 text-amber-950'
                    : isTable
                    ? 'border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 text-blue-950'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-bold text-[10px] px-1.5 py-0.5 rounded bg-white/80 border border-slate-200">
                      #{q.id}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500">
                      {q.kaynak}
                    </span>
                  </div>
                  <div className="font-semibold line-clamp-2">{q.soru}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Chat Window */}
      <div className="lg:col-span-8 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[640px]">
        {/* Chat Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Begonvil Otel Akıllı Konsiyerj</h3>
              <p className="text-xs text-slate-500">Fine-Tuned Qwen2.5-1.5B & RAG Ajanı</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Model Mode Toggle Buttons */}
            <div className="inline-flex p-1 rounded-xl bg-slate-200/80 text-xs">
              <button
                type="button"
                onClick={() => setModelMode('hf_model')}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  modelMode === 'hf_model'
                    ? 'bg-white text-rose-700 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Hugging Face'e yüklediğiniz begonvil-otel-1.5b modelini kullanır"
              >
                🌺 Modelim (kvsrustun)
              </button>
              <button
                type="button"
                onClick={() => setModelMode('verified_agent')}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  modelMode === 'verified_agent'
                    ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Doğrulanmış RAG ve Tablo Ajanını kullanır (%100 Benchmark)"
              >
                ⚡ Doğrulanmış Ajan
              </button>
            </div>

            <button
              onClick={() => setMessages(messages.slice(0, 1))}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-white transition cursor-pointer"
              title="Sohbeti temizle"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-6 space-y-5 overflow-y-auto max-h-[500px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-sm ${
                  msg.sender === 'user'
                    ? 'bg-rose-600 text-white rounded-br-none'
                    : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>

                {msg.sender === 'assistant' && (
                  <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      {getSourceBadge(msg)}
                      {msg.latencyMs !== undefined && (
                        <span className="text-[11px] text-slate-600">
                          {msg.latencyMs} ms
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => copyToClipboard(msg.text, msg.id)}
                      className="text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
                      title="Yanıtı kopyala"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 text-[11px]">Kopyalandı</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Kopyala</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Collapsible Trace & Retrieved Chunks */}
              {msg.sender === 'assistant' && (msg.retrievedSections?.length || msg.queriedRooms?.length || msg.toolCallsExecuted?.length) && (
                <div className="mt-1.5 max-w-[85%] w-full">
                  <button
                    onClick={() => setExpandedTraceId(expandedTraceId === msg.id ? null : msg.id)}
                    className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-slate-700 cursor-pointer px-2 py-1"
                  >
                    <span>Ajan Mantığı & Çağrılan Araçlar ({msg.toolCallsExecuted?.length || 0})</span>
                    {expandedTraceId === msg.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {expandedTraceId === msg.id && (
                    <div className="p-3 bg-slate-900 text-slate-200 rounded-xl text-xs space-y-2 mt-1 border border-slate-800 shadow-inner font-mono">
                      {msg.toolCallsExecuted && (
                        <div>
                          <span className="text-rose-400 font-semibold block mb-0.5">Yürütülen Ajan Çağrıları:</span>
                          <ul className="list-disc pl-4 space-y-0.5 text-slate-300">
                            {msg.toolCallsExecuted.map((tc, i) => (
                              <li key={i}>{tc}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {msg.retrievedSections && msg.retrievedSections.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-800">
                          <span className="text-emerald-400 font-semibold block mb-0.5">Erişilen Rehber Bölümleri:</span>
                          {msg.retrievedSections.map((sec) => (
                            <div key={sec.id} className="text-[11px] text-slate-300 mb-1">
                              <span className="text-amber-300 font-medium">[{sec.title}]: </span>
                              <span>"{sec.snippet}"</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.queriedRooms && msg.queriedRooms.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-800">
                          <span className="text-blue-400 font-semibold block mb-0.5">Sorgulanan Oda Kayıtları:</span>
                          <div className="text-[11px] text-slate-300">
                            {JSON.stringify(msg.queriedRooms, null, 2)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs py-2">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-bounce delay-150"></div>
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-bounce delay-300"></div>
              <span className="text-slate-500 italic ml-2">Begonvil Otel Rehberi ve Tablosu taranıyor...</span>
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Otel kuralları, oda fiyatları veya hizmetler hakkında bir soru sorun..."
              className="flex-1 bg-white border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl font-medium text-sm flex items-center gap-2 shadow-md shadow-rose-600/20 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Gönder</span>
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-slate-600 mt-2 px-1">
            <span className="font-medium text-slate-700">
              {modelMode === 'hf_model' ? '🌺 Aktif: kvsrustun/begonvil-otel-1.5b (Hugging Face)' : '⚡ Aktif: Doğrulanmış RAG ve Tablo Ajanı (15/15)'}
            </span>
            <span>RAG: 15 Bölüm | Tablo: 8 Oda | Araç: transfer_ucreti</span>
          </div>
        </div>
      </div>
    </div>
  );
};
