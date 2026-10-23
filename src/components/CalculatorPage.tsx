
import React, { useState } from 'react';
import {
  Calculator,
  BedDouble,
  Users,
  Maximize2,
  Calendar,
  PawPrint,
  Car,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Percent,
  Receipt
} from 'lucide-react';
import { ROOMS_DATA, RoomData } from '../data/hotelData.ts';

export const CalculatorPage: React.FC = () => {
  const [selectedRoomName, setSelectedRoomName] = useState<string>("Deniz Manzaralı Suit");
  const [nights, setNights] = useState<number>(3);
  const [daysAhead, setDaysAhead] = useState<number>(30); // 60+ gives 15% discount
  const [hasPet, setHasPet] = useState<boolean>(false);
  const [transferType, setTransferType] = useState<'yok' | 'standart' | 'vip'>('yok');
  const [earlyCheckIn, setEarlyCheckIn] = useState<boolean>(false);
  const [lateCheckOut, setLateCheckOut] = useState<'yok' | '16' | '18'>('yok');

  const selectedRoom: RoomData = ROOMS_DATA.find(r => r.oda_tipi === selectedRoomName) || ROOMS_DATA[5];

  // 1. Base Room Calculation
  const baseRoomTotal = selectedRoom.gecelik_fiyat_tl * nights;

  // 2. Erken Rezervasyon İndirimi
  const isEarlyBooking = daysAhead >= 60;
  const earlyBookingDiscount = isEarlyBooking ? Math.round(baseRoomTotal * 0.15) : 0;
  const discountedRoomTotal = baseRoomTotal - earlyBookingDiscount;

  // 3. Evcil Hayvan Ücreti & Kuralı
  const petFeePerNight = 600;
  const petTotal = hasPet && selectedRoom.evcil_hayvan ? (petFeePerNight * nights) : 0;
  const isPetViolatingRoomRule = hasPet && !selectedRoom.evcil_hayvan;

  // 4. Havalimanı Transferi
  let transferFee = 0;
  if (transferType === 'standart') transferFee = 1800;
  if (transferType === 'vip') transferFee = 3000;

  // 5. Erken Giriş & Geç Çıkış
  const earlyCheckInFee = earlyCheckIn ? 1000 : 0;
  let lateCheckOutFee = 0;
  if (lateCheckOut === '16') lateCheckOutFee = 1000;
  if (lateCheckOut === '18') lateCheckOutFee = Math.round(selectedRoom.gecelik_fiyat_tl / 2);

  // Grand Total
  const grandTotal = discountedRoomTotal + petTotal + transferFee + earlyCheckInFee + lateCheckOutFee;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-rose-950 text-white rounded-3xl p-6 sm:p-8 border border-stone-700/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Resmi Rehber Kuralları ve Fiyat Motoru</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Konaklama & Fiyat Hesaplayıcı
          </h2>
          <p className="text-stone-300 text-sm mt-1.5 max-w-2xl leading-relaxed">
            Begonvil Otel Misafir Rehberi 2026 kurallarına (erken rezervasyon indirimi, evcil hayvan ücreti, transfer ve oda fiyatları) göre canlı hesaplama yapın.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Room Selection Grid */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <label className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-rose-600" />
                <span>1. Oda Tipini Seçin (odalar.csv)</span>
              </span>
              <span className="text-xs font-normal text-stone-500">
                Gecelik: <strong className="text-rose-700">{selectedRoom.gecelik_fiyat_tl.toLocaleString('tr-TR')} TL</strong>
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ROOMS_DATA.map((room) => {
                const isSelected = selectedRoomName === room.oda_tipi;
                return (
                  <button
                    key={room.oda_tipi}
                    onClick={() => setSelectedRoomName(room.oda_tipi)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-rose-600 bg-rose-50/70 ring-2 ring-rose-600/20 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900">{room.oda_tipi}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500">
                        <span>{room.kapasite} Kişilik</span>
                        <span>•</span>
                        <span>{room.metrekare} m²</span>
                        <span>•</span>
                        <span className="capitalize">{room.manzara}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs font-bold text-rose-700">
                      {room.gecelik_fiyat_tl.toLocaleString('tr-TR')} TL <span className="text-[10px] font-normal text-stone-400">/gece</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nights & Early Booking */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-6">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-600" />
              <span>2. Konaklama Süresi & Rezervasyon Tarihi</span>
            </h3>

            {/* Night slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-stone-600 font-medium">Kalış Süresi:</span>
                <span className="font-bold text-sm text-slate-900 bg-stone-100 px-3 py-1 rounded-xl">
                  {nights} Gece
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="14"
                value={nights}
                onChange={(e) => setNights(parseInt(e.target.value))}
                className="w-full accent-rose-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>1 Gece</span>
                <span className={nights === 3 ? 'text-rose-700 font-bold' : ''}>3 Gece</span>
                <span>7 Gece</span>
                <span>14 Gece</span>
              </div>
            </div>

            {/* Early booking slider */}
            <div className="pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-stone-600 font-medium">Girişe Kalan Gün (Erken Rezervasyon):</span>
                <span className={`font-bold text-sm px-3 py-1 rounded-xl ${
                  isEarlyBooking ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-slate-900'
                }`}>
                  {daysAhead} Gün Önce {isEarlyBooking && '(%15 İndirimli)'}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 mb-2">
                Rehber Bölüm 2: En az 60 gün önce yapılan rezervasyonlarda %15 indirim uygulanır.
              </p>
              <input
                type="range"
                min="0"
                max="90"
                value={daysAhead}
                onChange={(e) => setDaysAhead(parseInt(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>Son Dakika (0)</span>
                <span>30 Gün</span>
                <span className="text-emerald-700 font-semibold">≥60 Gün (%15 İndirim)</span>
                <span>90 Gün</span>
              </div>
            </div>
          </div>

          {/* Add-ons: Pet, Transfer, Check-in/out */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-600" />
              <span>3. İlave Hizmetler & Otel Kuralları (Rehber PDF)</span>
            </h3>

            {/* Evcil Hayvan */}
            <div className={`p-4 rounded-2xl border transition-all ${
              isPetViolatingRoomRule
                ? 'border-red-300 bg-red-50/70'
                : hasPet
                ? 'border-emerald-300 bg-emerald-50/50'
                : 'border-stone-200 bg-stone-50/50'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-700 shrink-0">
                    <PawPrint className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Evcil Hayvan ile Konaklama
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Rehber Bölüm 9: Gecelik 600 TL temizlik ücreti (10 kg altı kedi/köpek)
                    </span>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={hasPet}
                  onChange={(e) => setHasPet(e.target.checked)}
                  className="w-5 h-5 accent-rose-700 rounded cursor-pointer mt-1"
                />
              </div>

              {isPetViolatingRoomRule && (
                <div className="mt-3 pt-3 border-t border-red-200 flex items-start gap-2 text-xs text-red-800">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Rehber Bölüm 9 Kuralı:</strong> Evcil hayvanlı misafirler <em>yalnızca bahçe katındaki odalarda</em> konaklayabilir. Seçtiğiniz {selectedRoom.oda_tipi} bahçe katında değildir. Lütfen <strong>Standart Bahçe Odası</strong> veya <strong>Bahçe Katı Suit</strong> seçiniz.
                  </div>
                </div>
              )}
            </div>

            {/* Havalimanı Transferi */}
            <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-700 shrink-0">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Havalimanı Transfer Hizmeti
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Rehber Bölüm 8: 45 dk mesafe, en az 48 saat önce talep
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  { id: 'yok', label: 'Transfer Yok', fee: '0 TL' },
                  { id: 'standart', label: 'Standart (1-4 Kişi)', fee: '+1.800 TL' },
                  { id: 'vip', label: 'VIP Araç', fee: '+3.000 TL' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTransferType(item.id as any)}
                    className={`py-2 px-2 rounded-xl text-center border text-xs font-medium transition cursor-pointer ${
                      transferType === item.id
                        ? 'border-rose-600 bg-white text-rose-800 shadow-2xs font-semibold'
                        : 'border-stone-200 bg-white/60 text-stone-600 hover:bg-white'
                    }`}
                  >
                    <div className="truncate">{item.label}</div>
                    <div className="text-[10px] text-stone-400 mt-0.5">{item.fee}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Erken Giriş / Geç Çıkış */}
            <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-700 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Erken Giriş & Geç Çıkış Seçenekleri
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Rehber Bölüm 1 (Standart: Giriş 14:00, Çıkış 12:00)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={earlyCheckIn}
                    onChange={(e) => setEarlyCheckIn(e.target.checked)}
                    className="accent-rose-700"
                  />
                  <span>10:00 Erken Giriş (+1.000 TL)</span>
                </label>

                <select
                  value={lateCheckOut}
                  onChange={(e) => setLateCheckOut(e.target.value as any)}
                  className="p-2.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-700 outline-none"
                >
                  <option value="yok">Geç Çıkış Yok (12:00)</option>
                  <option value="16">16:00'ya kadar (+1.000 TL)</option>
                  <option value="18">18:00'e kadar (+%{50} oda ücreti)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Boutique Receipt Card */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-lg shadow-stone-200/40 space-y-5">
            {/* Receipt Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-700">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Fiyat & Hesap Dökümü</h3>
                  <p className="text-[11px] text-stone-400">Begonvil Butik Otel • 2026 Tarifesi</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                Canlı Formül
              </span>
            </div>

            {/* Line Items */}
            <div className="space-y-3 text-xs">
              {/* Room Base */}
              <div className="flex items-start justify-between py-1">
                <div>
                  <span className="font-semibold text-slate-900 block">{selectedRoom.oda_tipi}</span>
                  <span className="text-[11px] text-stone-400">
                    {nights} gece x {selectedRoom.gecelik_fiyat_tl.toLocaleString('tr-TR')} TL
                  </span>
                </div>
                <span className="font-bold text-slate-900">
                  {baseRoomTotal.toLocaleString('tr-TR')} TL
                </span>
              </div>

              {/* Early Booking Discount */}
              {isEarlyBooking && (
                <div className="flex items-center justify-between py-1 text-emerald-700 bg-emerald-50/80 px-2.5 py-1.5 rounded-xl border border-emerald-200/60">
                  <div className="flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5" />
                    <span>Erken Rezervasyon İndirimi (%15)</span>
                  </div>
                  <span className="font-bold">
                    -{earlyBookingDiscount.toLocaleString('tr-TR')} TL
                  </span>
                </div>
              )}

              {/* Pet Fee */}
              {hasPet && selectedRoom.evcil_hayvan && (
                <div className="flex items-center justify-between py-1 text-stone-700">
                  <span>Evcil Hayvan Temizlik ({nights} x 600 TL)</span>
                  <span className="font-bold text-slate-900">
                    +{petTotal.toLocaleString('tr-TR')} TL
                  </span>
                </div>
              )}

              {/* Transfer Fee */}
              {transferFee > 0 && (
                <div className="flex items-center justify-between py-1 text-stone-700">
                  <span>Havalimanı Transfer ({transferType === 'vip' ? 'VIP' : 'Standart'})</span>
                  <span className="font-bold text-slate-900">
                    +{transferFee.toLocaleString('tr-TR')} TL
                  </span>
                </div>
              )}

              {/* Early Check-in Fee */}
              {earlyCheckInFee > 0 && (
                <div className="flex items-center justify-between py-1 text-stone-700">
                  <span>Erken Giriş (10:00)</span>
                  <span className="font-bold text-slate-900">
                    +{earlyCheckInFee.toLocaleString('tr-TR')} TL
                  </span>
                </div>
              )}

              {/* Late Check-out Fee */}
              {lateCheckOutFee > 0 && (
                <div className="flex items-center justify-between py-1 text-stone-700">
                  <span>Geç Çıkış ({lateCheckOut === '16' ? '16:00' : '18:00'})</span>
                  <span className="font-bold text-slate-900">
                    +{lateCheckOutFee.toLocaleString('tr-TR')} TL
                  </span>
                </div>
              )}
            </div>

            {/* Total Section */}
            <div className="pt-4 border-t-2 border-dashed border-stone-200">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs uppercase font-bold tracking-wider text-stone-400">
                  Genel Toplam:
                </span>
                <div className="text-3xl font-black text-rose-700 tracking-tight">
                  {grandTotal.toLocaleString('tr-TR')} TL
                </div>
              </div>
              <div className="text-[11px] text-stone-400 font-mono">
                {nights} Gece • {selectedRoom.oda_tipi}
                {isEarlyBooking && ' • %15 İndirimli'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
