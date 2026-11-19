# VeriPulse: Real-Time Fact-Verification & Deepfake Audit Engine

[![Hackathon: IDEA//FORGE Online](https://img.shields.io/badge/Hackathon-IDEA%2F%2FFORGE%20Online-10b981.svg)](https://challazo.com)
[![Track 1: Civic Pulse & Digital Governance](https://img.shields.io/badge/Track%201-Civic%20Pulse%20%26%20Digital%20Governance-38bdf8.svg)](https://challazo.com)
[![Status: MVP v1.0](https://img.shields.io/badge/Status-MVP%20v1.0-emerald.svg)](specs.md)

VeriPulse is a real-time, multimodal fact-checking and deepfake forensics engine engineered for high-velocity civic information integrity. It unifies claim extraction, live web search grounding, acoustic & visual synthesis detection, file metadata analysis (EXIF/C2PA), and narrative origin tracking into a unified **Trust & Provenance Report**.

---

## 🌟 Key Features

1. **Pillar 1: Claim Extraction & Real-Time Grounding:** Decomposes inputs into discrete factual assertions and cross-references authoritative registries (PIB Fact Check, RBI, official gazettes) with Google Search Grounding.
2. **Pillar 2: Multimodal Deepfake Forensics:** Inspects facial boundary blending, eye/teeth symmetry, lip-sync drift, and acoustic vocoder phasing.
3. **Pillar 3: Metadata & C2PA Inspection:** Identifies camera parameters, AI generator signatures (`Adobe Firefly`, `ElevenLabs`, `Midjourney`), and flags WhatsApp/Telegram re-compression.
4. **Pillar 4: Origin & Narrative Spread Timeline:** Traces narrative mutations from first appearance to viral spread.
5. **Authenticity Score & Verdict Tiers:**
   - `VERIFIED / AUTHENTIC` (80–100)
   - `NEEDS CONTEXT / INCONCLUSIVE` (50–79)
   - `MISLEADING / ALTERED` (25–49)
   - `FALSE / LIKELY DEEPFAKE` (0–24)
6. **One-Click Preloaded Judge Samples:** Instant simulation of 4 realistic scenarios:
   - *Fake Govt Scheme Forward (UPI 2% Tax Rumor)*
   - *AI-Cloned Official Voice Note (Election Postponement)*
   - *Out-of-Context Flood Video (Recycled 2019 Footage)*
   - *Verified ISRO Announcement (Chandrayaan-4)*

---

## 🛠️ Tech Stack & Third-Party Attribution

* **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
* **Backend:** Node.js, Express, Multer, `exifr`, `fluent-ffmpeg` / `ffprobe`
* **AI & Search Grounding:** **Google Gemini 2.5 Flash** with **Google Search Grounding**
* **Database:** MongoDB Atlas

### Required Attribution (for Challazo Submission)
- **Google Gemini (`gemini-2.5-flash`) & Google Search Grounding** for multimodal media forensics and live web fact verification.
- **`exifr` & `FFmpeg/ffprobe`** for open-source file metadata and stream header extraction.

---

## 🚀 Getting Started

### 1. Frontend Development
```bash
cd client
npm install
npm run dev
```

### 2. Frontend Production Build
```bash
cd client
npm run build
```

---

## 📄 License & Specification
Refer to [`specs.md`](specs.md) for full architecture, scoring formulas, and execution roadmap.

