# Ticket 005: Vocabulary Bank and Spaced Repetition (SRS) Review

## Description
Build the Vocabulary Bank management view and the Spaced Repetition Review flashcard system with persistent storage (Supabase + LocalStorage fallback).

## Blockers
- 002-app-shell-and-sidebar.md
- 004-interactive-reader-and-audio.md

## Acceptance Criteria
- [ ] Word repository displaying saved words, CEFR levels, definitions, and review stage.
- [ ] Spaced Repetition Review (SRS) interface with Leitner flashcard mechanics (Again, Good, Mastered).
- [ ] Automatic scheduling of next review date based on stage (1d, 3d, 7d, 14d, 30d).
- [ ] Storage layer supporting both Supabase PostgreSQL sync and browser local storage fallback.
