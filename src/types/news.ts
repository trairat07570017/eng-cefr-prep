export interface TargetVocabulary {
  word: string;
  partOfSpeech: string;
  phonetic?: string;
  definitionTh: string;
  definitionEn: string;
  exampleSentence: string;
  cefrLevel: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
}

export interface ComprehensionQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
}

export interface DailyArticle {
  id: string;
  title: string;
  originalTitle: string;
  source: string;
  sourceUrl?: string;
  category: "education" | "technology" | "environment" | "general";
  date: string; // YYYY-MM-DD
  cefrLevel: "B1" | "B2";
  wordCount: number;
  content: string; // adapted text (250-350 words)
  paragraphs: string[];
  keyVocabulary: TargetVocabulary[];
  comprehensionQuestions?: ComprehensionQuestion[];
  isCached?: boolean;
}

export interface NewsGenerationRequest {
  category?: "education" | "technology" | "environment" | "general";
  targetLevel?: "B1" | "B2";
  userApiKey?: string;
  forceRefresh?: boolean;
}
