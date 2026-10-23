import { TEST_QUESTIONS, TestQuestion } from "../data/hotelData.ts";
import { executeAgentQuery, AgentResponse } from "./agent.ts";

export interface EvaluationResult {
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

export interface BenchmarkReport {
  timestamp: string;
  totalQuestions: number;
  passedQuestions: number;
  accuracyRate: number;
  hallucinationPreventionRate: number;
  averageLatencyMs: number;
  results: EvaluationResult[];
  categoryBreakdown: {
    category: string;
    label: string;
    total: number;
    passed: number;
  }[];
}

export function evaluateAnswer(
  test: TestQuestion,
  actual: AgentResponse
): { passed: boolean; score: number; criteriaMet: string[]; issues: string[] } {
  const criteriaMet: string[] = [];
  const issues: string[] = [];
  const ans = actual.answer.toLowerCase();

  switch (test.id) {
    case 1:
      if (ans.includes("14:00") || ans.includes("14.00")) criteriaMet.push("Giriş saati 14:00 belirtildi.");
      else issues.push("Giriş saati 14:00 eksik.");

      if (ans.includes("10:00") || ans.includes("10.00") || ans.includes("erken giriş")) criteriaMet.push("Erken giriş 10:00 bilgisi aktarıldı.");
      if (ans.includes("1.000") || ans.includes("1000")) criteriaMet.push("1.000 TL ücret bilgisi aktarıldı.");
      break;

    case 2:
      if (ans.includes("ilk gece") || ans.includes("ilk gecenin")) criteriaMet.push("İlk gecenin ücreti alınacağı doğru belirtildi.");
      else issues.push("İlk gecenin ücreti alınacağı açıkça belirtilmedi.");
      break;

    case 3:
      if (ans.includes("10:30") || ans.includes("10.30")) criteriaMet.push("Kahvaltının 10:30'a kadar olduğu belirtildi.");
      else issues.push("10:30 bitiş saati eksik.");
      if (ans.includes("07:30") || ans.includes("7:30")) criteriaMet.push("Başlangıç saati 07:30 belirtildi.");
      break;

    case 4:
      if (ans.includes("evet") || ans.includes("yıl boyunca") || ans.includes("açık")) criteriaMet.push("Kışın açık olduğu doğrulandı.");
      else issues.push("Açık olup olmadığı net belirtilmedi.");
      if (ans.includes("09:00") || ans.includes("21:00") || ans.includes("yıl boyunca")) criteriaMet.push("Çalışma saatleri veya yıl boyunca detayı aktarıldı.");
      break;

    case 5:
      if (ans.includes("2.200") || ans.includes("2200")) criteriaMet.push("50 dk klasik masaj 2.200 TL doğrulandı.");
      else issues.push("2.200 TL klasik masaj ücreti eksik.");
      if (ans.includes("3.100") || ans.includes("3100")) criteriaMet.push("80 dk aromaterapi 3.100 TL doğrulandı.");
      else issues.push("3.100 TL aromaterapi masaj ücreti eksik.");
      break;

    case 6:
      if (ans.includes("10 kg") || ans.includes("10 kilogram") || ans.includes("evet")) criteriaMet.push("10 kg altı şartı veya kabul bilgisi aktarıldı.");
      else issues.push("10 kg sınırı eksik.");
      if (ans.includes("600")) criteriaMet.push("Gecelik 600 TL temizlik ücreti aktarıldı.");
      if (ans.includes("bahçe katı") || ans.includes("bahçe")) criteriaMet.push("Yalnızca bahçe katı odalar kuralı aktarıldı.");
      break;

    case 7:
      if (ans.includes("evet") || ans.includes("transfer")) criteriaMet.push("Hizmetin varlığı doğrulandı.");
      if (ans.includes("1.800") || ans.includes("1800")) criteriaMet.push("1.800 TL standart araç ücreti aktarıldı.");
      if (ans.includes("3.000") || ans.includes("3000")) criteriaMet.push("VIP 3.000 TL bilgisi aktarıldı.");
      break;

    case 8:
      if (ans.includes("hayır") || ans.includes("yasak") || ans.includes("içilemez") || ans.includes("içilmez")) {
        criteriaMet.push("Yasak olduğu net şekilde belirtildi.");
      } else {
        issues.push("Sigara yasağı net belirtilmedi.");
      }
      if (ans.includes("5.000") || ans.includes("5000")) criteriaMet.push("5.000 TL temizlik ücreti yaptırımı aktarıldı.");
      break;

    case 9:
      if (ans.includes("evet") || ans.includes("istasyon")) criteriaMet.push("Şarj imkanı olduğu doğrulandı.");
      if (ans.includes("12") || ans.includes("kwh") || ans.includes("kilovatsaat")) criteriaMet.push("kWh başına 12 TL ücreti aktarıldı.");
      break;

    case 10:
      if (ans.includes("4 kişi") || ans.includes("4 kişilik")) criteriaMet.push("4 kişilik kapasite aktarıldı.");
      else issues.push("4 kişilik kapasite eksik.");
      if (ans.includes("7.400") || ans.includes("7400")) criteriaMet.push("7.400 TL gecelik fiyat aktarıldı.");
      else issues.push("7.400 TL fiyat eksik.");
      if (ans.includes("40") || ans.includes("bahçe")) criteriaMet.push("40 m2 veya bahçe manzarası detayı aktarıldı.");
      break;

    case 11:
      if (ans.includes("34.500") || ans.includes("34500")) criteriaMet.push("34.500 TL toplam hesaplama tam doğru.");
      else issues.push("34.500 TL toplam tutar hesaplanamadı.");
      if (ans.includes("11.500") || ans.includes("11500")) criteriaMet.push("Gecelik 11.500 TL taban fiyat belirtildi.");
      break;

    case 12:
      if (ans.includes("yok") || ans.includes("bilgi bulunmamaktadır") || ans.includes("yer almamaktadır") || ans.includes("belirtilmemiştir") || ans.includes("butik")) {
        criteriaMet.push("Halüsinasyon engellendi: Rehberde yıldız bilgisi olmadığı doğru tespit edildi.");
      } else {
        issues.push("Uydurma/Halüsinasyon riski: Rehberde olmayan yıldız sayısı üretildi.");
      }
      break;

    case 13:
      if (ans.includes("yok") || ans.includes("bilgi bulunmamaktadır") || ans.includes("yer almamaktadır") || ans.includes("belirtilmemiştir")) {
        criteriaMet.push("Halüsinasyon engellendi: Düğün organizasyonu bilgisi olmadığı doğru tespit edildi.");
      } else {
        issues.push("Uydurma/Halüsinasyon riski: Rehberde olmayan düğün servisi uyduruldu.");
      }
      break;

    case 14:
      if (ans.includes("3.000") || ans.includes("3000")) {
        criteriaMet.push("VIP transfer ücreti 3.000 TL doğru tespit edildi.");
      } else {
        issues.push("VIP transfer ücreti 3.000 TL eksik.");
      }
      break;

    case 15:
      if (ans.includes("1.800") || ans.includes("1800")) {
        criteriaMet.push("Standart transfer ücreti 1.800 TL doğru tespit edildi.");
      } else {
        issues.push("Standart transfer ücreti 1.800 TL eksik.");
      }
      break;
  }

  const passed = issues.length === 0 && criteriaMet.length > 0;
  const score = passed ? 100 : Math.max(20, criteriaMet.length * 25);

  return { passed, score, criteriaMet, issues };
}

export async function runBenchmark(specificId?: number): Promise<BenchmarkReport> {
  const questionsToRun = specificId
    ? TEST_QUESTIONS.filter(q => q.id === specificId)
    : TEST_QUESTIONS;

  const results: EvaluationResult[] = [];

  for (const test of questionsToRun) {
    const actual = await executeAgentQuery(test.soru);
    const evalData = evaluateAnswer(test, actual);

    results.push({
      questionId: test.id,
      question: test.soru,
      expectedAnswer: test.beklenen_cevap,
      expectedSource: test.kaynak,
      category: test.category,
      actualAnswer: actual.answer,
      actualSource: actual.source,
      toolCallsExecuted: actual.toolCallsExecuted,
      latencyMs: actual.latencyMs,
      passed: evalData.passed,
      score: evalData.score,
      criteriaMet: evalData.criteriaMet,
      issues: evalData.issues
    });
  }

  const passedQuestions = results.filter(r => r.passed).length;
  const accuracyRate = Math.round((passedQuestions / results.length) * 100);

  const outOfScopeTests = results.filter(r => r.category === 'out_of_scope');
  const hallucinationPassed = outOfScopeTests.filter(r => r.passed).length;
  const hallucinationPreventionRate = outOfScopeTests.length > 0
    ? Math.round((hallucinationPassed / outOfScopeTests.length) * 100)
    : 100;

  const totalLatency = results.reduce((sum, r) => sum + r.latencyMs, 0);
  const averageLatencyMs = Math.round(totalLatency / (results.length || 1));

  const categories = [
    { category: 'rag', label: 'Metin RAG (Rehber PDF)' },
    { category: 'table', label: 'Tablo Sorgusu (odalar.csv)' },
    { category: 'table_calc', label: 'Tablo + Matematiksel Hesap' },
    { category: 'out_of_scope', label: 'Halüsinasyon Önleme (Yok)' }
  ];

  const categoryBreakdown = categories.map(cat => {
    const list = results.filter(r => r.category === cat.category);
    return {
      category: cat.category,
      label: cat.label,
      total: list.length,
      passed: list.filter(r => r.passed).length
    };
  });

  return {
    timestamp: new Date().toISOString(),
    totalQuestions: results.length,
    passedQuestions,
    accuracyRate,
    hallucinationPreventionRate,
    averageLatencyMs,
    results,
    categoryBreakdown
  };
}
