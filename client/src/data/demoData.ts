import { AuditReport, DemoSampleTrigger } from '../types/audit';

export const DEMO_TRIGGERS: DemoSampleTrigger[] = [
  {
    id: 'demo-upi-tax',
    title: 'Fake Govt Scheme Forward',
    badge: 'Video Deepfake',
    type: 'video',
    description: 'Viral WhatsApp forward claiming 2% tax on UPI starting tomorrow.',
    sampleInput: 'Urgent: Ministry of Finance mandates 2% levy on all UPI peer-to-peer transfers exceeding Rs 500 starting midnight.',
    contextClaim: 'Video alleging official RBI notification of 2% UPI transaction tax.'
  },
  {
    id: 'demo-voice-clone',
    title: 'AI-Cloned Official Voice Note',
    badge: 'Audio Clone',
    type: 'audio',
    description: 'Synthesized voice note impersonating Chief Election Commissioner announcing poll date shift.',
    sampleInput: 'Audio recording: "Following emergency consultations, all state elections are postponed indefinitely."',
    contextClaim: 'Forwarded voice note purportedly from Chief Election Commissioner.'
  },
  {
    id: 'demo-flood-video',
    title: 'Out-of-Context Flood Video',
    badge: 'Recycled Media',
    type: 'video',
    description: '2019 Assam flood footage recycled as "breaking dam breach in Uttarakhand".',
    sampleInput: 'Breaking: Major dam overflow in Uttarakhand hills causes flash floods today.',
    contextClaim: 'Circulating video claimed to be real-time footage of Tehri Dam overflow.'
  },
  {
    id: 'demo-isro-launch',
    title: 'Verified ISRO Announcement',
    badge: 'Authentic',
    type: 'text',
    description: 'Official press release on Chandrayaan-4 sample return mission architecture.',
    sampleInput: 'ISRO announces Chandrayaan-4 lunar sample return mission approved with 5 modules and two launch phases via LVM3.',
  }
];

export const DEMO_REPORTS: Record<string, AuditReport> = {
  'demo-upi-tax': {
    id: 'aud_9f82c1a4',
    createdAt: '2026-11-20T14:30:00.000Z',
    inputType: 'video',
    inputSummary: '24-second clip claiming new nationwide UPI transaction tax effective tomorrow.',
    isDemoSample: true,
    overallScore: 18,
    verdict: 'FALSE / LIKELY DEEPFAKE',
    executiveSummary: 'No official RBI or Finance Ministry circular supports a UPI transaction tax. Furthermore, the video exhibits severe lip-sync drift and robotic vocal cadence consistent with AI voice cloning.',
    subScores: {
      claimIntegrity: 10,
      mediaForensics: 22,
      provenance: 30
    },
    claims: [
      {
        claimText: 'Government announced a 2% tax on all UPI transfers starting tomorrow.',
        status: 'FALSE',
        explanation: 'Official PIB Fact Check and RBI notifications explicitly debunked this recurring rumor. User-to-user UPI payments remain 100% free of charge.',
        citations: [
          {
            title: 'PIB Fact Check: No tax levied on individual UPI transactions',
            url: 'https://pib.gov.in/factcheck',
            domain: 'pib.gov.in'
          },
          {
            title: 'NPCI: Clarification on Unified Payments Interface Charges',
            url: 'https://www.npci.org.in/',
            domain: 'npci.org.in'
          }
        ]
      }
    ],
    forensics: {
      mediaAnalyzed: true,
      synthesisLikelihood: 'HIGH',
      anomalies: [
        {
          category: 'LIP_SYNC_DRIFT',
          severity: 'HIGH',
          timestampOrRegion: '00:04 - 00:19 (mouth & jawline)',
          detail: 'Jaw movement lags behind plosive consonants; unnatural skin smoothing around the lower face and boundary blurring.'
        },
        {
          category: 'ACOUSTIC_PROSODY',
          severity: 'MEDIUM',
          timestampOrRegion: '00:00 - 00:24',
          detail: 'Uniform pitch contour with missing natural inhalation pauses; typical neural speech synthesis artifacts.'
        }
      ]
    },
    metadata: {
      fileName: 'urgent_upi_notice.mp4',
      mimeType: 'video/mp4',
      fileSizeBytes: 4120540,
      cameraOrSoftware: 'Lavf58.76.100 (Re-encoded / Stripped EXIF)',
      hasC2PA: false,
      flags: [
        'Original camera metadata stripped',
        'Generic FFmpeg/Lavf re-encoding signature detected',
        'Absence of cryptographic C2PA content provenance'
      ]
    },
    originTimeline: [
      {
        date: '2023-03-29',
        stage: 'FIRST_SEEN',
        source: 'NPCI Official Circular',
        description: 'Original misconception began around merchant interchange fees (PPI), which NPCI clarified do not apply to regular user-to-user UPI transfers.'
      },
      {
        date: '2026-11-19',
        stage: 'MUTATION',
        source: 'Social Messaging Forwards',
        description: 'Old audio clip re-packaged with an AI-cloned voiceover layered over archival press conference footage.'
      },
      {
        date: '2026-11-20',
        stage: 'DEBUNKED',
        source: 'PIB Fact Check & VeriPulse Audit Engine',
        description: 'Debunked simultaneously across state PIB units and flagged across community moderation channels.'
      }
    ]
  },

  'demo-voice-clone': {
    id: 'aud_v391b82',
    createdAt: '2026-11-19T10:15:00.000Z',
    inputType: 'audio',
    inputSummary: '42-second audio note of Chief Election Commissioner postponing state elections.',
    isDemoSample: true,
    overallScore: 12,
    verdict: 'FALSE / LIKELY DEEPFAKE',
    executiveSummary: 'The audio sample matches known voice synthesis cloning vectors with zero background room reverberation and artificial formant shifts. The Election Commission of India has issued no such postponement.',
    subScores: {
      claimIntegrity: 5,
      mediaForensics: 15,
      provenance: 25
    },
    claims: [
      {
        claimText: 'State legislative assembly elections postponed indefinitely by ECI order.',
        status: 'FALSE',
        explanation: 'Election Commission of India confirmed current polling schedules stand unchanged without any postponement orders.',
        citations: [
          {
            title: 'Election Commission of India Press Releases & Clarifications',
            url: 'https://eci.gov.in/',
            domain: 'eci.gov.in'
          }
        ]
      }
    ],
    forensics: {
      mediaAnalyzed: true,
      synthesisLikelihood: 'HIGH',
      anomalies: [
        {
          category: 'VOCODER_ARTIFACTS',
          severity: 'HIGH',
          timestampOrRegion: '00:08 - 00:36',
          detail: 'Distinctive metallic vocoder phasing and robotic glottal pulse spacing detected in high frequency bands (above 7.5 kHz).'
        },
        {
          category: 'PROSODY_CADENCE',
          severity: 'HIGH',
          timestampOrRegion: '00:01 - 00:42',
          detail: 'Absence of natural micro-tremors, breath intakes, and natural acoustic room response.'
        }
      ]
    },
    metadata: {
      fileName: 'eci_urgent_announcement.mp3',
      mimeType: 'audio/mpeg',
      fileSizeBytes: 684200,
      cameraOrSoftware: 'ElevenLabs SpeechSynth / LAME 3.100',
      hasC2PA: false,
      flags: [
        'AI vocal synthesizer encoder signature detected in frame padding',
        'Mono 44.1kHz upsampled from 22.05kHz model baseline'
      ]
    },
    originTimeline: [
      {
        date: '2026-11-18',
        stage: 'FIRST_SEEN',
        source: 'Encrypted Telegram Group',
        description: 'First uploaded as an anonymous voice message in regional political discussion channels.'
      },
      {
        date: '2026-11-19',
        stage: 'VIRAL_SPREAD',
        source: 'Regional WhatsApp Broadcasts',
        description: 'Forwarded over 45,000 times within 6 hours across 12 border districts.'
      },
      {
        date: '2026-11-19',
        stage: 'OFFICIAL_RESPONSE',
        source: 'ECI Official Spokesperson on X',
        description: 'ECI issued a formal cease and desist and filed an FIR regarding synthetic voice tampering.'
      }
    ]
  },

  'demo-flood-video': {
    id: 'aud_f812a0c',
    createdAt: '2026-11-18T16:45:00.000Z',
    inputType: 'video',
    inputSummary: '35-second video alleging catastrophic dam collapse in Uttarakhand hills today.',
    isDemoSample: true,
    overallScore: 34,
    verdict: 'MISLEADING / ALTERED',
    executiveSummary: 'Footage is genuine flood video, but represents a serious contextual falsification: reverse-search and visual landmark forensics prove the clip was filmed in Kaziranga, Assam during the 2019 monsoons.',
    subScores: {
      claimIntegrity: 15,
      mediaForensics: 72,
      provenance: 18
    },
    claims: [
      {
        claimText: 'Major dam breach in Uttarakhand triggering mass evacuations today.',
        status: 'MISLEADING',
        explanation: 'State Disaster Response Force (SDRF) and CWC dam telemetry confirm zero structural failures or breach alerts in Uttarakhand.',
        citations: [
          {
            title: 'Central Water Commission (CWC) Daily Reservoir Level Bulletin',
            url: 'https://cwc.gov.in/',
            domain: 'cwc.gov.in'
          },
          {
            title: 'Assam Floods 2019 Video Archive — National Disaster Portal',
            url: 'https://ndmindia.mha.gov.in/',
            domain: 'ndmindia.mha.gov.in'
          }
        ]
      }
    ],
    forensics: {
      mediaAnalyzed: true,
      synthesisLikelihood: 'LOW',
      anomalies: [
        {
          category: 'SEMANTIC_VISUAL_MISMATCH',
          severity: 'HIGH',
          timestampOrRegion: '00:03 - 00:28 (background terrain & vegetation)',
          detail: 'Vegetation features lowland alluvial flora (Rhino sanctuary flora) inconsistent with Himalayan alpine topography claimed in text.'
        },
        {
          category: 'AUDIO_OVERDUB',
          severity: 'MEDIUM',
          timestampOrRegion: '00:00 - 00:35',
          detail: 'Ambient siren and screaming sound track was overlaid; audio phase does not align with visual river current velocities.'
        }
      ]
    },
    metadata: {
      fileName: 'dam_burst_urgent_alert.mp4',
      mimeType: 'video/mp4',
      fileSizeBytes: 8940120,
      cameraOrSoftware: 'WhatsApp Video Encoder v2.24',
      hasC2PA: false,
      flags: [
        'Heavy lossy recompression (Bitrate: 850 kbps)',
        'EXIF geolocation coordinates stripped by social app'
      ]
    },
    originTimeline: [
      {
        date: '2019-07-16',
        stage: 'FIRST_SEEN',
        source: 'Regional Guwahati News Telecast',
        description: 'Original authentic recording of Brahmaputra water rise in Kaziranga National Park.'
      },
      {
        date: '2026-11-18',
        stage: 'MUTATION',
        source: 'Anonymous X (Twitter) Account',
        description: 'Reposted with sensationalized geotag "Uttarakhand Tehri overflow" and added siren sirens.'
      }
    ]
  },

  'demo-isro-launch': {
    id: 'aud_isro_99a',
    createdAt: '2026-11-19T09:00:00.000Z',
    inputType: 'text',
    inputSummary: 'ISRO Chandrayaan-4 lunar sample return mission announcement with 5 modules and LVM3.',
    isDemoSample: true,
    overallScore: 96,
    verdict: 'VERIFIED / AUTHENTIC',
    executiveSummary: 'Claim is corroborated by official Union Cabinet press briefing and official ISRO documentation regarding Chandrayaan-4 mission architecture.',
    subScores: {
      claimIntegrity: 98,
      mediaForensics: 100,
      provenance: 92
    },
    claims: [
      {
        claimText: 'Chandrayaan-4 approved with 5 modules and two LVM3 launches.',
        status: 'VERIFIED',
        explanation: 'Union Cabinet approved the mission on September 18, 2024 with a fund allocation of Rs 2,104 Crore for lunar sample retrieval using five distinct modules.',
        citations: [
          {
            title: 'Cabinet approves Chandrayaan-4 mission to develop technologies for landing on Moon and return to Earth',
            url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=2056251',
            domain: 'pib.gov.in'
          },
          {
            title: 'ISRO Official Mission Profile: Chandrayaan-4',
            url: 'https://www.isro.gov.in/',
            domain: 'isro.gov.in'
          }
        ]
      }
    ],
    forensics: {
      mediaAnalyzed: false,
      synthesisLikelihood: 'NONE',
      anomalies: []
    },
    metadata: {
      fileName: 'text_input.txt',
      mimeType: 'text/plain',
      cameraOrSoftware: 'Official Government Press Release',
      hasC2PA: false,
      flags: [
        'Direct text submission matching official Gazette records'
      ]
    },
    originTimeline: [
      {
        date: '2024-09-18',
        stage: 'FIRST_SEEN',
        source: 'Press Information Bureau (PIB) New Delhi',
        description: 'Union Cabinet chaired by Prime Minister approves the Chandrayaan-4 mission.'
      },
      {
        date: '2026-11-19',
        stage: 'VIRAL_SPREAD',
        source: 'National Space Science Media',
        description: 'ISRO Chairman delivered keynote detailing 2028 target launch configuration.'
      }
    ]
  }
};

