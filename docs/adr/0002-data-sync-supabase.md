# 0002-data-sync-supabase

We decided to use **Supabase (PostgreSQL free tier)** for cloud persistence and cross-device synchronization.

Because the user operates across iOS (iPhone, iPad Safari) and desktop environments, local browser storage alone cannot maintain a unified Vocabulary Bank or long-term 1-year study streak. Supabase provides free-tier hosted PostgreSQL with clean REST/client SDK access, enabling seamless cross-device synchronization without the overhead of maintaining custom database servers.
