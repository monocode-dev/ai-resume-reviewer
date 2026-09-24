import { Request, Response, NextFunction } from "express";
import pool from "../database/database";
import rateLimit from "express-rate-limit";

//authorization
export function requireAuth(req: Request, res: Response, next: NextFunction) {
    if(!req.session?.userId){
        return res.status(401).json({success: false, message: 'Unauthorized, please Signup/Login!'});
    }
    next();
}

//Rate limiter
export const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5, 
  message: 'Too many login attempts, please try again after a minute.',
});