import React from 'react';
import { Hotel, Sparkles, ShieldCheck, Database, Award, Github } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasApiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, hasApiKey }) => {
  const tabs = [
    { id: 'chat', label: 'AI Misafir Asistanı', icon: Sparkles, badge: 'Canlı RAG' },
    { id: 'benchmark', label: '13 Test Sorusu & Benchmark', icon: Award, badge: 'Değerlendirme' },
    { id: 'rooms', label: 'Odalar & Fiyat Simülatörü', icon: Database, badge: 'odalar.csv' },
    { id: 'guide', label: 'Otel Rehberi (15 Bölüm)', icon: Hotel, badge: 'rehber.pdf' },
    { id: 'github', label: 'GitHub & Teslim Kılavuzu', icon: Github, badge: 'Git Hazır' },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Hotel Brand */}
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-rose-500/20 ring-2 ring-white/10">
              <Hotel className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white">Begonvil Otel</h1>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Tech İstanbul Bitirme Projesi
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <span>RAG & Yapay Zekâ Misafir Hizmetleri Ajanı</span>
                <span className="inline-block w-1 h-1 rounded-full bg-slate-500"></span>
                <span className="text-amber-400 font-medium">Paket 5: Begonvil Otel (2026)</span>
              </p>
            </div>
          </div>

          {/* Engine Status Badges */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-slate-300">Model:</span>
              <span className="text-white font-semibold">{hasApiKey ? "Gemini 3.8 Flash (Canlı)" : "Gemini Hibrit / RAG Motoru"}</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-700/40 text-xs text-indigo-300">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Sıfır Halüsinasyon Korumalı</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 scrollbar-none pt-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 border border-rose-500'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
