# English CEFR Prep & Daily Reader

A web application designed for Thai educators to build English proficiency (CEFR B2/C1) over a 1-year journey, combining daily AI-curated news reading with targeted practice for the EduSynch CEFR examination to qualify for teaching accreditation fast-tracking.

## Language

**Daily Article**:
A short, curated English news article delivered daily, adapted to the learner's target CEFR proficiency level (B1/B2) with embedded vocabulary explanations.
_Avoid_: Daily news, post, story

**Article Rewriter**:
A service component leveraging the Gemini API to adapt raw RSS news feeds into CEFR B1–B2 graded articles and extract key vocabulary.
_Avoid_: News summarizer, translator

**Interactive Reader**:
An article viewer that enables word-level selection to instantly inspect context-aware definitions, trigger text-to-speech audio, and save target words directly to the user's Vocabulary Bank.
_Avoid_: Text viewer, reader mode

**Vocabulary Bank**:
A personalized, persistent collection of vocabulary extracted from articles and practice sessions, synced across devices for spaced repetition and mastery.
_Avoid_: Word list, flashcards, dictionary

**Spaced Repetition Review**:
A review module using interval-based scheduling to reinforce vocabulary retention over the 1-year study timeframe.
_Avoid_: Flashcard quiz, memory test

**EduSynch Simulation**:
A structured practice test module replicating the official EduSynch CEFR Level Test environment across the 4 skills (Reading, Listening, Speaking, Writing).
_Avoid_: Quiz, mock test

**Writing Sandbox**:
A timed essay practice module (20-minute countdown, >=150 words threshold) offering automated CEFR scoring and grammar improvement feedback via Gemini.
_Avoid_: Essay editor, writing test

**Reading Practice**:
A timed comprehension exercise module featuring graded texts and CEFR-aligned multiple-choice questions.
_Avoid_: Reading quiz, reading comprehension test

**User Preference Profile**:
The user's configuration specifying preferred news topics, target CEFR tier (B2 vs C1), and API credentials.
_Avoid_: User settings, config
