import { TargetVocabulary } from "@/types/news";

export interface StoredVocabularyItem extends TargetVocabulary {
  id: string;
  savedAt: string; // ISO date
  sourceArticleTitle?: string;
  reviewStage: number; // 1 to 5 (Leitner SRS)
  nextReviewDate: string; // YYYY-MM-DD
  timesReviewed: number;
}

const VOCAB_STORAGE_KEY = "eng_cefr_vocab_bank";

// Leitner intervals in days for stages 1 to 5
const SRS_INTERVAL_DAYS = [1, 3, 7, 14, 30];

export function getSavedVocabItems(): StoredVocabularyItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VOCAB_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredVocabularyItem[];
  } catch (err) {
    console.error("[Vocab Storage] Failed to load saved vocab:", err);
    return [];
  }
}

export function saveVocabItem(
  vocab: TargetVocabulary,
  sourceArticleTitle?: string
): { success: boolean; isNew: boolean } {
  if (typeof window === "undefined") return { success: false, isNew: false };

  try {
    const currentList = getSavedVocabItems();
    const existingIndex = currentList.findIndex(
      (item) => item.word.toLowerCase() === vocab.word.toLowerCase()
    );

    if (existingIndex >= 0) {
      return { success: true, isNew: false };
    }

    const today = new Date().toISOString().split("T")[0];
    const newItem: StoredVocabularyItem = {
      ...vocab,
      id: `vocab-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      savedAt: new Date().toISOString(),
      sourceArticleTitle,
      reviewStage: 1,
      nextReviewDate: today,
      timesReviewed: 0,
    };

    const updated = [newItem, ...currentList];
    localStorage.setItem(VOCAB_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("vocabBankUpdated"));

    return { success: true, isNew: true };
  } catch (err) {
    console.error("[Vocab Storage] Failed to save vocab:", err);
    return { success: false, isNew: false };
  }
}

export function isWordSaved(word: string): boolean {
  if (typeof window === "undefined") return false;
  const currentList = getSavedVocabItems();
  return currentList.some((item) => item.word.toLowerCase() === word.toLowerCase());
}

export function removeVocabItem(id: string): void {
  if (typeof window === "undefined") return;
  const currentList = getSavedVocabItems();
  const filtered = currentList.filter((item) => item.id !== id);
  localStorage.setItem(VOCAB_STORAGE_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new Event("vocabBankUpdated"));

  // Also remove from Supabase cloud if connected
  try {
    const sbUrl = (
      localStorage.getItem("eng_cefr_supabase_url") ||
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      ""
    ).trim();
    const sbKey = (
      localStorage.getItem("eng_cefr_supabase_key") ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      ""
    ).trim();

    if (sbUrl && sbKey) {
      fetch(`${sbUrl.replace(/\/$/, "")}/rest/v1/vocab_bank?id=eq.${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
          apikey: sbKey,
          Authorization: `Bearer ${sbKey}`,
        },
      }).catch((err) => {
        console.warn("[Vocab Storage] Supabase delete warning:", err);
      });
    }
  } catch {
    // Ignore background delete error
  }
}

export function reviewVocabItem(
  id: string,
  outcome: "again" | "good" | "mastered"
): void {
  if (typeof window === "undefined") return;
  const currentList = getSavedVocabItems();
  const targetIndex = currentList.findIndex((item) => item.id === id);

  if (targetIndex === -1) return;

  const item = currentList[targetIndex];
  let newStage = item.reviewStage;
  let intervalDays = 1;

  if (outcome === "again") {
    // Reset to stage 1
    newStage = 1;
    intervalDays = 1;
  } else if (outcome === "good") {
    // Advance to next stage (max 5)
    newStage = Math.min(item.reviewStage + 1, 5);
    intervalDays = SRS_INTERVAL_DAYS[newStage - 1] || 1;
  } else if (outcome === "mastered") {
    // Jump straight to mastered stage 5
    newStage = 5;
    intervalDays = 30;
  }

  // Calculate next review date
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervalDays);
  const nextReviewDateString = nextDate.toISOString().split("T")[0];

  currentList[targetIndex] = {
    ...item,
    reviewStage: newStage,
    nextReviewDate: nextReviewDateString,
    timesReviewed: item.timesReviewed + 1,
  };

  localStorage.setItem(VOCAB_STORAGE_KEY, JSON.stringify(currentList));
  window.dispatchEvent(new Event("vocabBankUpdated"));
}

export function getDueVocabItems(): StoredVocabularyItem[] {
  const all = getSavedVocabItems();
  const today = new Date().toISOString().split("T")[0];
  return all.filter((item) => item.nextReviewDate <= today);
}

// Starter core vocabulary for EduSynch CEFR B2/C1
export const STARTER_CORE_VOCAB: TargetVocabulary[] = [
  {
    word: "facilitate",
    partOfSpeech: "verb",
    phonetic: "/fəˈsɪl.ɪ.teɪt/",
    definitionTh: "อำนวยความสะดวก, ทำให้ง่ายขึ้น",
    definitionEn: "to make something possible or easier to accomplish",
    exampleSentence: "Modern digital tools facilitate collaborative learning among educators.",
    cefrLevel: "B2",
  },
  {
    word: "advocate",
    partOfSpeech: "verb",
    phonetic: "/ˈæd.və.keɪt/",
    definitionTh: "สนับสนุน, เรียกร้องให้มี",
    definitionEn: "to publicly support or recommend a particular cause or policy",
    exampleSentence: "Teachers advocate for continuous professional development programs.",
    cefrLevel: "B2",
  },
  {
    word: "pragmatic",
    partOfSpeech: "adjective",
    phonetic: "/præɡˈmæt.ɪk/",
    definitionTh: "ที่เน้นการปฏิบัติได้จริง, อิงความเป็นจริง",
    definitionEn: "solving problems in a sensible, realistic way rather than following theoretical ideas",
    exampleSentence: "She took a pragmatic approach to lesson planning and time management.",
    cefrLevel: "C1",
  },
  {
    word: "scrutinize",
    partOfSpeech: "verb",
    phonetic: "/ˈskruː.tɪ.naɪz/",
    definitionTh: "ตรวจสอบอย่างละเอียดถี่ถ้วน",
    definitionEn: "to examine something very carefully in order to discover information",
    exampleSentence: "Examiners will scrutinize each essay for grammatical range and coherence.",
    cefrLevel: "C1",
  },
  {
    word: "consolidate",
    partOfSpeech: "verb",
    phonetic: "/kənˈsɒl.ɪ.deɪt/",
    definitionTh: "เสริมสร้างให้มั่นคง, รวบรวมให้เป็นปึกแผ่น",
    definitionEn: "to make something stronger, more solid, or combined into a single whole",
    exampleSentence: "Daily flashcard review consolidates new vocabulary into long-term memory.",
    cefrLevel: "B2",
  },
  {
    word: "unprecedented",
    partOfSpeech: "adjective",
    phonetic: "/ʌnˈpres.ɪ.den.tɪd/",
    definitionTh: "ที่ไม่เคยปรากฏมาก่อน, เป็นประวัติการณ์",
    definitionEn: "never having happened or existed in the past",
    exampleSentence: "The past decade witnessed unprecedented advances in educational technology.",
    cefrLevel: "B2",
  },
  {
    word: "eloquent",
    partOfSpeech: "adjective",
    phonetic: "/ˈel.ə.kwənt/",
    definitionTh: "พูดจาคล่องแคล่วสละสลวย, คมคาย",
    definitionEn: "giving a clear, strong message; expressing feelings or opinions gracefully",
    exampleSentence: "Her eloquent presentation impressed the academic evaluation committee.",
    cefrLevel: "C1",
  },
  {
    word: "robust",
    partOfSpeech: "adjective",
    phonetic: "/rəʊˈbʌst/",
    definitionTh: "แข็งแกร่ง, มีประสิทธิภาพสูงและทนทาน",
    definitionEn: "strong, healthy, and not likely to fail or be weakened",
    exampleSentence: "Schools require robust pedagogical strategies to support all students.",
    cefrLevel: "B2",
  },
];

export function seedStarterVocab(): number {
  let count = 0;
  STARTER_CORE_VOCAB.forEach((vocab) => {
    const res = saveVocabItem(vocab, "EduSynch Core Starter Pack");
    if (res.isNew) count++;
  });
  return count;
}
