# Ticket 003: Gemini API and News Ingestion Pipeline [DONE]

## Description
Create the service layer that fetches real English RSS news feeds and uses the Gemini API to adapt articles to CEFR B1–B2 levels with extracted key vocabulary.

## Blockers
- 001-project-scaffold-and-pwa.md

## Acceptance Criteria
- [x] RSS parser service fetching articles from reliable feeds (BBC, Reuters, or similar English education/tech/nature feeds).
- [x] Gemini API integration (`gemini-2.5-flash` or `gemini-1.5-flash`) via server endpoint.
- [x] Prompt engineering to rewrite articles into 250–350 words at CEFR B1–B2 level with 5–8 key vocabulary definitions and usage examples.
- [x] Daily caching mechanism to avoid redundant API calls within the same day.
