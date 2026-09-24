import multer from "multer";
import { MulterError } from "multer";
import { Request, Response, NextFunction } from "express";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
  },
});

const SIGNATURES: { mimeType: string; check: (buf: Buffer) => boolean }[] = [
  { mimeType: "application/pdf", check: (b) => b.subarray(0, 4).toString("ascii") === "%PDF" },
  { mimeType: "image/png", check: (b) => b.subarray(0, 8).toString("hex") === "89504e470d0a1a0a" },
  { mimeType: "image/jpeg", check: (b) => b.subarray(0, 3).toString("hex") === "ffd8ff" },
  {
    mimeType: "image/webp",
    check: (b) => b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP",
  },
];

export function validateResumeFile(req: Request, res: Response, next: NextFunction) {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }

  const match = SIGNATURES.find((sig) => sig.check(req.file!.buffer));
  if (!match) {
    return res.status(400).json({ success: false, message: "Unsupported file type." });
  }

  (req as any).verifiedMimeType = match.mimeType;
  next();
}

export function validateJobDescription(req: Request, res: Response, next: NextFunction) {
  const jobDescription = req.body?.jobDescription;
  if (!jobDescription || typeof jobDescription !== "string" || jobDescription.trim().length === 0) {
    return res.status(400).json({ success: false, message: "Job description is required." });
  }
  if (jobDescription.length > 3000) {
    return res.status(400).json({ success: false, message: "Job description is too long." });
  }
  next();
}


export function handleMulterError(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof MulterError) {
    return res.status(400).json({ success: false, message: "File too large or invalid upload." });
  }
  next(err);
}