export interface WritingPrompt {
  id: string;
  category: "education" | "technology" | "society" | "environment";
  title: string;
  promptText: string;
  recommendedTimeMinutes: number; // 20
  minWords: number; // 150
}

export interface GrammarCorrection {
  original: string;
  corrected: string;
  explanationTh: string;
}

export interface VocabUpgrade {
  originalWord: string;
  suggestedUpgrade: string;
  cefrLevel: "B2" | "C1";
  reasonTh: string;
}

export interface WritingEvaluation {
  overallCefrLevel: "A2" | "B1" | "B2" | "C1" | "C2";
  estimatedScoreDesc: string; // e.g. "ผ่านเกณฑ์ ก.ค.ศ. สำหรับครูทั่วไป (B2 ขึ้นไป)"
  wordCount: number;
  rubrics: {
    taskAchievement: { cefr: string; feedback: string };
    coherenceCohesion: { cefr: string; feedback: string };
    lexicalResource: { cefr: string; feedback: string };
    grammaticalAccuracy: { cefr: string; feedback: string };
  };
  corrections: GrammarCorrection[];
  vocabUpgrades: VocabUpgrade[];
  modelEssay: string;
  summaryFeedbackTh: string;
}
