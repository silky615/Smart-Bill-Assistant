# Smart Bill Assistant

AI-powered system that translates complex telecom bills into clear, actionable insights in real time.

## Overview
Smart Bill Assistant helps users instantly understand their bills by breaking down charges, explaining changes, and suggesting ways to reduce costs. 

Instead of calling customer support, users can simply paste or speak their bill and receive a clear explanation within seconds.

## Key Features
-  **Simple Bill Summary** — Converts complex billing data into 3 easy bullet points  
-  **Reason for Changes** — Explains why the bill increased or decreased  
-  **Cost Optimization Suggestions** — Recommends ways to save money  
-  **Intent Detection** — Classifies user queries (billing, support, etc.)  
-  **Voice Interaction (Optional)** — Ask questions using voice and hear responses  

---

## Tech Stack

### AI / Language Models
- **Groq API** — Ultra-fast inference
- **Llama-3.3-70b-versatile** — Main bill analysis + response generation
- **Llama-3.1-8b-instant** — Intent detection + lightweight tasks

### Backend
- **Node.js** + **Express** (REST API)
  - Examples: `/api/auth/login`, `/api/me`, `/api/chat`, `/api/bill-summary`, `/api/payments/pay`, `/api/bills/raw`

### Frontend
- **Vite** + **React** + **TypeScript**
- **React Router**; dev server proxies `/api` to the backend

### Running locally
- Backend: `cd backend && npm install && npm start` (default port **3001**)
- Frontend: `cd frontend && npm install && npm run dev` (default **5173**)

### Repository history
- Earlier commits used a Python/Flask sketch; the current app is the Node/React stack above. Git history preserves those commits.



