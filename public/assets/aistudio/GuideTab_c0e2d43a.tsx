import React, { useState } from 'react';
import { BookOpen, Search, Sparkles, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { GUIDE_SECTIONS, GuideSection } from '../data/hotelData.ts';

interface GuideTabProps {
  onAskSectionQuestion: (query: string) => void;
}

export const GuideTab: React.FC<GuideTabProps> = ({ onAskSectionQuestion }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<number | null>(null);

  const filteredSections = GUIDE_SECTIONS.filter(sec => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      sec.title.toLowerCase().includes(q) ||
      sec.content.toLowerCase().includes(q) ||
      sec.category.toLowerCase().includes(q) ||
      sec.keywords.some(k => k.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>RAG Doküman Kaynağı: rehber.pdf (15 Bölüm)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Begonvil Otel Misafir Rehberi 2026
          </h2>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl">
            RAG vektör ve semantik arama motoru tarafından indekslenen resmi kurum rehberi. Misafir kuralları, saatler, ücretler ve hizmet politikaları bu 15 bölümden çekilmektedir.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rehberde ara (örn: sigara, kahvaltı, havuz)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-rose-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* 15 Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSections.map((sec) => (
          <div
            key={sec.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                  {sec.category}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  Bölüm {sec.id}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base mb-2">{sec.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {sec.content}
              </p>

              {/* Keywords Tag Cloud */}
              <div className="mt-3.5 flex flex-wrap gap-1">
                {sec.keywords.slice(0, 4).map((kw, i) => (
                  <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Doğrulanmış RAG Çunkı</span>
              <button
                onClick={() => onAskSectionQuestion(`Bana ${sec.title} hakkında detaylı bilgi verir misiniz?`)}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Asistana Sor</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
