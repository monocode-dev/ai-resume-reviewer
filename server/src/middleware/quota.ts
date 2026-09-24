import pool from "../database/database";
import { Request, Response, NextFunction } from "express";

export async function checkQuota(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await pool.query(
      `UPDATE users SET
         reviews_used_today = CASE WHEN usage_reset_date < CURRENT_DATE THEN 1 ELSE reviews_used_today + 1 END,
         usage_reset_date = CURRENT_DATE
       WHERE id = $1
         AND (
           usage_reset_date < CURRENT_DATE
           OR reviews_used_today < CASE WHEN plan = 'pro' THEN 5 ELSE 1 END
         )
       RETURNING plan, reviews_used_today`,
      [req.session.userId]
    );

    if (result.rows.length === 0) {
      return res.status(429).json({ success: false, message: "Daily review limit reached. Try again tomorrow." });
    }

    next();
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, message: "Server Error, please try again later..." });
  }
}