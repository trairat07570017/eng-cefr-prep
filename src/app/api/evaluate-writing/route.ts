import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini/client";
import { WritingEvaluation } from "@/types/writing";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const promptText = (body.prompt || "").trim();
    const essayText = (body.essay || "").trim();
    const targetLevel = body.targetLevel || "B2";
    const userApiKey = body.userApiKey as string | undefined;

    if (!essayText) {
      return NextResponse.json(
        { success: false, error: "กรุณาพิมพ์บทความก่อนส่งตรวจ" },
        { status: 400 }
      );
    }

    const wordCount = essayText.split(/\s+/).filter(Boolean).length;
    const hasApiKey = Boolean(userApiKey || process.env.GEMINI_API_KEY);

    // If no API key configured, return demo sample evaluation so user can test the UI
    if (!hasApiKey) {
      const demoResult: WritingEvaluation = {
        overallCefrLevel: wordCount >= 150 ? "B2" : "B1",
        estimatedScoreDesc:
          wordCount >= 150
            ? "ระดับ B2 (ผ่านเกณฑ์ ก.ค.ศ. สำหรับครูทั่วไป เพื่อลดระยะเวลา 4 ปี เหลือ 3 ปี)"
            : "ระดับ B1 (ยังไม่ถึงเกณฑ์ ก.ค.ศ. แนะนำให้เพิ่มความยาวให้เกิน 150 คำ)",
        wordCount,
        rubrics: {
          taskAchievement: {
            cefr: "B2",
            feedback: "ตอบคำถามได้ตรงประเด็น มีการยกตัวอย่างสนับสนุนชัดเจน",
          },
          coherenceCohesion: {
            cefr: "B2",
            feedback: "มีการใช้คำเชื่อม (Furthermore, However, In conclusion) อย่างเหมาะสม",
          },
          lexicalResource: {
            cefr: "B2",
            feedback: "คำศัพท์มีความหลากหลายและสอดคล้องกับบริบทการศึกษา",
          },
          grammaticalAccuracy: {
            cefr: "B1",
            feedback: "โครงสร้างประโยคส่วนใหญ่ถูกต้อง แต่ยังมีข้อผิดพลาดเรื่อง Subject-Verb Agreement เล็กน้อย",
          },
        },
        corrections: [
          {
            original: "technology have changed",
            corrected: "technology has changed",
            explanationTh: "คำว่า 'technology' เป็นคำนามเอกพจน์นับไม่ได้ กริยาต้องใช้ 'has' แทน 'have'",
          },
          {
            original: "student can learning easy",
            corrected: "students can learn easily",
            explanationTh: "หลัง modal verb 'can' ต้องตามด้วยกริยารูป infinitive (learn) และขยายด้วย adverb (easily)",
          },
        ],
        vocabUpgrades: [
          {
            originalWord: "very good",
            suggestedUpgrade: "exceptional / exemplary",
            cefrLevel: "C1",
            reasonTh: "ช่วยยกระดับความสละสลวยของสำนวนให้ดูเป็นทางการมากขึ้น",
          },
          {
            originalWord: "help",
            suggestedUpgrade: "facilitate / bolster",
            cefrLevel: "B2",
            reasonTh: "คำศัพท์วิชาการที่พบบ่อยในข้อสอบ EduSynch ระดับ B2 ขึ้นไป",
          },
        ],
        modelEssay: `In contemporary educational discourse, the impact of technological innovation remains a prominent topic. While traditional instruction holds undeniable value, the strategic integration of modern tools undeniably enhances pedagogical outcomes.\n\nFirst and foremost, digital platforms provide personalized learning opportunities that accommodate diverse learning paces. Students can review complex concepts autonomously, thereby consolidating their understanding without feeling overwhelmed. Furthermore, teachers can leverage data analytics to pinpoint individual learning gaps with remarkable precision.\n\nIn conclusion, rather than viewing technology as a replacement for educators, schools should embrace it as a complementary asset that empowers both teachers and learners.`,
        summaryFeedbackTh:
          "บทความของคุณมีโครงสร้างที่ดีและการเรียงลำดับความคิดชัดเจน (ตัวอย่างผลตรวจแบบ Demo กรุณาระบุ Gemini API Key ในเมนูตั้งค่า เพื่อให้ AI ตรวจบทความจริงของคุณอย่างละเอียด)",
      };

      return NextResponse.json({ success: true, evaluation: demoResult, isDemo: true });
    }

    // Call Gemini API for real evaluation
    const ai = getGeminiClient(userApiKey);

    const prompt = `You are a certified international English language examiner specializing in the CEFR framework (A1-C2) and the EduSynch CEFR Level Test for Thai educators.
Evaluate the following test essay written by a candidate.

Target CEFR Benchmark: ${targetLevel}
Prompt Question: "${promptText}"
Candidate's Essay:
"""
${essayText}
"""

Word Count: ${wordCount} words (EduSynch requirement is >= 150 words).

Evaluation Instructions:
1. Determine the accurate overall CEFR level: "A2", "B1", "B2", "C1", or "C2".
2. Explain the estimated result according to Thai Teacher Civil Service (ก.ค.ศ.) accreditation reduction criteria (General teachers need higher than B1, i.e., B2+; Foreign language teachers need higher than B2, i.e., C1+).
3. Evaluate 4 core CEFR rubrics: Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy.
4. Extract 2 to 5 specific grammatical/spelling/punctuation errors with clear Thai explanations.
5. Suggest 2 to 4 vocabulary upgrades (replacing basic words with B2/C1 academic vocabulary) with reasons in Thai.
6. Provide a polished Model Essay (160-220 words) at CEFR ${targetLevel} answering the prompt.
7. Provide an encouraging summary feedback in Thai.

Return ONLY a valid JSON object matching this schema (no markdown backticks):
{
  "overallCefrLevel": "B2",
  "estimatedScoreDesc": "คำอธิบายเทียบเกณฑ์ ก.ค.ศ.",
  "wordCount": ${wordCount},
  "rubrics": {
    "taskAchievement": { "cefr": "B2", "feedback": "Feedback in Thai" },
    "coherenceCohesion": { "cefr": "B2", "feedback": "Feedback in Thai" },
    "lexicalResource": { "cefr": "B2", "feedback": "Feedback in Thai" },
    "grammaticalAccuracy": { "cefr": "B2", "feedback": "Feedback in Thai" }
  },
  "corrections": [
    {
      "original": "incorrect phrase from essay",
      "corrected": "corrected phrase",
      "explanationTh": "คำอธิบายหลักไวยากรณ์ภาษาไทย"
    }
  ],
  "vocabUpgrades": [
    {
      "originalWord": "basic word",
      "suggestedUpgrade": "academic B2/C1 word",
      "cefrLevel": "B2",
      "reasonTh": "เหตุผลคำอธิบายภาษาไทย"
    }
  ],
  "modelEssay": "Model essay text...",
  "summaryFeedbackTh": "ข้อความสรุปและคำแนะนำในการพัฒนาภาษาไทย"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "";
    const cleaned = responseText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const evaluation: WritingEvaluation = JSON.parse(cleaned);

    return NextResponse.json({ success: true, evaluation });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการตรวจบทความ";
    console.error("[API evaluate-writing Error]:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
