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
      return { success: true, isNew: false }; // Already in bank
    }

    const today = new Date().toISOString().split("T")[0];
    const newItem: StoredVocabularyItem = {
      ...vocab,
      id: `vocab-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      savedAt: new Date().toISOString(),
      sourceArticleTitle,
      reviewStage: 1,
      nextReviewDate: today, // Due for first review today
      timesReviewed: 0,
    };

    const updated = [newItem, ...currentList];
    localStorage.setItem(VOCAB_STORAGE_KEY, JSON.stringify(updated));

    // Dispatch custom event so other components know vocab count changed
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
}
