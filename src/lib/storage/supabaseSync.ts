import { StoredVocabularyItem, getSavedVocabItems } from "./vocabStorage";

interface SupabaseConfig {
  url: string;
  key: string;
}

function getSupabaseConfig(): SupabaseConfig | null {
  if (typeof window === "undefined") return null;
  const url = (
    localStorage.getItem("eng_cefr_supabase_url") ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    ""
  ).trim();
  const key = (
    localStorage.getItem("eng_cefr_supabase_key") ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ""
  ).trim();

  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

export function isSupabaseConfigured(): boolean {
  return !!getSupabaseConfig();
}

/**
 * Sync local vocabulary items with Supabase PostgreSQL via REST API
 */
export async function syncVocabWithCloud(): Promise<{
  success: boolean;
  syncedCount: number;
  message: string;
}> {
  const config = getSupabaseConfig();
  if (!config) {
    return {
      success: false,
      syncedCount: 0,
      message: "ยังไม่ได้ระบุ Supabase URL หรือ Anon Key",
    };
  }

  try {
    const headers = {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    };

    // 1. Fetch remote items
    const fetchRes = await fetch(`${config.url}/rest/v1/vocab_bank?select=*`, {
      headers,
    });

    if (!fetchRes.ok) {
      if (fetchRes.status === 404 || fetchRes.status === 400) {
        return {
          success: false,
          syncedCount: 0,
          message: "ไม่พบตาราง vocab_bank ใน Supabase กรุณารันคำสั่ง SQL สร้างตารางก่อน",
        };
      }
      return {
        success: false,
        syncedCount: 0,
        message: `Supabase ตอบกลับด้วยรหัส HTTP ${fetchRes.status}`,
      };
    }

    const remoteRows = (await fetchRes.json()) as Array<{
      id: string;
      word: string;
      part_of_speech?: string;
      phonetic?: string;
      definition_th?: string;
      definition_en?: string;
      example_sentence?: string;
      cefr_level?: "B1" | "B2" | "C1";
      review_stage?: number;
      next_review_date?: string;
      times_reviewed?: number;
      source_article_title?: string;
      saved_at?: string;
    }>;

    // Convert remote rows to StoredVocabularyItem format
    const remoteItems: StoredVocabularyItem[] = remoteRows.map((r) => ({
      id: r.id,
      word: r.word,
      partOfSpeech: r.part_of_speech || "",
      phonetic: r.phonetic || "",
      definitionTh: r.definition_th || "",
      definitionEn: r.definition_en || "",
      exampleSentence: r.example_sentence || "",
      cefrLevel: r.cefr_level || "B2",
      reviewStage: r.review_stage || 1,
      nextReviewDate: r.next_review_date || new Date().toISOString().split("T")[0],
      timesReviewed: r.times_reviewed || 0,
      sourceArticleTitle: r.source_article_title,
      savedAt: r.saved_at || new Date().toISOString(),
    }));

    // 2. Merge local and remote
    const localItems = getSavedVocabItems();
    const map = new Map<string, StoredVocabularyItem>();

    // Put remote items first
    for (const item of remoteItems) {
      map.set(item.word.toLowerCase(), item);
    }

    // Merge local items (local takes priority if reviewed more recently or not on remote)
    for (const item of localItems) {
      const existing = map.get(item.word.toLowerCase());
      if (!existing || (item.timesReviewed || 0) >= (existing.timesReviewed || 0)) {
        map.set(item.word.toLowerCase(), item);
      }
    }

    const mergedList = Array.from(map.values());

    // 3. Push merged items back to Supabase
    if (mergedList.length > 0) {
      const rowsToUpsert = mergedList.map((item) => ({
        id: item.id,
        word: item.word,
        part_of_speech: item.partOfSpeech,
        phonetic: item.phonetic,
        definition_th: item.definitionTh,
        definition_en: item.definitionEn,
        example_sentence: item.exampleSentence,
        cefr_level: item.cefrLevel,
        review_stage: item.reviewStage,
        next_review_date: item.nextReviewDate,
        times_reviewed: item.timesReviewed,
        source_article_title: item.sourceArticleTitle || null,
        saved_at: item.savedAt,
      }));

      await fetch(`${config.url}/rest/v1/vocab_bank`, {
        method: "POST",
        headers,
        body: JSON.stringify(rowsToUpsert),
      });
    }

    // 4. Update localStorage
    localStorage.setItem("eng_cefr_vocab_bank", JSON.stringify(mergedList));
    window.dispatchEvent(new Event("vocabBankUpdated"));

    return {
      success: true,
      syncedCount: mergedList.length,
      message: `ซิงค์คำศัพท์สำเร็จแล้ว ${mergedList.length} คำ!`,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      syncedCount: 0,
      message: `เกิดข้อผิดพลาดในการซิงค์: ${errorMsg}`,
    };
  }
}
