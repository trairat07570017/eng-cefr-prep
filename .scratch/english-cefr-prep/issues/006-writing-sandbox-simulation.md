# Ticket 006: EduSynch Writing Sandbox Simulation [DONE]

## Description
Build the timed Writing Sandbox simulation with a 20-minute timer, >= 150-word threshold indicator, and Gemini CEFR rubric grading.

## Blockers
- 002-app-shell-and-sidebar.md
- 003-gemini-news-pipeline.md

## Acceptance Criteria
- [x] EduSynch-style writing prompt display with topic category and requirements.
- [x] 20-minute countdown timer with auto-submit or warning.
- [x] Real-time word counter with color status (Red < 150 words, Green >= 150 words).
- [x] Evaluation service using Gemini:
  - CEFR score estimation (A2, B1, B2, C1).
  - Breakdown: Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Accuracy.
  - Concrete grammar corrections with explanations.
  - Advanced vocabulary suggestions (replacements for simple words).
  - Model essay reference.
