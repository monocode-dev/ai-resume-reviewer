import { Request, Response } from "express";
import { reviewResumeFile, ResumeReview } from "../scripts/gemini.js";
import pool from "../database/database.js";

export async function reviewResume(req: Request, res: Response) {
    const fileBuffer = req.file?.buffer;
    const mimeType = (req as any).verifiedMimeType;
    const jobDescription = req.body?.jobDescription;

    if (!fileBuffer || !mimeType || !jobDescription) {
        return res.status(400).json({success: false, message: "Resume file and job description are required." });
    }

    try {
        const review: ResumeReview | undefined = await reviewResumeFile(fileBuffer, mimeType, jobDescription);
        if(!review) return res.status(500).json({success: false, message: "Server Error, Please try again later..."})

        if (req.session.plan === "free") {
            review.suggestions = [];
        }

        return res.status(200).json({success: true, message: "Review Generated Successfully", data: review});
    } catch (error) {
        console.error(error)
        await pool.query(
            `UPDATE users SET reviews_used_today = reviews_used_today - 1 WHERE id = $1`,
            [req.session.userId]
        );
        return res.status(500).json({ message: "Failed to review resume." });
    } 
}