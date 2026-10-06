import { getGeminiClient, generateContentWithFallback } from "./client";
import { RawNewsItem } from "../rss/fetcher";
import { DailyArticle, TargetVocabulary, ComprehensionQuestion } from "@/types/news";

export async function rewriteNewsToCefr(
  rawNews: RawNewsItem,
  targetLevel: "B1" | "B2" = "B2",
  customApiKey?: string
): Promise<DailyArticle> {
  const ai = getGeminiClient(customApiKey);

  const prompt = `You are an expert English language educator specializing in the CEFR framework and EduSynch exam preparation for Thai teachers.
Rewrite the following news article into a graded English reading passage suitable for CEFR ${targetLevel} learners.

Source Info:
- Headline: "${rawNews.title}"
- Summary: "${rawNews.description}"
- Category: ${rawNews.category}
- Source: ${rawNews.source}

Requirements:
1. Title: Create an engaging, clear English title (max 10 words).
2. Content: 
   - Rewrite the news story into 3 to 4 well-structured paragraphs (250 - 320 words total).
   - The language complexity must strictly match CEFR ${targetLevel} (use compound/complex sentences, clear cohesive devices, and formal yet accessible vocabulary).
3. Key Vocabulary (5 to 7 words):
   - Select 5 to 7 high-value academic or news vocabulary words from the rewritten text.
   - For each word, provide:
     * word: the exact lemma
     * partOfSpeech: (noun, verb, adjective, adverb)
     * phonetic: standard IPA phonetic transcription (e.g. /ɪˈnɪʃ.ə.tɪv/)
     * definitionTh: precise, natural Thai translation suitable for Thai teachers
     * definitionEn: clear, concise English definition
     * exampleSentence: a clear example sentence showing contextual usage
     * cefrLevel: "B1", "B2", or "C1"
4. Full Thai Translation:
   - Provide "titleTh": a natural, engaging Thai translation of the title.
   - Provide "paragraphsTh": an array of accurate, natural Thai translations for each corresponding paragraph in paragraphs array.
5. Comprehension Questions (2 questions):
   - Question 1: Main idea or inference question
   - Question 2: Detail or vocabulary-in-context question
   - Provide 4 multiple choice options per question, the correct 0-based index, and an explanation in Thai.

Return ONLY a valid JSON object with this exact structure (no markdown formatting, no code block backticks):
{
  "title": "Adapted English Title",
  "titleTh": "หัวข้อข่าวภาษาไทยที่กระชับและสละสลวย",
  "paragraphs": [
    "First paragraph text in English...",
    "Second paragraph text in English...",
    "Third paragraph text in English..."
  ],
  "paragraphsTh": [
    "คำแปลภาษาไทยของย่อหน้าที่หนึ่งอย่างเป็นธรรมชาติและถูกต้องตามบริบท...",
    "คำแปลภาษาไทยของย่อหน้าที่สอง...",
    "คำแปลภาษาไทยของย่อหน้าที่สาม..."
  ],
  "keyVocabulary": [
    {
      "word": "initiative",
      "partOfSpeech": "noun",
      "phonetic": "/ɪˈnɪʃ.ə.tɪv/",
      "definitionTh": "การริเริ่ม, โครงการริเริ่มใหม่",
      "definitionEn": "a new plan or process to achieve something or solve a problem",
      "exampleSentence": "The government launched a green initiative to promote renewable energy.",
      "cefrLevel": "B2"
    }
  ],
  "comprehensionQuestions": [
    {
      "question": "What is the primary objective of the new program?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "คำอธิบายภาษาไทย..."
    }
  ]
}`;

  const response = await generateContentWithFallback(ai, {
    contents: prompt,
    config: {
      temperature: 0.3,
      responseMimeType: "application/json",
    },
  });

  const responseText = response.text || "";
  let parsedData: {
    title: string;
    titleTh?: string;
    paragraphs: string[];
    paragraphsTh?: string[];
    keyVocabulary: TargetVocabulary[];
    comprehensionQuestions: ComprehensionQuestion[];
  };

  try {
    // Strip possible markdown backticks if returned despite json mime type
    const cleanedJson = responseText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
    parsedData = JSON.parse(cleanedJson);
  } catch (parseError) {
    console.error("[Gemini Rewriter] Failed to parse JSON response:", responseText, parseError);
    throw new Error("PARSER_ERROR: ไม่สามารถแปลงคำตอบจาก AI เป็นรูปแบบข้อมูลที่ถูกต้องได้");
  }

  const content = parsedData.paragraphs.join("\n\n");
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const today = new Date().toISOString().split("T")[0];

  return {
    id: `article-${today}-${rawNews.category}`,
    title: parsedData.title,
    titleTh: parsedData.titleTh,
    originalTitle: rawNews.title,
    source: rawNews.source,
    sourceUrl: rawNews.link,
    category: rawNews.category,
    date: today,
    cefrLevel: targetLevel,
    wordCount,
    content,
    paragraphs: parsedData.paragraphs,
    paragraphsTh: parsedData.paragraphsTh,
    keyVocabulary: parsedData.keyVocabulary || [],
    comprehensionQuestions: parsedData.comprehensionQuestions || [],
    isCached: false,
  };
}
