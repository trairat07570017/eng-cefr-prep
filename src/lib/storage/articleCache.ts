import { DailyArticle } from "@/types/news";

// In-memory cache for serverless instance lifetime
const memoryCache: Map<string, DailyArticle> = new Map();

// Built-in starter articles if Gemini API key is not yet configured or on category switch
export const DEMO_SAMPLE_ARTICLES: Record<string, DailyArticle> = {
  education: {
    id: "sample-demo-education",
    title: "How Interactive Reading Technology Enhances Second Language Acquisition",
    originalTitle: "Technology in Language Learning: Global Studies Highlight Rapid Fluency Gains",
    source: "BBC News Education",
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
      "In conclusion, integrating daily digital reading with targeted vocabulary retention techniques empowers educators and students alike to achieve superior proficiency benchmarks, such as CEFR B2 and C1, with measurable consistency.",
    ],
    keyVocabulary: [
      {
        word: "pedagogical",
        partOfSpeech: "adjective",
        phonetic: "/ˌped.əˈɡɒdʒ.ɪ.kəl/",
        definitionTh: "เกี่ยวกับการสอนหรือการศึกษา",
        definitionEn: "relating to teaching and methods of education",
        exampleSentence: "The school introduced new pedagogical methods to foster critical thinking.",
        cefrLevel: "B2",
      },
      {
        word: "authentic",
        partOfSpeech: "adjective",
        phonetic: "/ɔːˈθen.tɪk/",
        definitionTh: "แท้จริง, เป็นของจริงที่ใช้ในชีวิตประจำวัน",
        definitionEn: "real, true, or what someone said it is rather than a copy",
        exampleSentence: "Teachers encourage students to read authentic English news materials.",
        cefrLevel: "B2",
      },
      {
        word: "hesitation",
        partOfSpeech: "noun",
        phonetic: "/ˌhez.ɪˈteɪ.ʃən/",
        definitionTh: "ความลังเล, ความไม่แน่ใจ",
        definitionEn: "the act of pausing before doing something because you are uncertain",
        exampleSentence: "With daily practice, she answered the interview questions without hesitation.",
        cefrLevel: "B2",
      },
      {
        word: "efficacy",
        partOfSpeech: "noun",
        phonetic: "/ˈef.ɪ.kə.si/",
        definitionTh: "ประสิทธิภาพ, ประสิทธิผลในการทำงาน",
        definitionEn: "the ability, especially of a method or tool, to produce the intended result",
        exampleSentence: "Clinical trials proved the efficacy of the new teaching framework.",
        cefrLevel: "C1",
      },
      {
        word: "retention",
        partOfSpeech: "noun",
        phonetic: "/rɪˈten.ʃən/",
        definitionTh: "การรักษาไว้, ความสามารถในการจดจำระยะยาว",
        definitionEn: "the ability to keep or continue having something, especially in memory",
        exampleSentence: "Spaced flashcards significantly boost vocabulary retention over time.",
        cefrLevel: "B2",
      },
      {
        word: "benchmark",
        partOfSpeech: "noun",
        phonetic: "/ˈbentʃ.mɑːk/",
        definitionTh: "เกณฑ์มาตรฐาน, เกณฑ์เปรียบเทียบวัดผล",
        definitionEn: "a standard by which other things can be judged or measured",
        exampleSentence: "Reaching CEFR B2 is an essential benchmark for academic accreditation.",
        cefrLevel: "B2",
      },
      {
        word: "collocation",
        partOfSpeech: "noun",
        phonetic: "/ˌkɒl.əˈkeɪ.ʃən/",
        definitionTh: "กลุ่มคำที่มักจะใช้คู่กันเป็นธรรมชาติ",
        definitionEn: "a word or phrase that is often used with another word",
        exampleSentence: "Learning natural collocations improves speaking fluency noticeably.",
        cefrLevel: "B2",
      },
      {
        word: "transformation",
        partOfSpeech: "noun",
        phonetic: "/ˌtræns.fəˈmeɪ.ʃən/",
        definitionTh: "การเปลี่ยนแปลงรูปแบบหรือสภาวะอย่างสิ้นเชิง",
        definitionEn: "a complete change in the appearance or character of something",
        exampleSentence: "The education system is witnessing a digital transformation.",
        cefrLevel: "B2",
      },
    ],
    comprehensionQuestions: [
      {
        question: "According to the passage, what is the main benefit of interactive reading tools?",
        options: [
          "They replace the need for teachers in classrooms",
          "They allow faster vocabulary acquisition through contextual exposure",
          "They reduce the amount of time students spend studying overall",
          "They eliminate the need for grammar rules completely",
        ],
        correctAnswer: 1,
        explanation: "บทความระบุชัดเจนว่าเครื่องมืออ่านแบบโต้ตอบช่วยให้ผู้เรียนจำคำศัพท์ยากได้เร็วขึ้นผ่านการพบคำในบริบทจริง แทนการท่องจำแบบเดิม",
      },
      {
        question: "How does spaced repetition benefit long-term memory according to cognitive scientists?",
        options: [
          "It increases vocabulary retention by up to eighty percent",
          "It forces students to memorize 500 words per day",
          "It allows students to pass exams without revision",
          "It focuses only on auditory learning",
        ],
        correctAnswer: 0,
        explanation: "ในย่อหน้าที่ 3 ระบุว่าการทบทวนแบบเว้นระยะ (Spaced Repetition) ช่วยเพิ่มการจดจำคำศัพท์ระยะยาวได้สูงถึง 80%",
      },
    ],
    isCached: true,
  },

  technology: {
    id: "sample-demo-technology",
    title: "How Artificial Intelligence and Automation Are Reshaping the Modern Workplace",
    originalTitle: "Workplace Evolution: AI Collaborators and the Need for Reskilling",
    source: "BBC News Technology",
    sourceUrl: "https://www.bbc.com/news/technology",
    category: "technology",
    date: new Date().toISOString().split("T")[0],
    cefrLevel: "B2",
    wordCount: 295,
    content: `The rapid acceleration of artificial intelligence and machine learning is profoundly disrupting traditional employment sectors. Rather than merely rendering human workers obsolete, contemporary technological systems are increasingly acting as collaborative co-pilots that enhance workforce productivity.\n\nIndustry analysts indicate that routine operational tasks, such as data tabulation and clerical correspondence, are becoming automated at an unprecedented rate. Consequently, employees must develop adaptable skill sets focused on critical thinking, creative problem-solving, and emotional intelligence—attributes that algorithms cannot replicate.\n\nMoreover, educational institutions and corporate training programs face an urgent imperative to facilitate digital literacy initiatives. By equipping individuals with foundational programming and data analytics competencies, organizations can cultivate an agile workforce capable of thriving alongside autonomous tools.\n\nUltimately, embracing technological innovation requires a proactive mindset. Professionals who continuously refine their digital expertise will secure lucrative opportunities in the emerging global knowledge economy.`,
    paragraphs: [
      "The rapid acceleration of artificial intelligence and machine learning is profoundly disrupting traditional employment sectors. Rather than merely rendering human workers obsolete, contemporary technological systems are increasingly acting as collaborative co-pilots that enhance workforce productivity.",
      "Industry analysts indicate that routine operational tasks, such as data tabulation and clerical correspondence, are becoming automated at an unprecedented rate. Consequently, employees must develop adaptable skill sets focused on critical thinking, creative problem-solving, and emotional intelligence—attributes that algorithms cannot replicate.",
      "Moreover, educational institutions and corporate training programs face an urgent imperative to facilitate digital literacy initiatives. By equipping individuals with foundational programming and data analytics competencies, organizations can cultivate an agile workforce capable of thriving alongside autonomous tools.",
      "Ultimately, embracing technological innovation requires a proactive mindset. Professionals who continuously refine their digital expertise will secure lucrative opportunities in the emerging global knowledge economy.",
    ],
    keyVocabulary: [
      {
        word: "obsolete",
        partOfSpeech: "adjective",
        phonetic: "/ˌɒb.səlˈiːt/",
        definitionTh: "ล้าสมัย, เลิกใช้แล้ว, ถูกแทนที่",
        definitionEn: "not in use anymore, having been replaced by something newer and better",
        exampleSentence: "Old floppy disks became obsolete when cloud storage emerged.",
        cefrLevel: "B2",
      },
      {
        word: "unprecedented",
        partOfSpeech: "adjective",
        phonetic: "/ʌnˈpres.ɪ.den.tɪd/",
        definitionTh: "ที่ไม่เคยมีมาก่อน, เป็นประวัติการณ์",
        definitionEn: "never having happened or existed in the past",
        exampleSentence: "The tech sector experienced growth at an unprecedented rate.",
        cefrLevel: "B2",
      },
      {
        word: "imperative",
        partOfSpeech: "noun",
        phonetic: "/ɪmˈper.ə.tɪv/",
        definitionTh: "ความจำเป็นเร่งด่วน, ข้อบังคับที่ต้องทำ",
        definitionEn: "an extremely important or urgent thing that cannot be avoided",
        exampleSentence: "Upgrading digital skills is an economic imperative for teachers.",
        cefrLevel: "C1",
      },
      {
        word: "collaborative",
        partOfSpeech: "adjective",
        phonetic: "/kəˈlæb.ər.ə.tɪv/",
        definitionTh: "ที่ทำงานร่วมกัน, ที่ร่วมมือกัน",
        definitionEn: "involving two or more people or systems working together",
        exampleSentence: "AI assistants offer collaborative solutions for classroom activities.",
        cefrLevel: "B2",
      },
      {
        word: "competency",
        partOfSpeech: "noun",
        phonetic: "/ˈkɒm.pɪ.tən.si/",
        definitionTh: "ความสามารถ, สมรรถนะ",
        definitionEn: "an important skill that is needed to do a job properly",
        exampleSentence: "Teachers are assessed on their language competency under the PA system.",
        cefrLevel: "B2",
      },
      {
        word: "lucrative",
        partOfSpeech: "adjective",
        phonetic: "/ˈluː.krə.tɪv/",
        definitionTh: "ที่ให้ผลตอบแทนคุ้มค่า, ได้กำไรดี",
        definitionEn: "producing a lot of money or a profitable advantage",
        exampleSentence: "Technological expertise opens doors to lucrative career advancement.",
        cefrLevel: "C1",
      },
    ],
    comprehensionQuestions: [
      {
        question: "According to the passage, what is the actual role of AI in the workplace?",
        options: [
          "To completely eliminate all human employees",
          "To act as collaborative co-pilots that enhance productivity",
          "To reduce workers' salaries across all industries",
          "To handle only manual physical labor",
        ],
        correctAnswer: 1,
        explanation: "ย่อหน้าที่ 1 ระบุว่า AI ไม่ได้ทำให้คนตกงานเสมอไป แต่ทำหน้าที่เป็น collaborative co-pilots ช่วยเพิ่มผลผลิตในการทำงาน",
      },
      {
        question: "What skills should employees develop that algorithms cannot easily copy?",
        options: [
          "Manual typewriter operation",
          "Basic clerical typing speed",
          "Critical thinking and emotional intelligence",
          "Repetitive data tabulation only",
        ],
        correctAnswer: 2,
        explanation: "ในย่อหน้าที่ 2 ระบุชัดเจนว่าพนักงานต้องเสริมทักษะ critical thinking, creative problem-solving และ emotional intelligence",
      },
    ],
    isCached: true,
  },

  environment: {
    id: "sample-demo-environment",
    title: "Global Reforestation and Sustainable Energy Initiatives Accelerate Biodiversity Recovery",
    originalTitle: "Conservation Milestones: Restoring Ecosystems Through Community Action",
    source: "BBC Science & Environment",
    sourceUrl: "https://www.bbc.com/news/science_and_environment",
    category: "environment",
    date: new Date().toISOString().split("T")[0],
    cefrLevel: "B2",
    wordCount: 288,
    content: `International conservation scientists have reported measurable recoveries in endangered animal populations across multiple restored habitats. Comprehensive satellite surveillance confirms that multi-national reforestation campaigns, combined with renewable energy adoption, are reversing decades of ecological degradation.\n\nEnvironmental researchers highlight that community stewardship is indispensable for preserving fragile ecosystems. When indigenous and local populations participate directly in forest management, illegal logging decreases sharply, allowing wildlife corridors to flourish once again.\n\nIn tandem with forestry preservation, the transition toward solar and wind infrastructure diminishes toxic carbon emissions that threaten aquatic biomes. Cleaner air and purified watershed basins directly bolster agricultural productivity and safeguard potable water reserves.\n\nWhile substantial climate hurdles persist, these positive environmental trajectories substantiate that strategic policy interventions and dedicated grassroots mobilization can successfully revitalize our planet’s natural equilibrium.`,
    paragraphs: [
      "International conservation scientists have reported measurable recoveries in endangered animal populations across multiple restored habitats. Comprehensive satellite surveillance confirms that multi-national reforestation campaigns, combined with renewable energy adoption, are reversing decades of ecological degradation.",
      "Environmental researchers highlight that community stewardship is indispensable for preserving fragile ecosystems. When indigenous and local populations participate directly in forest management, illegal logging decreases sharply, allowing wildlife corridors to flourish once again.",
      "In tandem with forestry preservation, the transition toward solar and wind infrastructure diminishes toxic carbon emissions that threaten aquatic biomes. Cleaner air and purified watershed basins directly bolster agricultural productivity and safeguard potable water reserves.",
      "While substantial climate hurdles persist, these positive environmental trajectories substantiate that strategic policy interventions and dedicated grassroots mobilization can successfully revitalize our planet’s natural equilibrium.",
    ],
    keyVocabulary: [
      {
        word: "reforestation",
        partOfSpeech: "noun",
        phonetic: "/ˌriː.fɒr.ɪˈsteɪ.ʃən/",
        definitionTh: "การปลูกป่าทดแทน, การฟื้นฟูป่าไม้",
        definitionEn: "the act of planting trees on an area of land that used to be a forest",
        exampleSentence: "Reforestation projects help absorb significant volumes of carbon dioxide.",
        cefrLevel: "B2",
      },
      {
        word: "degradation",
        partOfSpeech: "noun",
        phonetic: "/ˌdeɡ.rəˈdeɪ.ʃən/",
        definitionTh: "ความเสื่อมโทรม, การลดทอนคุณภาพ",
        definitionEn: "the process in which the quality of something is destroyed or made worse",
        exampleSentence: "Soil degradation poses a severe threat to sustainable food production.",
        cefrLevel: "B2",
      },
      {
        word: "indispensable",
        partOfSpeech: "adjective",
        phonetic: "/ˌɪn.dɪˈspen.sə.bəl/",
        definitionTh: "จำเป็นอย่างยิ่ง, ขาดไม่ได้เด็ดขาด",
        definitionEn: "something so good or important that you could not manage without it",
        exampleSentence: "Community cooperation is indispensable for successful conservation.",
        cefrLevel: "C1",
      },
      {
        word: "stewardship",
        partOfSpeech: "noun",
        phonetic: "/ˈstjuː.əd.ʃɪp/",
        definitionTh: "การดูแลรักษา, การพิทักษ์จัดการทรัพยากร",
        definitionEn: "the responsible overseeing and protection of something considered worth caring for",
        exampleSentence: "Environmental stewardship ensures natural resources remain for future generations.",
        cefrLevel: "C1",
      },
      {
        word: "substantiate",
        partOfSpeech: "verb",
        phonetic: "/səbˈstæn.ʃi.eɪt/",
        definitionTh: "พิสูจน์ให้เห็นจริง, มีหลักฐานยืนยันชัดเจน",
        definitionEn: "to show something to be true, or to support a claim with facts",
        exampleSentence: "Satellite images substantiate that endangered species are returning.",
        cefrLevel: "C1",
      },
      {
        word: "equilibrium",
        partOfSpeech: "noun",
        phonetic: "/ˌek.wɪˈlɪb.ri.əm/",
        definitionTh: "ความสมดุล, ภาวะสมดุลตามธรรมชาติ",
        definitionEn: "a state of balance between different forces or influences",
        exampleSentence: "Human activities frequently disrupt the natural ecological equilibrium.",
        cefrLevel: "B2",
      },
    ],
    comprehensionQuestions: [
      {
        question: "Why is community participation critical to ecosystem restoration?",
        options: [
          "It lowers the wages needed for international scientists",
          "It causes illegal logging to drop significantly and restores wildlife corridors",
          "It forces local people to abandon their agricultural land",
          "It replaces satellite surveillance technology",
        ],
        correctAnswer: 1,
        explanation: "ย่อหน้าที่ 2 ระบุว่าเมื่อชุมชนท้องถิ่นมีส่วนร่วม การลักลอบตัดไม้ทำลายป่าลดลงอย่างเห็นได้ชัด และเส้นทางสัตว์ป่าได้รับการฟื้นฟู",
      },
      {
        question: "How does the shift to solar and wind energy benefit aquatic biomes?",
        options: [
          "By reducing toxic carbon emissions that poison water and air",
          "By increasing the temperature of rivers",
          "By preventing fish from migrating",
          "By using all the available water for power generation",
        ],
        correctAnswer: 0,
        explanation: "ในย่อหน้าที่ 3 อธิบายว่าพลังงานสะอาดช่วยลดการปล่อยคาร์บอนที่เป็นพิษต่อระบบนิเวศทางน้ำ (aquatic biomes)",
      },
    ],
    isCached: true,
  },
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
