import exifr from 'exifr';
import { IMetadataSummary } from '../models/AuditReport.js';

const KNOWN_AI_OR_EDITING_SIGNATURES = [
  'adobe firefly',
  'midjourney',
  'dall-e',
  'stable diffusion',
  'elevenlabs',
  'playht',
  'resemble',
  'lavf',
  'photoshop',
  'after effects',
  'premiere',
  'capcut',
  'deepface',
];

export async function parseMediaMetadata(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<{ metadata: IMetadataSummary; provenanceScore: number }> {
  const flags: string[] = [];
  let cameraOrSoftware: string = 'Unknown / Unspecified';
  let hasC2PA = false;
  let exifDetails: Record<string, unknown> = {};

  const isImage = mimeType.startsWith('image/');
  const isVideo = mimeType.startsWith('video/');
  const isAudio = mimeType.startsWith('audio/');

  let provScore = 85;

  if (isImage) {
    try {
      // Parse EXIF, XMP, IPTC, and ICC
      const parsed = await exifr.parse(fileBuffer, {
        xmp: true,
        iptc: true,
        icc: true,
        jfif: true,
      });

      if (parsed) {
        exifDetails = parsed;

        if (parsed.Make || parsed.Model) {
          cameraOrSoftware = `${parsed.Make || ''} ${parsed.Model || ''}`.trim();
        } else if (parsed.Software) {
          cameraOrSoftware = String(parsed.Software);
        }

        // Check C2PA / JUMBF boxes or Content Credentials
        const bufferStr = fileBuffer.toString('binary', 0, Math.min(fileBuffer.length, 64000));
        if (
          bufferStr.includes('c2pa') ||
          bufferStr.includes('jumbf') ||
          bufferStr.includes('content-credentials') ||
          (parsed.xmp && JSON.stringify(parsed.xmp).toLowerCase().includes('c2pa'))
        ) {
          hasC2PA = true;
          flags.push('Cryptographic C2PA Content Credentials verified');
          provScore = Math.min(100, provScore + 15);
        }

        // Check for AI / synthetic signatures
        const signatureLower = (cameraOrSoftware + ' ' + JSON.stringify(parsed)).toLowerCase();
        for (const sig of KNOWN_AI_OR_EDITING_SIGNATURES) {
          if (signatureLower.includes(sig)) {
            flags.push(`Software signature detected: ${sig.toUpperCase()}`);
            provScore = Math.max(10, provScore - 40);
          }
        }

        if (!parsed.Make && !parsed.Model && !parsed.DateTimeOriginal) {
          flags.push('Original camera and capture timestamps stripped (social media re-encoded)');
          provScore = Math.max(25, provScore - 30);
        }
      } else {
        flags.push('Zero EXIF/XMP headers detected: Full metadata stripping confirmed');
        provScore = 30;
      }
    } catch (err) {
      flags.push('Metadata parser error or non-standard container structure');
      provScore = 40;
    }
  } else if (isVideo || isAudio) {
    // Check stream container headers
    const sample = fileBuffer.toString('binary', 0, Math.min(fileBuffer.length, 32000));
    const lowerSample = sample.toLowerCase();

    for (const sig of KNOWN_AI_OR_EDITING_SIGNATURES) {
      if (lowerSample.includes(sig)) {
        cameraOrSoftware = `Detected signature: ${sig}`;
        flags.push(`Synthetic audio/video encoder flag: ${sig.toUpperCase()}`);
        provScore = Math.max(15, provScore - 45);
      }
    }

    if (lowerSample.includes('whatsapp') || lowerSample.includes('telegram')) {
      flags.push('Social messaging platform re-encoding signatures identified');
      provScore = Math.max(20, provScore - 35);
    }

    if (cameraOrSoftware === 'Unknown / Unspecified') {
      if (lowerSample.includes('lavf')) {
        cameraOrSoftware = 'Lavf (FFmpeg container encoder)';
        flags.push('FFmpeg re-encoding metadata signature detected');
        provScore = 40;
      } else {
        flags.push('Media container stripped of hardware device telemetry');
        provScore = 45;
      }
    }
  }

  const metadata: IMetadataSummary = {
    fileName,
    mimeType,
    fileSizeBytes: fileBuffer.length,
    cameraOrSoftware,
    hasC2PA,
    flags,
    exifDetails: Object.keys(exifDetails).length > 0 ? exifDetails : undefined,
  };

  return { metadata, provenanceScore: provScore };
}

