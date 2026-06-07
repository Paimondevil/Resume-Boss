# Resume Boss ✦

**AI-powered resume tailoring engine. Paste a job description → get a precision-tailored, ATS-optimized LaTeX resume in seconds.**

🔗 **Live:** [bossresume.vercel.app](https://bossresume.vercel.app)

---

## What It Does

Most resume tailoring tools rewrite your entire resume or fabricate skills you don't have. Resume Boss works differently — it keeps your real experience locked in place and only tailors the parts that should change: the skill ordering, the freelance bullets, and the keyword density.

Paste any job description and the app:

- Rewrites the **Freelance / current role bullets** to surface JD-relevant keywords naturally
- **Reorders the skills section** by JD priority without removing or fabricating anything
- **Selects the best 2 projects** from a curated pool based on JD keyword overlap
- **Scores the resume** against the JD using a 3-tier keyword system (Required / Nice-to-have / Context)
- **Generates a cover letter** with a fixed professional structure and AI-written body paragraphs
- Shows a **before/after diff** highlighting every change made
- Outputs a **copy-ready LaTeX file** you can paste directly into Overleaf

---

## Features

### ATS Scoring Engine
- Extracts 20–40 keywords from the JD, classified into 3 tiers
- Tier 1 (Required), Tier 2 (Nice-to-have), Tier 3 (Context/Implied)
- Synonym matching so "ML" counts for "Machine Learning"
- Animated score ring with per-tier progress bars
- Scores within 10–15% of industry tools like Jobscan

### Hardcoded Safety Layer
- Work experience bullets at Siemens and Solartis are **permanently locked** — real metrics, never touched by AI
- A second AI call classifies any newly added skills as **SAFE** or **VERIFY** — flags anything you can't defend in an interview
- AI cannot remove skills from your original list, only reorder them

### Cover Letter Generator
- Fixed professional header and closing (your name, contact, date)
- AI writes the body paragraphs only — 3 focused paragraphs + bullet highlights
- Prompt explicitly bans em-dashes and AI writing tells

### UI
- Deep space / galaxy theme with an animated particle canvas (220 particles, mouse repulsion, shooting stars)
- 2 hand-drawn mini spiral galaxies + 3 planets rendered on canvas
- Neural-network connection lines between nearby particles
- 3D card tilt effect following your mouse
- Scan-line animation scoped to the LaTeX output panel only
- Side-by-side layout: ATS score on the left, LaTeX code on the right

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite 6 |
| AI | Groq API — `llama-3.3-70b-versatile` |
| Styling | CSS (custom, no framework) |
| Fonts | Syne (title), Outfit (UI), JetBrains Mono (code) |
| Deployment | Vercel |
| Resume format | LaTeX (Jake Gutierrez template) |

---

## How It Works

```
JD paste
   │
   ▼
Sanitize input (strip Unicode, smart quotes, em-dashes)
   │
   ▼
Local keyword scoring → select top 2 projects from pool
   │
   ▼
Groq API call #1 — Main tailoring
   Returns: tier-classified keywords, 2 freelance bullets, reordered skills
   │
   ▼
Groq API call #2 — Skill safety check
   Classifies any new skills as SAFE or VERIFY
   │
   ▼
Fill hardcoded LaTeX template with AI output
   (Siemens + Solartis bullets are injected unchanged)
   │
   ▼
Score resume against extracted keywords
   │
   ▼
Output: LaTeX code + ATS score + diff + cover letter
```

---

## Local Setup

```bash
# Clone
git clone https://github.com/Paimondevil/Resume-Boss.git
cd Resume-Boss

# Install
npm install

# Add your Groq API key
# Create a .env file in the root:
echo "VITE_GROQ_API_KEY=your_key_here" > .env

# Run
npm run dev
```

Get a free Groq API key at [console.groq.com](https://console.groq.com).

> **Note:** The free tier has a 100k token/day limit. Each resume tailoring run uses roughly 2,000–3,500 tokens.

---

## Project Structure

```
src/
├── components/
│   ├── JDInput.jsx          # Main logic: API calls, template filling, scoring
│   ├── TailoredOutput.jsx   # Side-by-side score + LaTeX output layout
│   ├── ScoreRing.jsx        # Animated canvas ATS score ring
│   ├── ParticleField.jsx    # Galaxy/space background canvas
│   ├── CoverLetter.jsx      # Cover letter generator + renderer
│   └── DiffViewer.jsx       # Before/after diff with highlights
├── App.jsx                  # App shell + 3D tilt effect
└── index.css                # Full custom CSS
```

---

## Design Decisions

**Why LaTeX?** ATS systems parse LaTeX-generated PDFs cleanly. The Jake Gutierrez template is one of the most ATS-friendly formats available.

**Why lock the work experience bullets?** The Siemens and Solartis bullets contain real, verified metrics (throughput numbers, percentage improvements, revenue figures). Letting AI rewrite them risks producing numbers that can't be defended in an interview.

**Why not just use GPT-4?** Groq's inference speed on llama-3.3-70b is dramatically faster for this use case. The entire tailoring pipeline (2 API calls) completes in under 8 seconds on average.

**Why a local scoring engine instead of just asking the AI to score?** AI-generated ATS scores are inconsistent and tend to be inflated. A deterministic local scorer gives reproducible, honest results.

---

## Known Limitations

- Jobscan may score slightly higher because it rewards a summary section, address line, and higher word count — none of which fit the one-page constraint
- The Groq free tier occasionally rate-limits at peak times; a retry usually resolves it
- LaTeX output needs Overleaf or a local TeX distribution to render to PDF

---

## Author

**Devesh Gautam** — [deveshfolio.vercel.app](https://deveshfolio.vercel.app) · [LinkedIn](https://linkedin.com/in/29deveshgautam)

Master of Applied Computer Science, St. Francis Xavier University