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
- **Python**
- **Flask (REST API)**
  - `/analyze` → Bill explanation
  - `/chat` → Conversational queries

### Frontend
- **HTML + CSS + JavaScript (Vanilla)**
- **Fetch API** for backend communication

### Infrastructure
- **IBM LinuxONE (Ubuntu VM - s390x)**
- **SSH Tunneling** for local access
- No Docker (kept simple for speed)



