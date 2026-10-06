import { DailyArticle } from "@/types/news";

// In-memory cache for serverless instance lifetime
const memoryCache: Map<string, DailyArticle> = new Map();

// Built-in starter articles if Gemini API key is not yet configured
export const DEMO_SAMPLE_ARTICLES: Record<string, DailyArticle> = {
  education: {
    id: "sample-demo-education",
    title: "How Interactive Reading Technology Enhances Second Language Acquisition",
    originalTitle: "Technology in Language Learning: Global Studies Highlight Rapid Fluency Gains",
    source: "Educational Insights",
    sourceUrl: "https://www.bbc.com/news/education",
    category: "education",
    date: new Date().toISOString().split("T")[0],
    cefrLevel: "B2",
    wordCount: 284,
    content: `Modern education is undergoing a fundamental transformation through the adoption of interactive learning tools. Recent pedagogical studies demonstrate that second language learners acquire complex vocabulary significantly faster when exposed to contextual, bite-sized daily reading materials rather than traditional memorization drills.\n\nLanguage instructors emphasize that sustained exposure to authentic texts allows students to encounter collocations and idiomatic expressions naturally. By engaging with interactive readers that provide immediate lexical support, learners can overcome cognitive hesitation and focus on thematic comprehension.\n\nFurthermore, cognitive scientists highlight the efficacy of spaced repetition systems in preventing the deterioration of newly acquired knowledge. When learners systematically review target vocabulary at expanding intervals, long-term memory retention increases by up to eighty percent.\n\nIn conclusion, integrating daily digital reading with targeted vocabulary retention techniques empowers educators and students alike to achieve superior proficiency benchmarks, such as CEFR B2 and C1, with measurable consistency.`,
    paragraphs: [
      "Modern education is undergoing a fundamental transformation through the adoption of interactive learning tools. Recent pedagogical studies demonstrate that second language learners acquire complex vocabulary significantly faster when exposed to contextual, bite-sized daily reading materials rather than traditional memorization drills.",
      "Language instructors emphasize that sustained exposure to authentic texts allows students to encounter collocations and idiomatic expressions naturally. By engaging with interactive readers that provide immediate lexical support, learners can overcome cognitive hesitation and focus on thematic comprehension.",
      "Furthermore, cognitive scientists highlight the efficacy of spaced repetition systems in preventing the deterioration of newly acquired knowledge. When learners systematically review target vocabulary at expanding intervals, long-term memory retention increases by up to eighty percent.",
      "In conclusion, integrating daily digital reading with targeted vocabulary retention techniques empowers educators and students alike to achieve superior proficiency benchmarks, such as CEFR B2 and C1, with measurable consistency."
    ],
    keyVocabulary: [
      {
        word: "pedagogical",
        partOfSpeech: "adjective",
        phonetic: "/ˌped.əˈɡɒdʒ.ɪ.kəl/",
        definitionTh: "เกี่ยวกับการสอนหรือการศึกษา",
        definitionEn: "relating to teaching and methods of education",
        exampleSentence: "The school introduced new pedagogical methods to foster critical thinking.",
        cefrLevel: "B2"
      },
      {
        word: "authentic",
        partOfSpeech: "adjective",
        phonetic: "/ɔːˈθen.tɪk/",
        definitionTh: "แท้จริง, เป็นของจริงที่ใช้ในสถานการณ์จริง",
        definitionEn: "real, true, or what someone said it is rather than a copy",
        exampleSentence: "Teachers encourage students to read authentic English news materials.",
        cefrLevel: "B2"
      },
      {
        word: "hesitation",
        partOfSpeech: "noun",
        phonetic: "/ˌhez.ɪˈteɪ.ʃən/",
        definitionTh: "ความลังเล, ความไม่แน่ใจ",
        definitionEn: "the act of pausing before doing something because you are uncertain",
        exampleSentence: "With daily practice, she answered the interview questions without hesitation.",
        cefrLevel: "B2"
      },
      {
        word: "efficacy",
        partOfSpeech: "noun",
        phonetic: "/ˈef.ɪ.kə.si/",
        definitionTh: "ประสิทธิภาพ, ประสิทธิผล",
        definitionEn: "the ability, especially of a medicine or method, to produce the intended result",
        exampleSentence: "Clinical trials proved the efficacy of the new teaching framework.",
        cefrLevel: "C1"
      },
      {
        word: "retention",
        partOfSpeech: "noun",
        phonetic: "/rɪˈten.ʃən/",
        definitionTh: "การรักษาไว้, ความสามารถในการจดจำ",
        definitionEn: "the ability to keep or continue having something, especially in memory",
        exampleSentence: "Spaced flashcards significantly boost vocabulary retention over time.",
        cefrLevel: "B2"
      },
      {
        word: "benchmark",
        partOfSpeech: "noun",
        phonetic: "/ˈbentʃ.mɑːk/",
        definitionTh: "เกณฑ์มาตรฐาน, เกณฑ์เปรียบเทียบ",
        definitionEn: "a standard by which other things can be judged or measured",
        exampleSentence: "Reaching CEFR B2 is an essential benchmark for academic accreditation.",
        cefrLevel: "B2"
      }
    ],
    comprehensionQuestions: [
      {
        question: "According to the passage, what is the main benefit of interactive reading tools?",
        options: [
          "They replace the need for teachers in classrooms",
          "They allow faster vocabulary acquisition through contextual exposure",
          "They reduce the amount of time students spend studying overall",
          "They eliminate the need for grammar rules completely"
        ],
        correctAnswer: 1,
        explanation: "บทความระบุชัดเจนว่าเครื่องมืออ่านแบบโต้ตอบช่วยให้ผู้เรียนจำคำศัพท์ยากได้เร็วขึ้นผ่านการพบคำในบริบทจริง แทนการท่องจำแบบเดิม"
      },
      {
        question: "How does spaced repetition benefit long-term memory according to cognitive scientists?",
        options: [
          "It increases vocabulary retention by up to eighty percent",
          "It forces students to memorize 500 words per day",
          "It allows students to pass exams without revision",
          "It focuses only on auditory learning"
        ],
        correctAnswer: 0,
        explanation: "ในย่อหน้าที่ 3 ระบุว่าการทบทวนแบบเว้นระยะ (Spaced Repetition) ช่วยเพิ่มการจดจำคำศัพท์ระยะยาวได้สูงถึง 80%"
      }
    ],
    isCached: true,
  }
};

export function getCachedArticle(date: string, category: string, level: string): DailyArticle | null {
  const cacheKey = `${date}-${category}-${level}`;
  if (memoryCache.has(cacheKey)) {
    const article = memoryCache.get(cacheKey)!;
    return { ...article, isCached: true };
  }
  return null;
}

export function setCachedArticle(article: DailyArticle): void {
  const cacheKey = `${article.date}-${article.category}-${article.cefrLevel}`;
  memoryCache.set(cacheKey, article);
}
