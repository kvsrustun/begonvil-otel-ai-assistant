import React, { useState, useEffect } from 'react';
import { Database, Users, Maximize2, Compass, PawPrint, BedDouble, Calculator, ShieldCheck, Sparkles, Check, Car } from 'lucide-react';
import { RoomData } from '../data/hotelData.ts';

export const RoomsTab: React.FC = () => {
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("Deniz Manzaralı Suit");
  const [nights, setNights] = useState<number>(3);
  const [daysAhead, setDaysAhead] = useState<number>(30);
  const [hasPet, setHasPet] = useState<boolean>(false);
  const [transferType, setTransferType] = useState<string>('yok');
  const [filterView, setFilterView] = useState<string>('all');
  const [filterPet, setFilterPet] = useState<boolean | null>(null);

  // Calculation result state
  const [calcResult, setCalcResult] = useState<any>(null);

  useEffect(() => {
    fetch('/api/rooms')
      .then(res => res.json())
      .then(data => setRooms(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedRoom) return;
    fetch('/api/calculate-stay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        odaTipi: selectedRoom,
        geceSayisi: nights,
        gunOncesiRezervasyon: daysAhead,
        evcilHayvanVar: hasPet,
        transferSecimi: transferType
      })
    })
      .then(res => res.json())
      .then(data => setCalcResult(data))
      .catch(console.error);
  }, [selectedRoom, nights, daysAhead, hasPet, transferType]);

  const filteredRooms = rooms.filter(r => {
    if (filterView !== 'all' && r.manzara !== filterView) return false;
    if (filterPet !== null && r.evcil_hayvan !== filterPet) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Tab Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>Yapısal Veri: odalar.csv (8 Oda Tipi)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Begonvil Otel Oda Kataloğu & Hesaplama Motoru
          </h2>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl">
            Ajanın tablo aracı tarafından kullanılan yapısal oda veritabanı. Fiyatlar, kapasite, manzara, evcil hayvan izinleri ve 3 gecelik konaklama matematiksel hesaplamaları buradan beslenir.
          </p>
        </div>

        {/* Quick CSV stat */}
        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="text-center">
            <span className="text-xs text-slate-400 font-medium">Toplam Oda</span>
            <div className="text-2xl font-black text-slate-800">64</div>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div className="text-center">
            <span className="text-xs text-slate-400 font-medium">Kategori</span>
            <div className="text-2xl font-black text-rose-600">8 Tip</div>
          </div>
        </div>
      </div>

      {/* Booking & Price Calculator Simulator */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Kural & Fiyat Hesaplama Simülatörü</h3>
              <p className="text-xs text-slate-400">Rehber Bölüm 2 (%15 Erken Rezervasyon), Bölüm 8 (Transfer) ve Bölüm 9 (Evcil Hayvan) kurallarıyla entegre</p>
            </div>
          </div>
          <span className="text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-full font-medium">
            Test Sorusu #11 Canlı Simülasyonu
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
          {/* Controls */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Oda Tipi Seçimi</label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
              >
                {rooms.map(r => (
                  <option key={r.oda_tipi} value={r.oda_tipi}>
                    {r.oda_tipi} ({r.gecelik_fiyat_tl.toLocaleString('tr-TR')} TL/gece)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kalış Gece Sayısı: <span className="text-rose-400 font-bold">{nights} Gece</span>
              </label>
              <input
                type="range"
                min="1"
                max="14"
                value={nights}
                onChange={(e) => setNights(parseInt(e.target.value))}
                className="w-full accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 gece</span>
                <span>3 gece (Test #11)</span>
                <span>14 gece</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Girişe Kalan Gün: <span className="text-amber-400 font-bold">{daysAhead} Gün Önce</span>
              </label>
              <input
                type="range"
                min="0"
                max="90"
                value={daysAhead}
                onChange={(e) => setDaysAhead(parseInt(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Son Dakika (0)</span>
                <span className={daysAhead >= 60 ? 'text-emerald-400 font-bold' : ''}>≥60 gün (%15 İndirim)</span>
                <span>90 gün</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Havalimanı Transferi</label>
              <select
                value={transferType}
                onChange={(e) => setTransferType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
              >
                <option value="yok">Transfer İstemiyorum</option>
                <option value="standart">Standart Araç (1-4 Kişi) - 1.800 TL</option>
                <option value="vip">VIP Araç - 3.000 TL</option>
              </select>
            </div>

            <div className="sm:col-span-2 flex items-center justify-between p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/80">
              <div className="flex items-center gap-2.5">
                <PawPrint className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-xs font-semibold text-white block">Evcil Hayvan ile Konaklama</span>
                  <span className="text-[11px] text-slate-400">Gecelik 600 TL temizlik ücreti (Yalnızca bahçe katı odalar)</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={hasPet}
                onChange={(e) => setHasPet(e.target.checked)}
                className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Real-time Calculation Receipt */}
          <div className="lg:col-span-5 bg-slate-800/80 rounded-2xl p-5 border border-slate-700 flex flex-col justify-between">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-3">
                Hesaplama Özeti & Ajan Formülü
              </span>

              {calcResult && (
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-700">
                    <span className="text-slate-300">{calcResult.room.oda_tipi} ({nights} gece)</span>
                    <span className="font-semibold text-white">{calcResult.baseRoomTotal.toLocaleString('tr-TR')} TL</span>
                  </div>

                  {calcResult.isEarlyBooking && (
                    <div className="flex justify-between py-1 text-emerald-400 border-b border-slate-700">
                      <span>Erken Rezervasyon İndirimi (%15)</span>
                      <span>-{calcResult.earlyBookingDiscount.toLocaleString('tr-TR')} TL</span>
                    </div>
                  )}

                  {calcResult.petFeeTotal > 0 && (
                    <div className="flex justify-between py-1 text-amber-300 border-b border-slate-700">
                      <span>Evcil Hayvan Temizlik ({nights} x 600 TL)</span>
                      <span>+{calcResult.petFeeTotal.toLocaleString('tr-TR')} TL</span>
                    </div>
                  )}

                  {calcResult.transferFee > 0 && (
                    <div className="flex justify-between py-1 text-purple-300 border-b border-slate-700">
                      <span>Havalimanı Transfer ({calcResult.transferSecimi === 'vip' ? 'VIP' : 'Standart'})</span>
                      <span>+{calcResult.transferFee.toLocaleString('tr-TR')} TL</span>
                    </div>
                  )}

                  {hasPet && !calcResult.petAllowed && (
                    <div className="p-2 rounded-lg bg-red-950/60 border border-red-500/40 text-[11px] text-red-300">
                      ⚠️ Dikkat: Seçilen oda bahçe katında olmadığı için evcil hayvan kabul edilmez. Yalnızca Standart Bahçe Odası ve Bahçe Katı Suit uygundur!
                    </div>
                  )}
                </div>
              )}
            </div>

            {calcResult && (
              <div className="mt-6 pt-4 border-t border-slate-700">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">Toplam Tutar:</span>
                  <div className="text-2xl sm:text-3xl font-black text-rose-400">
                    {calcResult.grandTotal.toLocaleString('tr-TR')} TL
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 mt-2 font-mono bg-slate-950/60 p-2 rounded-lg">
                  {calcResult.breakdownText}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Room Cards Grid */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-xl font-bold text-slate-900">Mevcut Oda Tipleri ({filteredRooms.length})</h3>

          <div className="flex items-center gap-2">
            <select
              value={filterView}
              onChange={(e) => setFilterView(e.target.value)}
              className="bg-white border border-slate-200 text-xs text-slate-700 rounded-xl px-3 py-2 outline-none"
            >
              <option value="all">Tüm Manzaralar</option>
              <option value="deniz">Deniz Manzaralı</option>
              <option value="bahçe">Bahçe Manzaralı</option>
            </select>

            <select
              value={filterPet === null ? 'all' : filterPet ? 'yes' : 'no'}
              onChange={(e) => setFilterPet(e.target.value === 'all' ? null : e.target.value === 'yes')}
              className="bg-white border border-slate-200 text-xs text-slate-700 rounded-xl px-3 py-2 outline-none"
            >
              <option value="all">Evcil Hayvan: Tümü</option>
              <option value="yes">Kabul Edenler (Bahçe Katı)</option>
              <option value="no">Kabul Etmeyenler</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredRooms.map((room) => {
            const isSelected = selectedRoom === room.oda_tipi;
            return (
              <div
                key={room.oda_tipi}
                className={`bg-white rounded-3xl p-5 border transition-all flex flex-col justify-between ${
                  isSelected ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-md' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      room.manzara === 'deniz' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {room.manzara} Manzarası
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {room.oda_sayisi} Adet
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900">{room.oda_tipi}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{room.description}</p>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{room.kapasite} Kişilik</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{room.metrekare} m²</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <PawPrint className={`w-3.5 h-3.5 ${room.evcil_hayvan ? 'text-emerald-500' : 'text-slate-300'}`} />
                      <span className={room.evcil_hayvan ? 'text-emerald-700 font-medium' : 'text-slate-400'}>
                        {room.evcil_hayvan ? 'Evcil Hayvan Kabul Edilir' : 'Evcil Hayvan Alınmaz'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Gecelik</span>
                    <span className="text-lg font-black text-slate-900">
                      {room.gecelik_fiyat_tl.toLocaleString('tr-TR')} TL
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedRoom(room.oda_tipi)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      isSelected
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {isSelected ? 'Seçildi' : 'Hesapla'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
