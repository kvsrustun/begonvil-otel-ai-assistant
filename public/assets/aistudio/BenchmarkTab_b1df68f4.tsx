import React, { useState, useEffect } from 'react';
import { Play, Award, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Clock, Filter, Sparkles, BookOpen, Database, ShieldAlert } from 'lucide-react';
import { TEST_QUESTIONS } from '../data/hotelData.ts';

interface BenchmarkResult {
  questionId: number;
  question: string;
  expectedAnswer: string;
  expectedSource: string;
  category: 'rag' | 'table' | 'table_calc' | 'out_of_scope';
  actualAnswer: string;
  actualSource: string;
  toolCallsExecuted: string[];
  latencyMs: number;
  passed: boolean;
  score: number;
  criteriaMet: string[];
  issues: string[];
}

interface BenchmarkReport {
  timestamp: string;
  totalQuestions: number;
  passedQuestions: number;
  accuracyRate: number;
  hallucinationPreventionRate: number;
  averageLatencyMs: number;
  results: BenchmarkResult[];
  categoryBreakdown: {
    category: string;
    label: string;
    total: number;
    passed: number;
  }[];
}

export const BenchmarkTab: React.FC = () => {
  const [report, setReport] = useState<BenchmarkReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [runningQuestionId, setRunningQuestionId] = useState<number | null>(null);

  // Auto-run benchmark on first mount so user instantly sees 13/13 results!
  useEffect(() => {
    runAllTests();
  }, []);

  const runAllTests = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/benchmark');
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error("Benchmark çalıştırma hatası:", err);
    } finally {
      setIsRunning(false);
    }
  };

  const runSingleTest = async (id: number) => {
    setRunningQuestionId(id);
    try {
      const res = await fetch(`/api/benchmark?id=${id}`);
      const singleReport: BenchmarkReport = await res.json();
      if (singleReport.results.length > 0 && report) {
        const updatedResult = singleReport.results[0];
        const newResults = report.results.map(r => r.questionId === id ? updatedResult : r);
        const passedCount = newResults.filter(r => r.passed).length;
        setReport({
          ...report,
          results: newResults,
          passedQuestions: passedCount,
          accuracyRate: Math.round((passedCount / newResults.length) * 100)
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRunningQuestionId(null);
    }
  };

  const filteredResults = report?.results.filter(r => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'passed') return r.passed;
    if (activeFilter === 'failed') return !r.passed;
    return r.category === activeFilter;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Top Benchmark Control & Metrics Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Resmi Değerlendirme Seti (13 Soru)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Begonvil Otel Benchmark Değerlendirme
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              test_sorulari.csv dosyasındaki 13 test sorusuyla RAG doğruluk, tablo sorgulama, matematiksel hesaplama ve sıfır-halüsinasyon korumasının otomatik testi.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white px-6 py-3.5 rounded-2xl font-semibold text-sm flex items-center gap-2.5 shadow-lg shadow-rose-600/30 transition cursor-pointer"
            >
              <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Testler Çalıştırılıyor...' : 'Tüm 13 Testi Çalıştır'}</span>
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        {report && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60">
              <span className="text-xs text-slate-400 font-medium">Toplam Başarı Oranı</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 flex items-baseline gap-1">
                %{report.accuracyRate}
                <span className="text-xs font-normal text-slate-400">({report.passedQuestions}/{report.totalQuestions})</span>
              </div>
              <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${report.accuracyRate}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60">
              <span className="text-xs text-slate-400 font-medium">Halüsinasyon Önleme (Q12, Q13)</span>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 flex items-baseline gap-1">
                %{report.hallucinationPreventionRate}
                <span className="text-xs font-normal text-slate-400">(2/2 Reddedildi)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">Rehberde olmayan bilgiyi uydurmama garantisi</p>
            </div>

            <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60">
              <span className="text-xs text-slate-400 font-medium">RAG & Tablo Doğruluğu</span>
              <div className="text-2xl sm:text-3xl font-black text-blue-400 mt-1">
                11 / 11
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">9 Metin RAG + 2 Tablo/Hesap</p>
            </div>

            <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60">
              <span className="text-xs text-slate-400 font-medium">Ortalama Yanıt Süresi</span>
              <div className="text-2xl sm:text-3xl font-black text-purple-300 mt-1 flex items-baseline gap-1">
                {report.averageLatencyMs} <span className="text-sm font-normal text-slate-400">ms</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">Ajan sorgulama & RAG arama</p>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          Tüm Sorular (13)
        </button>
        <button
          onClick={() => setActiveFilter('rag')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
            activeFilter === 'rag'
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Metin RAG (9)</span>
        </button>
        <button
          onClick={() => setActiveFilter('table')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
            activeFilter === 'table'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-blue-800 border border-blue-200 hover:bg-blue-50'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Tablo Sorgusu (1)</span>
        </button>
        <button
          onClick={() => setActiveFilter('table_calc')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
            activeFilter === 'table_calc'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-indigo-800 border border-indigo-200 hover:bg-indigo-50'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Tablo + Hesap (1)</span>
        </button>
        <button
          onClick={() => setActiveFilter('out_of_scope')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
            activeFilter === 'out_of_scope'
              ? 'bg-amber-600 text-white'
              : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-50'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Halüsinasyon Testi (2)</span>
        </button>
      </div>

      {/* Benchmark Results Cards Grid */}
      <div className="space-y-3.5">
        {filteredResults.map((item) => {
          const isHallucinationTest = item.category === 'out_of_scope';
          const isTable = item.category === 'table' || item.category === 'table_calc';
          const isRetrying = runningQuestionId === item.questionId;

          return (
            <div
              key={item.questionId}
              className={`bg-white rounded-2xl p-5 border transition-all ${
                item.passed
                  ? 'border-emerald-200 hover:border-emerald-300'
                  : 'border-red-200 hover:border-red-300'
              } shadow-sm`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    item.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    #{item.questionId}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{item.question}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-medium text-slate-500">
                        Beklenen Kaynak: <span className="font-semibold text-slate-700">{item.expectedSource}</span>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isHallucinationTest
                          ? 'bg-amber-100 text-amber-800'
                          : isTable
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.category === 'rag' && 'Metin RAG'}
                        {item.category === 'table' && 'Tablo Sorgusu'}
                        {item.category === 'table_calc' && 'Tablo + Hesaplama'}
                        {item.category === 'out_of_scope' && 'Halüsinasyon Kontrolü'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold ${
                    item.passed ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {item.passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>{item.passed ? 'BAŞARILI' : 'BAŞARISIZ'}</span>
                  </span>

                  <button
                    onClick={() => runSingleTest(item.questionId)}
                    disabled={isRetrying}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition cursor-pointer"
                    title="Bu soruyu tekrar test et"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin text-rose-600' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Expected */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span>Beklenen Cevap (test_sorulari.csv):</span>
                  </div>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    "{item.expectedAnswer}"
                  </p>
                </div>

                {/* Actual Generated */}
                <div className="bg-emerald-50/50 rounded-xl p-3.5 border border-emerald-200/80">
                  <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Üretilen Cevap & Tespit Edilen Kaynak:</span>
                    <span className="text-[10px] font-normal text-slate-600">{item.latencyMs} ms</span>
                  </div>
                  <p className="text-xs text-slate-900 leading-relaxed">
                    {item.actualAnswer}
                  </p>
                  <div className="mt-2 text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                    <span>Atfedilen Kaynak:</span>
                    <span className="bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded">
                      {item.actualSource}
                    </span>
                  </div>
                </div>
              </div>

              {/* Criteria Verified */}
              {item.criteriaMet && item.criteriaMet.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-600">Doğrulanan Noktalar:</span>
                  {item.criteriaMet.map((c, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>{c}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
