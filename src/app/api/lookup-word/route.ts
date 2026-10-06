import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient, generateContentWithFallback } from "@/lib/gemini/client";
import { TargetVocabulary } from "@/types/news";

// Built-in rapid dictionary for common words encountered in news
const LOCAL_DICTIONARY: Record<string, Partial<TargetVocabulary>> = {
  modern: { definitionTh: "ทันสมัย, ในยุคปัจจุบัน", definitionEn: "relating to the present time and not to the past", partOfSpeech: "adjective", cefrLevel: "B1", phonetic: "/ˈmɒd.ən/" },
  learning: { definitionTh: "การเรียนรู้, การศึกษา", definitionEn: "the activity of obtaining knowledge", partOfSpeech: "noun", cefrLevel: "B1", phonetic: "/ˈlɜː.nɪŋ/" },
  student: { definitionTh: "นักเรียน, นิสิต, นักศึกษา", definitionEn: "a person who is learning at a school or college", partOfSpeech: "noun", cefrLevel: "A1", phonetic: "/ˈstjuː.dənt/" },
  students: { definitionTh: "นักเรียน, นิสิต, นักศึกษา", definitionEn: "people who are learning at a school or college", partOfSpeech: "noun", cefrLevel: "A1", phonetic: "/ˈstjuː.dənts/" },
  teacher: { definitionTh: "ครู, ผู้สอน", definitionEn: "a person whose job is to teach", partOfSpeech: "noun", cefrLevel: "A1", phonetic: "/ˈtiː.tʃər/" },
  teachers: { definitionTh: "ครู, ผู้สอน", definitionEn: "people whose job is to teach", partOfSpeech: "noun", cefrLevel: "A1", phonetic: "/ˈtiː.tʃərz/" },
  educator: { definitionTh: "นักการศึกษา, ครูอาจารย์", definitionEn: "a person who teaches people, especially a school teacher", partOfSpeech: "noun", cefrLevel: "B2", phonetic: "/ˈedʒ.ʊ.keɪ.tər/" },
  educators: { definitionTh: "นักการศึกษา, ครูอาจารย์", definitionEn: "people who teach, especially in school", partOfSpeech: "noun", cefrLevel: "B2", phonetic: "/ˈedʒ.ʊ.keɪ.tərz/" },
  education: { definitionTh: "การศึกษา, ระบบการเรียนการสอน", definitionEn: "the process of teaching or learning, especially in a school or college", partOfSpeech: "noun", cefrLevel: "B1", phonetic: "/ˌedʒ.ʊˈkeɪ.ʃən/" },
  school: { definitionTh: "โรงเรียน, สถานศึกษา", definitionEn: "a place where children go to be educated", partOfSpeech: "noun", cefrLevel: "A1", phonetic: "/skuːl/" },
  schools: { definitionTh: "โรงเรียน, สถานศึกษา", definitionEn: "places where children go to be educated", partOfSpeech: "noun", cefrLevel: "A1", phonetic: "/skuːlz/" },
  classroom: { definitionTh: "ห้องเรียน", definitionEn: "a room in a school where students have lessons", partOfSpeech: "noun", cefrLevel: "A1", phonetic: "/ˈklɑːs.ruːm/" },
  classrooms: { definitionTh: "ห้องเรียน", definitionEn: "rooms in a school where students have lessons", partOfSpeech: "noun", cefrLevel: "A1", phonetic: "/ˈklɑːs.ruːmz/" },
  language: { definitionTh: "ภาษา", definitionEn: "a system of communication consisting of sounds, words, and grammar", partOfSpeech: "noun", cefrLevel: "A1", phonetic: "/ˈlæŋ.ɡwɪdʒ/" },
  languages: { definitionTh: "ภาษา", definitionEn: "systems of communication used by people", partOfSpeech: "noun", cefrLevel: "A1", phonetic: "/ˈlæŋ.ɡwɪ.dʒɪz/" },
  vocabulary: { definitionTh: "คำศัพท์, คลังคำศัพท์", definitionEn: "all the words known and used by a particular person", partOfSpeech: "noun", cefrLevel: "B1", phonetic: "/vəˈkæb.jə.lər.i/" },
  study: { definitionTh: "การศึกษาค้นคว้า, งานวิจัย", definitionEn: "the examination of a subject in detail in order to discover new information", partOfSpeech: "noun", cefrLevel: "B1", phonetic: "/ˈstʌd.i/" },
  studies: { definitionTh: "การศึกษาค้นคว้า, งานวิจัย", definitionEn: "the examination of subjects in detail", partOfSpeech: "noun", cefrLevel: "B1", phonetic: "/ˈstʌd.iz/" },
  traditional: { definitionTh: "แบบดั้งเดิม, ตามธรรมเนียม", definitionEn: "following or belonging to the customs or ways of behaving that have continued in a group for a long time", partOfSpeech: "adjective", cefrLevel: "B1", phonetic: "/trəˈdɪʃ.ən.əl/" },
  complex: { definitionTh: "ซับซ้อน, ยุ่งยาก", definitionEn: "involving a lot of different but related parts, difficult to understand", partOfSpeech: "adjective", cefrLevel: "B2", phonetic: "/ˈkɒm.pleks/" },
  faster: { definitionTh: "เร็วขึ้น, รวดเร็วยิ่งขึ้น", definitionEn: "moving or happening with great speed", partOfSpeech: "adverb", cefrLevel: "A2", phonetic: "/ˈfɑːs.tər/" },
  drills: { definitionTh: "การฝึกฝนซ้ำๆ, แบบฝึกหัด", definitionEn: "an activity that practises a particular skill and often involves repeating the same thing several times", partOfSpeech: "noun", cefrLevel: "B2", phonetic: "/drɪlz/" },
  daily: { definitionTh: "รายวัน, ประจำวัน", definitionEn: "happening or produced every day or once a day", partOfSpeech: "adjective", cefrLevel: "A2", phonetic: "/ˈdeɪ.li/" },
  reading: { definitionTh: "การอ่าน", definitionEn: "the skill or activity of getting information from books", partOfSpeech: "noun", cefrLevel: "A1", phonetic: "/ˈriː.dɪŋ/" },
  writing: { definitionTh: "การเขียน", definitionEn: "the activity of creating written works", partOfSpeech: "noun", cefrLevel: "A1", phonetic: "/ˈraɪ.tɪŋ/" },
  listening: { definitionTh: "การฟัง", definitionEn: "the activity of paying attention to sound or speech", partOfSpeech: "noun", cefrLevel: "A1", phonetic: "/ˈlɪs.ən.ɪŋ/" },
  speaking: { definitionTh: "การพูด", definitionEn: "the action of conveying information or expressing feelings in speech", partOfSpeech: "noun", cefrLevel: "A1", phonetic: "/ˈspiː.kɪŋ/" },
  tools: { definitionTh: "เครื่องมือ, อุปกรณ์ช่วยสอน", definitionEn: "pieces of equipment or software used for a particular purpose", partOfSpeech: "noun", cefrLevel: "A2", phonetic: "/tuːlz/" },
  materials: { definitionTh: "สื่อการเรียนรู้, วัสดุอุปกรณ์", definitionEn: "information or ideas used in books, discussions, or teaching", partOfSpeech: "noun", cefrLevel: "B1", phonetic: "/məˈtɪə.ri.əlz/" },
  acquire: { definitionTh: "ได้รับมา, ซึมซับความรู้", definitionEn: "to get or gain something, especially by your own efforts or ability", partOfSpeech: "verb", cefrLevel: "B2", phonetic: "/əˈkwaɪər/" },
  encounter: { definitionTh: "พบเจอ, เผชิญหน้า", definitionEn: "to experience something, especially something unpleasant or difficult, or to meet someone unexpectedly", partOfSpeech: "verb", cefrLevel: "B2", phonetic: "/ɪnˈkaʊn.tər/" },
  naturally: { definitionTh: "อย่างเป็นธรรมชาติ", definitionEn: "in a regular or normal way; as you would expect", partOfSpeech: "adverb", cefrLevel: "B1", phonetic: "/ˈnætʃ.ər.əl.i/" },
  instructors: { definitionTh: "ผู้สอน, อาจารย์ผู้สอน", definitionEn: "people who teach something, especially a practical skill", partOfSpeech: "noun", cefrLevel: "B2", phonetic: "/ɪnˈstrʌk.tərz/" },
  emphasize: { definitionTh: "เน้นย้ำ, ให้ความสำคัญเป็นพิเศษ", definitionEn: "to show that something is very important or worth giving attention to", partOfSpeech: "verb", cefrLevel: "B2", phonetic: "/ˈem.fə.saɪz/" },
  cognitive: { definitionTh: "เกี่ยวกับกระบวนการคิดและการรับรู้", definitionEn: "connected with thinking or conscious mental processes", partOfSpeech: "adjective", cefrLevel: "C1", phonetic: "/ˈkɒɡ.nə.tɪv/" },
  scientists: { definitionTh: "นักวิทยาศาสตร์", definitionEn: "experts who study or work in one of the sciences", partOfSpeech: "noun", cefrLevel: "A2", phonetic: "/ˈsaɪən.tɪsts/" },
  system: { definitionTh: "ระบบ", definitionEn: "a set of connected things or devices that operate together", partOfSpeech: "noun", cefrLevel: "B1", phonetic: "/ˈsɪs.təm/" },
  systems: { definitionTh: "ระบบ", definitionEn: "sets of connected things or devices", partOfSpeech: "noun", cefrLevel: "B1", phonetic: "/ˈsɪs.təmz/" },
  preventing: { definitionTh: "การป้องกัน, การขัดขวางไม่ให้เกิดขึ้น", definitionEn: "stopping something from happening or someone from doing something", partOfSpeech: "verb", cefrLevel: "B1", phonetic: "/prɪˈven.tɪŋ/" },
  prevent: { definitionTh: "ป้องกัน, ยับยั้ง", definitionEn: "to stop something from happening", partOfSpeech: "verb", cefrLevel: "B1", phonetic: "/prɪˈvent/" },
  deterioration: { definitionTh: "การเสื่อมถอย, การลดลงของคุณภาพ", definitionEn: "the process of becoming worse in quality or condition", partOfSpeech: "noun", cefrLevel: "C1", phonetic: "/dɪˌtɪə.ri.əˈreɪ.ʃən/" },
  knowledge: { definitionTh: "ความรู้, ความเข้าใจ", definitionEn: "information, skills, and understanding that you have gained through learning or experience", partOfSpeech: "noun", cefrLevel: "B1", phonetic: "/ˈnɒl.ɪdʒ/" },
  conclusion: { definitionTh: "บทสรุป, ข้อสรุป", definitionEn: "the final part of something; an opinion that you form after thinking about many facts", partOfSpeech: "noun", cefrLevel: "B1", phonetic: "/kənˈkluː.ʒən/" },
  empowers: { definitionTh: "เสริมพลัง, ให้อำนาจและความมั่นใจ", definitionEn: "gives someone the authority or freedom to do something", partOfSpeech: "verb", cefrLevel: "B2", phonetic: "/ɪmˈpaʊ.ərz/" },
  empower: { definitionTh: "เสริมพลัง, เพิ่มขีดความสามารถ", definitionEn: "to give someone official authority or the freedom to do something", partOfSpeech: "verb", cefrLevel: "B2", phonetic: "/ɪmˈpaʊ.ər/" },
  achieve: { definitionTh: "บรรลุผลสำเร็จ, ทำได้ตามเป้า", definitionEn: "to succeed in finishing something or reaching an aim", partOfSpeech: "verb", cefrLevel: "B1", phonetic: "/əˈtʃiːv/" },
  superior: { definitionTh: "ที่เหนือกว่า, คุณภาพยอดเยี่ยม", definitionEn: "better than average or better than others of the same type", partOfSpeech: "adjective", cefrLevel: "B2", phonetic: "/suːˈpɪə.ri.ər/" },
  proficiency: { definitionTh: "ความเชี่ยวชาญ, ความคล่องแคล่วชำนาญ", definitionEn: "the fact of having the skill and experience for doing something", partOfSpeech: "noun", cefrLevel: "B2", phonetic: "/prəˈfɪʃ.ən.si/" },
  consistency: { definitionTh: "ความสม่ำเสมอ, ความต่อเนื่องมั่นคง", definitionEn: "the physical condition of continuing to happen or develop in the same way", partOfSpeech: "noun", cefrLevel: "B2", phonetic: "/kənˈsɪs.tən.si/" },
  fundamental: { definitionTh: "ที่เป็นพื้นฐานสำคัญ, ขั้นรากฐาน", definitionEn: "forming the base, from which everything else develops", partOfSpeech: "adjective", cefrLevel: "B2", phonetic: "/ˌfʌn.dəˈmen.təl/" },
  adoption: { definitionTh: "การนำมาปรับใช้, การยอมรับนำมาทำตาม", definitionEn: "the accepting and starting to use of something new", partOfSpeech: "noun", cefrLevel: "B2", phonetic: "/əˈdɒp.ʃən/" },
  demonstrate: { definitionTh: "แสดงให้เห็นประจักษ์, สาธิต", definitionEn: "to show or make something clear", partOfSpeech: "verb", cefrLevel: "B2", phonetic: "/ˈdem.ən.streɪt/" },
  significantly: { definitionTh: "อย่างมีนัยสำคัญ, อย่างเห็นได้ชัด", definitionEn: "in a way that is easy to see or by a large amount", partOfSpeech: "adverb", cefrLevel: "B2", phonetic: "/sɪɡˈnɪf.ɪ.kənt.li/" },
  contextual: { definitionTh: "ตามบริบทแวดล้อม", definitionEn: "related to the context or situation", partOfSpeech: "adjective", cefrLevel: "B2", phonetic: "/kənˈteks.tʃu.əl/" },
  sustained: { definitionTh: "อย่างต่อเนื่องยาวนาน", definitionEn: "continuing for a long period without becoming less", partOfSpeech: "adjective", cefrLevel: "B2", phonetic: "/səˈsteɪnd/" },
  expressions: { definitionTh: "สำนวน, การแสดงออกทางคำพูด", definitionEn: "words or phrases that express particular ideas or emotions", partOfSpeech: "noun", cefrLevel: "B1", phonetic: "/ɪkˈspreʃ.ənz/" },
  support: { definitionTh: "การสนับสนุน, การช่วยเหลือ", definitionEn: "agreement with and encouragement for an idea or person", partOfSpeech: "noun", cefrLevel: "B1", phonetic: "/səˈpɔːt/" },
  overcome: { definitionTh: "เอาชนะอุปสรรค, ก้าวข้ามผ่าน", definitionEn: "to defeat or succeed in controlling or dealing with something", partOfSpeech: "verb", cefrLevel: "B2", phonetic: "/ˌəʊ.vəˈkʌm/" },
  thematic: { definitionTh: "เกี่ยวกับหัวข้อหลัก, เชิงประเด็น", definitionEn: "relating to a particular subject or topic", partOfSpeech: "adjective", cefrLevel: "C1", phonetic: "/θɪˈmæt.ɪk/" },
  comprehension: { definitionTh: "ความเข้าใจอย่างถ่องแท้", definitionEn: "the ability to understand something completely", partOfSpeech: "noun", cefrLevel: "B2", phonetic: "/ˌkɒm.prɪˈhen.ʃən/" },
  highlight: { definitionTh: "เน้นย้ำ, ชี้ให้เห็นความสำคัญ", definitionEn: "to emphasize something or make people notice something", partOfSpeech: "verb", cefrLevel: "B1", phonetic: "/ˈhaɪ.laɪt/" },
  systematically: { definitionTh: "อย่างเป็นระบบและมีระเบียบแบบแผน", definitionEn: "in a way that is done according to an agreed method", partOfSpeech: "adverb", cefrLevel: "B2", phonetic: "/ˌsɪs.təˈmæt.ɪ.kəl.i/" },
  review: { definitionTh: "ทบทวน, ตรวจสอบอีกครั้ง", definitionEn: "the process of considering all of something again", partOfSpeech: "verb", cefrLevel: "A2", phonetic: "/rɪˈvjuː/" },
  expanding: { definitionTh: "ที่ขยายกว้างขึ้น, ที่เพิ่มขึ้น", definitionEn: "increasing in size, number, or importance", partOfSpeech: "adjective", cefrLevel: "B2", phonetic: "/ɪkˈspæn.dɪŋ/" },
  intervals: { definitionTh: "ช่วงระยะเวลาที่เว้นไว้", definitionEn: "periods between two events or times", partOfSpeech: "noun", cefrLevel: "B2", phonetic: "/ˈɪn.tə.vəlz/" },
  increases: { definitionTh: "เพิ่มขึ้น, สูงขึ้น", definitionEn: "becomes larger in amount or number", partOfSpeech: "verb", cefrLevel: "B1", phonetic: "/ɪnˈkriː.sɪz/" },
  integrating: { definitionTh: "การผสมผสานรวมกัน", definitionEn: "combining two or more things in order to become more effective", partOfSpeech: "verb", cefrLevel: "B2", phonetic: "/ˈɪn.tɪ.ɡreɪ.tɪŋ/" },
  digital: { definitionTh: "เชิงดิจิทัล, ระบบคอมพิวเตอร์", definitionEn: "using or relating to computer technology and the internet", partOfSpeech: "adjective", cefrLevel: "A2", phonetic: "/ˈdɪdʒ.ɪ.təl/" },
  techniques: { definitionTh: "เทคนิค, วิธีการปฏิบัติ", definitionEn: "ways of doing an activity that need skill", partOfSpeech: "noun", cefrLevel: "B1", phonetic: "/tekˈniːks/" },
  measurable: { definitionTh: "ที่สามารถวัดผลได้อย่างชัดเจน", definitionEn: "able to be measured or noticed", partOfSpeech: "adjective", cefrLevel: "B2", phonetic: "/ˈmeʒ.ər.ə.bəl/" },
  intelligence: { definitionTh: "ความฉลาด, เชาวน์ปัญญา", definitionEn: "the ability to learn, understand, and make judgments", partOfSpeech: "noun", cefrLevel: "B1", phonetic: "/ɪnˈtel.ɪ.dʒəns/" },
  artificial: { definitionTh: "ที่ประดิษฐ์ขึ้น, เทียม", definitionEn: "made by human beings and not forming naturally", partOfSpeech: "adjective", cefrLevel: "B1", phonetic: "/ˌɑː.tɪˈfɪʃ.əl/" },
  rapid: { definitionTh: "รวดเร็ว, ฉับไว", definitionEn: "happening in a short period of time or at a fast pace", partOfSpeech: "adjective", cefrLevel: "B2", phonetic: "/ˈræp.ɪd/" },
  acceleration: { definitionTh: "การเร่งความเร็ว, การเติบโตอย่างรวดเร็ว", definitionEn: "the process of getting faster or happening sooner", partOfSpeech: "noun", cefrLevel: "C1", phonetic: "/əkˌsel.əˈreɪ.ʃən/" },
  profoundly: { definitionTh: "อย่างลึกซึ้ง, อย่างยิ่งใหญ่", definitionEn: "deeply or to an extreme degree", partOfSpeech: "adverb", cefrLevel: "C1", phonetic: "/prəˈfaʊnd.li/" },
  disrupting: { definitionTh: "การเปลี่ยนแปลงหรือรบกวนโครงสร้างเดิม", definitionEn: "changing the traditional way that an industry or market operates", partOfSpeech: "verb", cefrLevel: "B2", phonetic: "/dɪsˈrʌp.tɪŋ/" },
  employment: { definitionTh: "การจ้างงาน, การทำงาน", definitionEn: "the state of having paid work", partOfSpeech: "noun", cefrLevel: "B1", phonetic: "/ɪmˈplɔɪ.mənt/" },
  workforce: { definitionTh: "แรงงาน, กำลังคนในการทำงาน", definitionEn: "the group of people who work in a company or country", partOfSpeech: "noun", cefrLevel: "B2", phonetic: "/ˈwɜːk.fɔːs/" },
  productivity: { definitionTh: "ผลิตภาพ, ประสิทธิภาพในการสร้างผลงาน", definitionEn: "the rate at which a person or company does useful work", partOfSpeech: "noun", cefrLevel: "B2", phonetic: "/ˌprɒd.ʌkˈtɪv.ə.ti/" },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawWord = (body.word || "").trim();
    const sentence = (body.sentence || "").trim();
    const userApiKey = body.userApiKey as string | undefined;

    if (!rawWord) {
      return NextResponse.json({ success: false, error: "Missing word" }, { status: 400 });
    }

    const cleanWord = rawWord.replace(/^[^\w]+|[^\w]+$/g, "").toLowerCase();

    // 1. Check local rapid dictionary first
    if (LOCAL_DICTIONARY[cleanWord]) {
      const entry = LOCAL_DICTIONARY[cleanWord];
      const result: TargetVocabulary = {
        word: cleanWord,
        partOfSpeech: entry.partOfSpeech || "vocabulary",
        phonetic: entry.phonetic || `/${cleanWord}/`,
        definitionTh: entry.definitionTh || "คำศัพท์ในบทความ",
        definitionEn: entry.definitionEn || "English vocabulary word",
        exampleSentence: sentence || `Word found in context: ${cleanWord}`,
        cefrLevel: (entry.cefrLevel as "B1" | "B2" | "C1") || "B2",
      };
      return NextResponse.json({ success: true, vocab: result, source: "local" });
    }

    // 2. If Gemini API key is available, use Gemini for high-accuracy contextual translation
    const hasKey = Boolean(userApiKey || process.env.GEMINI_API_KEY);
    if (hasKey) {
      try {
        const ai = getGeminiClient(userApiKey);
        const prompt = `Define the English word "${cleanWord}" in Thai for a Thai teacher preparing for the CEFR test.
Context sentence: "${sentence || cleanWord}"

Return ONLY a JSON object:
{
  "word": "${cleanWord}",
  "partOfSpeech": "noun/verb/adjective/adverb",
  "phonetic": "/IPA phonetic/",
  "definitionTh": "คำแปลภาษาไทยที่แม่นยำและกระชับ",
  "definitionEn": "Concise English definition",
  "exampleSentence": "A clear example sentence using the word",
  "cefrLevel": "B1 or B2 or C1"
}`;

        const response = await generateContentWithFallback(ai, {
          contents: prompt,
          config: {
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        });

        const text = response.text || "";
        const cleaned = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
        const parsed = JSON.parse(cleaned);
        return NextResponse.json({ success: true, vocab: parsed, source: "gemini" });
      } catch (geminiErr) {
        console.warn("[Lookup Word] Gemini error, falling back:", geminiErr);
      }
    }

    // 3. Smart linguistic fallback
    const fallbackVocab: TargetVocabulary = {
      word: cleanWord,
      partOfSpeech: cleanWord.endsWith("ing") ? "verb (-ing)" : cleanWord.endsWith("ed") ? "verb (past)" : cleanWord.endsWith("ly") ? "adverb" : "word",
      phonetic: `/${cleanWord}/`,
      definitionTh: `คำศัพท์ในบทความ (คลิกบันทึกเพื่อจัดเข้าคลังคำศัพท์และทบทวน)`,
      definitionEn: `Word encountered in reading: ${cleanWord}`,
      exampleSentence: sentence || `Extracted from reading text: ${cleanWord}`,
      cefrLevel: "B2",
    };

    return NextResponse.json({ success: true, vocab: fallbackVocab, source: "fallback" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
