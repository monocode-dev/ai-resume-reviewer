import { Router } from "express";
import { signup, login, logout, getMe } from "../controllers/authController.js";
import { requireAuth, signupRateLimiter } from "../middleware/middleware.js";
import { loginLimiter } from "../middleware/middleware.js";

const router = Router();

router.post("/signup", loginLimiter, signupRateLimiter, signup);
router.post("/login", loginLimiter, login);
router.post("/logout", requireAuth, logout);
router.get("/me", requireAuth, getMe);

export default router;