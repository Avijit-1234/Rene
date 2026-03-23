# Rene: AI Knowledge Graph Architect 🧠⚡

**Rene** is a lightweight, high-performance knowledge mapping engine. It transforms any complex topic into an interactive, "Obsidian-style" 2D physics graph with integrated short notes, bullet points, and LaTeX math rendering.

<img width="1920" height="1048" alt="Screenshot_2026-03-23_08-09-30" src="https://github.com/user-attachments/assets/02d301f9-e949-41b4-933b-2578c3d0bfb7" />

Created as a specialized "Deep Work" sandbox to provide instant, structured clarity for students (JEE, NEET, UPSC).

## 🚀 The Stack
* **Brain:** Groq Llama 3.3 70B (High-speed inference)
* **Backend:** FastAPI + SQLite (Smart caching layer)
* **Visuals:** Force-Graph.js (Physics engine) + Tailwind CSS (Glassmorphism UI)
* **Math:** KaTeX (High-speed LaTeX rendering)

---

## 🛠️ Rapid Setup

### **1. Clone & Install (One-Liner)**

**For Mac / Linux (Terminal):**
```bash
git clone https://github.com/Avijit-1234/Rene.git && cd Rene && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt
```

**For Windows (PowerShell):**
```powershell
git clone https://github.com/Avijit-1234/Rene.git; cd Rene; python -m venv .venv; .\.venv\Scripts\Activate.ps1; pip install -r requirements.txt
```

### **2. Configure Secrets**
Copy the example environment file and add your Groq API key:
```bash
cp .env.example .env
```
*Open `.env` and paste your key:* `GROQ_API_KEY=gsk_your_key_here`

### **3. Ignite**
**CRITICAL:** You must run this command from the root `Rene` directory, *not* inside the `backend` or `frontend` folders. 

Ensure your virtual environment is active, then run the backend server using the explicit Python module path:

```bash
# 1. Ensure you are in the root project folder
cd Rene
# 2. Ignite the engine
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8001 --reload
---

## 🎨 Features
* **Dynamic Web Density:** Control the graph complexity (5 to 15 nodes) via a real-time slider.
* **Interconnected Logic:** Unlike standard AI mindmaps, Rene builds a true web where sub-topics link to each other, not just the center.
* **Smart Math Detection:** Automatically renders fundamental formulas in LaTeX for STEM topics, while switching to historical bullet points for humanities.
* **Persistent Cache:** SQLite database ensures you never waste API tokens on the same topic twice.

---

## 📂 Project Structure
```text
.
├── backend/
│   ├── main.py        # FastAPI Server
│   ├── llm.py         # Groq Integration
│   ├── database.py    # SQLite Caching
│   └── prompts.py     # Prompt Library (Modular)
├── frontend/
│   ├── index.html     # Glassmorphism UI
│   ├── script.js      # Force-Graph & Logic
│   └── style.css      # Custom Animations
└── .env               # (Hidden) API Keys
```
