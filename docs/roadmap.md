Proposed Plan
Phase 1 — Fix the Foundation
Connect Prisma to the actual DB (run migrations)
Replace in-memory service with real Prisma queries
Add missing CRUD endpoints (GET one, PUT, DELETE)
Phase 2 — Data & Content
Define your real projects in projects_to_put.md → seed the DB
Add a BlogPost and ContactMessage model to the schema
Phase 3 — Auth + Admin
JWT auth (single admin user, no registration needed)
Protected POST/PUT/DELETE routes
Simple admin panel to manage projects
Phase 4 — AI Feature
Decide what the AI does — project recommender? chat assistant? auto-generate project descriptions?
Phase 5 — Wire Frontend
Replace hardcoded frontend data with API calls
