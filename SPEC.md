# Specification: English CEFR Prep & Daily Reader

## 1. Executive Summary

A cross-device web application (Next.js + PWA) designed for Thai educators to cultivate English proficiency from CEFR B1 towards B2/C1 over a 1-year learning journey. The app merges daily AI-curated news reading with targeted practice modules for the EduSynch CEFR Level Test, qualifying teachers for reduced academic evaluation periods (ว.PA reduction from 4 to 3 years).

## 2. Target Users & Deployment
* **Primary User:** Thai educators preparing for EduSynch CEFR (Target: B2 for general subjects, C1 for English teachers).
* **Target Platforms:** iOS Safari (iPhone & iPad via PWA "Add to Home Screen"), macOS, and Windows.
* **Hosting:** Vercel (Free tier, automatic HTTPS, Serverless Edge runtime).
* **Database & Persistence:** Supabase PostgreSQL (Free tier) with local storage fallback for cross-device synchronization.

## 3. Core Modules & Feature Specifications

### 3.1 App Shell & Navigation
* **Sidebar Layout:** Extensible left sidebar with icons and badge indicators.
  * Desktop / iPad: Persistent collapsible sidebar.
  * Mobile (iPhone): Slide-over drawer with bottom-friendly triggers.
* **Navigation Links:**
  * 📰 **Daily Reading:** Today's curated news and interactive reader.
  * 📚 **Vocabulary Bank:** Saved words, definitions, and Spaced Repetition review.
  * ✍️ **Writing Sandbox:** 20-minute timed essay simulation with Gemini AI grading.
  * 📖 **Reading Practice:** Timed comprehension tests with CEFR scoring.
  * ⚙️ **Settings & Preferences:** API key configuration, topic preferences, CEFR target.

### 3.2 Daily Article & Interactive Reader
* **Content Ingestion & Adaptation:**
  * Fetches clean RSS feeds from reputable English outlets (Education, Technology/Science, Environment).
  * Prompts Gemini (`gemini-1.5-flash` or `gemini-2.0-flash`) to rewrite selected articles into CEFR B1–B2 levels (approx. 250–350 words).
  * Automatically extracts 5–8 key target vocabulary items with Thai definitions, part of speech, and contextual usage.
  * **Daily Cache:** Stores today's article in the database so repeated reads throughout the day consume zero additional API quota.
* **Interactive Tokenized Reader:**
  * Article body rendered as selectable words/tokens.
  * Tapping any word opens an instant tooltip displaying:
    * Phonetic pronunciation / audio snippet.
    * Thai translation and English definition.
    * One-click "Add to Vocabulary Bank" button.
* **Text-to-Speech (Audio):**
  * Integrated Web Speech API synthesis button (Play / Pause / Stop).
  * Speed controls: 0.8x, 1.0x, 1.2x for listening comprehension and pronunciation modeling.
  * Highlighting current sentence during playback.

### 3.3 Vocabulary Bank & Spaced Repetition Review (SRS)
* **Word Management:**
  * Stores: Word, Part of Speech, Definition (TH/EN), Example Sentence, CEFR Level, Date Added, Next Review Date, Review Stage (1–5).
* **SRS Flashcard Mode:**
  * Leitner box / interval algorithm (1 day, 3 days, 7 days, 14 days, 30 days).
  * Card flip animation showing definition, audio pronunciation, and example sentence.
  * Rating buttons: "Again" (resets to stage 1), "Good" (advances to next interval), "Mastered".

### 3.4 EduSynch Writing Sandbox
* **Simulation Mechanics:**
  * Prompt generation: Topic questions reflecting real EduSynch writing themes (social issues, technology, education, personal viewpoint).
  * 20-minute countdown timer with visual progress bar.
  * Real-time word counter with clear color indicators (Red: < 150 words, Green: >= 150 words).
* **AI Evaluation (Gemini):**
  * Evaluates against CEFR rubrics: Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy.
  * Outputs:
    * Estimated CEFR Score (A2, B1, B2, C1, C2).
    * Specific grammar corrections with inline explanations.
    * Vocabulary upgrade suggestions (e.g., replace "very good" with "exceptional").
    * A polished model version of the essay for review.

### 3.5 Reading Practice Module
* **Timed Comprehension:**
  * Passages (300–450 words) at B1/B2 levels with 3–5 multiple-choice questions.
  * 8–10 minute per passage countdown timer.
  * Instant scoring, answer explanations, and one-click vocab saving from the passage.

### 3.6 Settings & Cross-Device Sync
* **Sync Configuration:**
  * Optional Supabase project URL & Anon Key for cloud syncing across iPhone, iPad, and PC.
  * Graceful fallback to browser `localStorage` if cloud credentials are not yet entered.
* **API Configuration:**
  * Uses server environment variable `GEMINI_API_KEY` by default.
  * Allows user override in settings UI for personal API keys.
* **Topic Selection:** Checkboxes to select favorite topics (Education, Technology, Science, Nature, Culture).

## 4. Technical Architecture

* **Framework:** Next.js (App Router, React 19, TypeScript)
* **Styling:** Tailwind CSS + Radix UI / Lucide React icons
* **State & Data Layer:** React hooks with Supabase JS client and `localStorage` fallback wrapper
* **PWA:** Web App Manifest (`manifest.json`), Apple mobile web app meta tags, service worker for caching
* **AI Integration:** Google GenAI SDK (`@google/genai` or `@google/generative-ai`) via Next.js Server Actions / API Routes

## 5. Development Milestones

1. **Milestone 1 - Project Scaffold & UI Shell:** Next.js project setup with Tailwind, responsive sidebar navigation, and PWA configuration.
2. **Milestone 2 - Interactive Reader & Daily Article Engine:** RSS ingestion, Gemini rewriting pipeline, tokenized reader with Web Speech audio and word lookup.
3. **Milestone 3 - Vocabulary Bank & SRS Review:** Word persistence (Supabase + LocalStorage) and flashcard review interface.
4. **Milestone 4 - Writing Sandbox:** 20-minute timer, >=150 words validation, and Gemini CEFR grading system.
5. **Milestone 5 - Polish & Deployment Guide:** Cross-device verification, iOS Safari optimizations, and Vercel deployment setup.
