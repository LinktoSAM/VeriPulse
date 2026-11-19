# SPEC.md — VeriPulse: Real-Time Fact-Verification & Deepfake Audit Engine

**Hackathon:** IDEA//FORGE Online Hackathon (Challazo)  
**Track:** Track 1 — Civic Pulse, Digital Governance & Public Information  
**Submission Window:** 20 November, 6:00 PM IST – 22 November, 11:59 PM IST  
**Status:** MVP Specification v1.0  

---

## 1. Executive Summary & Problem Statement

### 1.1 Target Audience (Who Faces the Problem)
* **Everyday Messaging-App Users (WhatsApp, Telegram, X/Instagram):** Citizens who receive forwarded political rumors, fabricated government scheme announcements, out-of-context disaster clips, or AI-cloned voice notes and lack fast, accessible tools to verify authenticity before forwarding.
* **Citizen Journalists & Community Moderators:** Local group admins and independent reporters who need rapid, evidence-backed provenance checks to prevent panic and misinformation within local communities.

### 1.2 Why It Matters
Viral misinformation and synthetic media erode public trust, distort civic decision-making, and trigger real-world harm—particularly when doctored videos or cloned audio impersonate public officials or fabricate emergency alerts. Existing fact-checking is slow and manual, while standalone deepfake detectors ignore factual context. **VeriPulse** unifies live claim verification, multimodal deepfake forensics, file metadata auditing, and origin tracing into a single real-time pipeline.

### 1.3 Core Value Proposition
Users submit any suspicious text claim, URL, image, audio clip, or short video and receive a shareable **Trust & Provenance Report** containing:
1. An **Authenticity Score** ($0 \le S \le 100$) and clear verdict badge.
2. **Grounded Fact-Check Citations** linked directly to credible news and official sources.
3. **Multimodal Forensic Flags** highlighting visual or acoustic synthesis artifacts.
4. **Metadata & Content Credentials Inspection** (EXIF, encoder signatures, C2PA markers).
5. A chronological **Origin & Spread Timeline** tracing where the claim or media first surfaced.

---

## 2. System Architecture & Data Flow

```text
+-------------------------------------------------------------------------+
|                        FRONTEND (React + Vite + Tailwind)               |
|  [Audit Input Hub]   [Pipeline Progress Stepper]   [Trust Report View]  |
+------------------------------------+------------------------------------+
                                     | HTTPS / REST (JSON & Multipart)
                                     v
+-------------------------------------------------------------------------+
|                    BACKEND API (Node.js + Express / FastAPI)            |
|  - File Validation & Temp Storage (Max 25 MB; JPG/PNG/WEBP/MP3/WAV/MP4) |
|  - Orchestrator Service (Runs Audit Pillars concurrently)               |
+--------+---------------------------+---------------------------+--------+
         |                           |                           |
         v                           v                           v
+------------------+     +-----------------------+     +------------------+
| Pillar 3:        |     | Pillar 2:             |     | Pillars 1 & 4:   |
| Metadata Parser  |     | Multimodal Forensics  |     | Fact-Check &     |
| (exifr/ffprobe)  |     | (Gemini 2.5 Flash)    |     | Origin Timeline  |
| - EXIF / XMP     |     | - Lip-sync & edges    |     | (Gemini 2.5 Flash|
| - AI Tags / C2PA |     | - Acoustic artifacts  |     |  + Google Search |
| - Strip check    |     | - Context OCR/ASR     |     |  Grounding)      |
+--------+---------+     +-----------+-----------+     +--------+---------+
         |                           |                          |
         +---------------------------+--------------------------+
                                     |
                                     v
                  +-------------------------------------+
                  |      SCORING & SYNTHESIS ENGINE     |
                  |  Computes weighted score & verdict  |
                  +------------------+------------------+
                                     |
                                     v
                  +-------------------------------------+
                  |      MONGODB ATLAS (Persistence)    |
                  |  Stores AuditReport (/audit/:id)    |
                  +-------------------------------------+
```

---

## 3. Core Functional Modules (The 4 Audit Pillars)

### Pillar 1: Claim Extraction & Real-Time Fact-Verification
* **Input:** Raw text, article URL, or text/speech extracted from uploaded images, audio, and video.
* **Process:**
  1. Decomposes the input into discrete, verifiable factual claims (who, what, when, where, statistical figures, official policy claims).
  2. Queries **Gemini (`gemini-2.5-flash`) with Google Search Grounding** enabled to cross-reference each claim against reputable news outlets, official government portals, and established fact-checking databases.
* **Output:** Per-claim status (`VERIFIED`, `MISLEADING`, `FALSE`, `UNVERIFIED`), concise explanation, and clickable inline source citations (`title`, `url`, `domain`).

### Pillar 2: Multimodal Deepfake & Synthetic Media Forensics
* **Input:** Uploaded Image (`JPG`, `PNG`, `WEBP`), Audio (`MP3`, `WAV`, `OGG`), or Video (`MP4`, up to 60 seconds).
* **Process:** Passes the media binary along with a structured forensic inspection prompt to **Gemini Multimodal (`gemini-2.5-flash`)**:
  * **Visual (Image/Video):** Inspects facial boundary blending, eye/teeth symmetry, inconsistent lighting/shadows, unnatural skin smoothing, background warping, and temporal lip-sync drift across frames.
  * **Acoustic (Audio/Video):** Inspects unnatural breathing cadence, flat prosody, metallic vocoder artifacts, abrupt spectral cutoffs, and splicing discontinuities.
  * **Semantic-Visual Mismatch:** Extracts visible text/landmarks/audio transcript and checks whether the media is authentic footage being misrepresented in a false context (e.g., an old flood video shared as a current event).
* **Output:** Structured list of forensic observations with severity levels (`LOW`, `MEDIUM`, `HIGH`), confidence score, and timestamp/region descriptors.

### Pillar 3: Metadata & Provenance Inspection
* **Input:** Raw uploaded media file buffer before any client-side re-compression.
* **Process:** Runs `exifr` (images) and `ffprobe` (audio/video) on the server to inspect:
  * Camera make/model, lens parameters, GPS coordinates, and original capture timestamps.
  * Software/encoder signatures (e.g., `Adobe Firefly`, `Midjourney`, `Lavf`, `ElevenLabs`, `Photoshop`).
  * Presence or absence of **C2PA Content Credentials** (`jumbf` / `c2pa` boxes).
  * Detection of metadata stripping typical of WhatsApp/Telegram re-encoding.
* **Output:** Structured metadata summary and provenance risk indicators fed into the final scoring engine.

### Pillar 4: Origin & Narrative Spread Timeline
* **Input:** Extracted core claims, named entities, and visual/transcript descriptors.
* **Process:** Executes targeted grounded search queries to identify the earliest public appearance of the claim or media event and track how the narrative evolved.
* **Output:** A 3-to-5 node chronological timeline (`First-Seen` -> `Context Shift / Mutation` -> `Viral Resurgence`) with dates, platforms/sources, and summary notes.

---

## 4. Authenticity Scoring Rubric & Verdict Tiers

### 4.1 Weighted Score Calculation
Each pillar produces a normalized integrity sub-score in the range $[0, 100]$, where $100$ indicates complete authenticity and $0$ indicates confirmed fabrication or manipulation:
* $S_{\text{claim}}$: Factual accuracy & source corroboration score.
* $S_{\text{media}}$: Multimodal forensic integrity score (absence of synthesis/tampering artifacts).
* $S_{\text{prov}}$: Metadata & provenance trust score.

The composite Authenticity Score $S_{\text{total}}$ adapts dynamically based on input modality:

1. **Multimodal Input (Media + Text/Speech Claim):**
   $$S_{\text{total}} = 0.45 \cdot S_{\text{claim}} + 0.40 \cdot S_{\text{media}} + 0.15 \cdot S_{\text{prov}}$$

2. **Text / URL Only Input (No Media File):**
   $$S_{\text{total}} = 0.85 \cdot S_{\text{claim}} + 0.15 \cdot S_{\text{prov}}$$
   *(where $S_{\text{prov}}$ reflects domain credibility and source traceability).*

3. **Pure Media Input (No Verifiable Factual Claim Detected):**
   $$S_{\text{total}} = 0.75 \cdot S_{\text{media}} + 0.25 \cdot S_{\text{prov}}$$

### 4.2 Verdict Classification Tiers
| Score Range | Verdict Label | Badge Color | User Guidance |
| :--- | :--- | :--- | :--- |
| $80 \le S_{\text{total}} \le 100$ | `VERIFIED / AUTHENTIC` | Emerald Green | Corroborated by credible sources; no signs of synthetic manipulation. |
| $50 \le S_{\text{total}} \le 79$ | `NEEDS CONTEXT / INCONCLUSIVE` | Amber Yellow | Partially accurate, missing context, or stripped metadata prevents full verification. |
| $25 \le S_{\text{total}} \le 49$ | `MISLEADING / ALTERED` | Orange | Significant factual distortion, out-of-context media, or localized editing detected. |
| $0 \le S_{\text{total}} \le 24$ | `FALSE / LIKELY DEEPFAKE` | Crimson Red | Contradicted by authoritative sources and/or exhibits strong AI-synthesis artifacts. |

---

## 5. API Specification & Data Models

### 5.1 REST Endpoints

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/audit/text` | Audits a text claim or news/social URL. | `{ "content": string, "sourceUrl"?: string }` |
| `POST` | `/api/audit/media` | Audits an image, audio, or video file with optional user context. | `multipart/form-data`: `file` (File), `contextClaim`? (string) |
| `GET` | `/api/audit/:id` | Retrieves a persisted Trust & Provenance Report by ID. | Path param `id` |
| `GET` | `/api/audits/feed` | Lists recent public audits and curated demo examples. | Query params: `?limit=10&filter=all` |
| `GET` | `/api/health` | Health check for deployment & uptime verification. | None |

### 5.2 Canonical `AuditReport` JSON Schema

```json
{
  "id": "aud_9f82c1a4",
  "createdAt": "2026-11-20T14:30:00.000Z",
  "inputType": "video",
  "inputSummary": "24-second clip claiming new nationwide UPI transaction tax effective tomorrow.",
  "isDemoSample": false,
  "overallScore": 18,
  "verdict": "FALSE / LIKELY DEEPFAKE",
  "executiveSummary": "No official RBI or Finance Ministry circular supports a UPI transaction tax. Furthermore, the video exhibits severe lip-sync drift and robotic vocal cadence consistent with AI voice cloning.",
  "subScores": {
    "claimIntegrity": 10,
    "mediaForensics": 22,
    "provenance": 30
  },
  "claims": [
    {
      "claimText": "Government announced a 2% tax on all UPI transfers starting tomorrow.",
      "status": "FALSE",
      "explanation": "Official PIB Fact Check and RBI notifications explicitly debunked this recurring rumor.",
      "citations": [
        {
          "title": "PIB Fact Check: No tax levied on UPI transactions",
          "url": "https://pib.gov.in/",
          "domain": "pib.gov.in"
        }
      ]
    }
  ],
  "forensics": {
    "mediaAnalyzed": true,
    "synthesisLikelihood": "HIGH",
    "anomalies": [
      {
        "category": "LIP_SYNC_DRIFT",
        "severity": "HIGH",
        "timestampOrRegion": "00:04 - 00:19 (mouth & jawline)",
        "detail": "Jaw movement lags behind plosive consonants; unnatural skin smoothing around the lower face."
      },
      {
        "category": "ACOUSTIC_PROSODY",
        "severity": "MEDIUM",
        "timestampOrRegion": "00:00 - 00:24",
        "detail": "Uniform pitch contour with missing natural inhalation pauses."
      }
    ]
  },
  "metadata": {
    "fileName": "urgent_upi_notice.mp4",
    "mimeType": "video/mp4",
    "fileSizeBytes": 4120540,
    "cameraOrSoftware": "Lavf58.76.100 (Re-encoded / Stripped EXIF)",
    "hasC2PA": false,
    "flags": [
      "Original camera metadata stripped",
      "Generic FFmpeg re-encoding signature detected"
    ]
  },
  "originTimeline": [
    {
      "date": "2023-03-29",
      "stage": "FIRST_SEEN",
      "source": "NPCI Official Press Release",
      "description": "Original misconception began around merchant interchange fees (PPI), which NPCI clarified do not apply to regular user-to-user UPI transfers."
    },
    {
      "date": "2026-11-19",
      "stage": "MUTATION",
      "source": "Social Messaging Forwards",
      "description": "Old audio clip re-packaged with an AI-cloned voiceover over archival press conference footage."
    }
  ]
}
```

---

## 6. Database Schema (MongoDB / Mongoose)

* **Collection:** `audit_reports`
* **Indexes:**
  * `{ id: 1 }` (Unique index for fast permalink lookups at `/audit/:id`)
  * `{ createdAt: -1 }` (Descending index for the Public Verification Feed)
  * `{ isDemoSample: -1, createdAt: -1 }` (Ensures preloaded sample audits remain pinned at the top of the feed)
* **Storage Note:** Raw uploaded files are processed in memory or ephemeral `/tmp` storage and immediately purged after audit completion; only extracted metadata, input summaries, and structured reports are persisted.

---

## 7. Frontend UX & Key Screens

1. **Hero & Unified Audit Workspace (`/`):**
   * Clean, authoritative dark/light civic-tech interface.
   * **4 Input Tabs:** `Text / Claim`, `Image`, `Audio`, `Video` (with drag-and-drop zone and optional *"Add context or claim"* input for media).
   * **"Try an Example" One-Click Chips:** 4 pre-populated sample triggers (e.g., *Fake Govt Scheme Forward*, *AI-Cloned Official Voice Note*, *Out-of-Context Flood Video*, *Verified ISRO Announcement*) so judges and users can test the full pipeline in one click.
2. **Live Pipeline Progress Stepper:**
   * Real-time visual feedback while awaiting API response:
     * *Step 1:* Extracting claims & parsing file metadata...
     * *Step 2:* Cross-referencing live web & official sources...
     * *Step 3:* Running multimodal deepfake forensics...
     * *Step 4:* Reconstructing origin timeline & Trust Score...
3. **Shareable Trust & Provenance Report (`/audit/:id`):**
   * **Top Banner:** Radial Authenticity Score gauge ($0 - 100$), Verdict Badge, Executive Summary, and **"Copy Shareable Report Link"** button.
   * **4-Tab / Grid Breakdown:**
     * *Fact-Check Evidence Card* (claims + clickable source pills).
     * *Deepfake Forensics Card* (visual/audio anomaly badges + timestamps).
     * *Metadata & C2PA Card* (EXIF/encoder details + provenance warnings).
     * *Origin Timeline Card* (vertical chronological stepper from First-Seen to Viral Spread).
4. **Public Audit Feed (`/feed`):**
   * Filterable stream of recent community audits (`All`, `False / Deepfake`, `Verified`, `Needs Context`).

---

## 8. Tech Stack, Environment & Attribution

### 8.1 Stack Overview
* **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons.
* **Backend:** Node.js + Express (or Python 3.11 + FastAPI), Multer (multipart uploads).
* **AI & Grounding:** Google Gemini API (`gemini-2.5-flash`) via `@google/genai` SDK with **Google Search Grounding** and **Structured JSON Outputs**.
* **Forensics & Metadata:** `exifr` (EXIF/XMP/IPTC parser), `fluent-ffmpeg` / `ffprobe` (video/audio container & stream inspection).
* **Database & Hosting:** MongoDB Atlas (Database), Vercel (Frontend), Render / Railway (Backend).

### 8.2 Required Environment Variables
```env
PORT=8080
GEMINI_API_KEY=your_google_gemini_api_key
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/veripulse
CLIENT_ORIGIN=https://veripulse.vercel.app
MAX_FILE_SIZE_MB=25
```

### 8.3 Third-Party Attribution (For Challazo Submission)
All external models, APIs, and open-source libraries are explicitly credited in the application footer and submission form:
* **Google Gemini (`gemini-2.5-flash`) & Google Search Grounding** for multimodal media inspection, claim extraction, and real-time web verification.
* **`exifr` & `FFmpeg/ffprobe`** for open-source file metadata and stream header extraction.

---

## 9. 5-Day Execution Roadmap & Readiness Check

### 9.1 Build Schedule
* **Day 1 (17–18 Nov):** Complete Challazo registration (**NxtWave Academy Online**) + mandatory Google Form (`bit.ly/onlinehackathon-ideaforge`). Initialize monorepo, MongoDB Atlas cluster, and `POST /api/audit/text` with Gemini Search Grounding.
* **Day 2 (19 Nov):** Implement `POST /api/audit/media`, `exifr`/`ffprobe` metadata parser, multimodal deepfake forensic prompt, and scoring engine.
* **Day 3 (20 Nov, Submissions Open 6:00 PM):** Build React + Tailwind Audit Workspace, Progress Stepper, and Shareable Trust Report (`/audit/:id`). Seed 4 realistic sample reports.
* **Day 4 (21 Nov):** Deploy frontend (Vercel) and backend (Render/Railway). Test all 4 input types and sample buttons in an **Incognito browser window**.
* **Day 5 (22 Nov, Deadline 11:59 PM IST):** Record 2-minute demo video showcasing a fake claim, a deepfake media audit, and origin timeline; run Challazo's **Readiness Check** and submit before 9:00 PM IST.

### 9.2 Challazo Readiness Check Verification
* [ ] Publicly accessible frontend URL works in an Incognito/Private window without login walls.
* [ ] Problem statement clearly identifies target users (messaging-app users, citizen journalists, community moderators) and civic impact.
* [ ] AI usage is meaningfully integrated (multimodal forensics + grounded live fact-checking) and third-party APIs/libraries are credited.
* [ ] Submission status on Challazo shows **Submitted** (not Draft) prior to **22 November, 11:59 PM IST**.