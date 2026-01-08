Mini FinTech Wallet: Transactions & Dashboard
Candidate Assignment (Frontend + Backend or Frontend + Mock
API)
Objective
Assess the candidate’s ability to design and build a small fintech-themed web
application that demonstrates API integration, state management, business logic,
UI/UX, error handling, documentation, and testing—within 4–5
working days
Problem Statement
Build a Mini Wallet Application where users can: (1) View wallet balance and
transaction history, (2) Add money to wallet, (3) Transfer money to another user, (4)
Apply simple business rules (fee and limit), (5) See transaction status, and (6)
Experience graceful error handling and clear UI states.
Scope & Suggested Tech Stack Frontend: React (Hooks) or Angular. State via
useState/useEffect or Angular services; optional React Query/Redux Toolkit or NgRx.
Backend: Option A – Mock API using json-server; Option B – Simple Node.js
(Express/NestJS) or Java (Spring Boot) service. Storage: Local state or JSON file; optional
SQLite/Postgres if comfortable. Tooling: Fetch/Axios, Docker (optional).
Functional Requirements (MVP)
• Dashboard: Show wallet balance; show last 10 transactions; include loading
and empty states.
• Add Money: Form with amount (required, numeric). Update balance locally after
API call; record a "credit" transaction.
• Transfer Money: Form with recipient and amount. Apply fee (default 2%) and
enforce per-transaction limit (e.g., 10,000). Confirmation modal before submit;
record a "debit" transaction and fee line if modeled.
• Transaction History: List with filters (date range, status success/failed). Ability
to delete a transaction (soft delete acceptable).
• Error Handling & UX: Toasts or inline messages for errors; global error boundary;
consistent loading skeletons.
API Requirements (Fake/Mock)
Use a Fake API (e.g., jsonplaceholder.typicode.com) or mock your own with json-server.
Minimum endpoints: GET /users, GET /transactions, POST /transactions (create), PATCH
/transactions/:id (update status), DELETE /transactions/:id (delete). You may store
balance locally or derive it from transaction sums (credits – debits – fees).
Business Rules
• Fee: default 2% of amount (configurable via a JSON config).
• Limit: maximum per-transaction amount 10,000 (configurable).
• Status: initial status "pending"; on success set to "success"; on failure set to
"failed" with reason.
Mandatory UI States
• Loading indicators during API calls.
• Error messages with actionable guidance.
• Empty state visuals when no transactions exist.
Non-Functional Expectations
• Security hygiene: input validation, avoid unsafe innerHTML, no secrets in repo.
• Code quality: clean structure, modular components/services, linting.
• Performance: pagination on large lists; memoization where relevant.
• Documentation: clear README; setup steps; assumptions; known limitations.
• Testing: at least 8–10 unit/component tests; one integration test for a critical
flow.
Suggested 4–5 Day Timeline
• Day 1: Project setup, mock API/json-server, base layout & routing.
• Day 2: Dashboard + Add Money flow; balance update & transaction recording.
• Day 3: Transfer Money + fee & limit logic; confirmation modal; error handling.
• Day 4: Transaction History + filters; delete; polish error and loading states.
• Day 5: Tests, accessibility pass, README, final polish (bonus: dark mode,
optimistic UI).
Submission Guidelines
• Deliver as a GitHub repository or ZIP.
• Include README.md with: setup/run/test steps, architectural notes,
assumptions, and limitations.
• Provide mock API data (db.json or seeds) and any config files.
• Include screenshots or a short (≤3 min) video of the main flows.
• Ensure tests can be run via a single command (e.g., npm test)