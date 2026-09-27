import { Router } from "express";
import { signup, login, logout, getMe } from "../controllers/authController";
import { requireAuth } from "../middleware/middleware";
import { loginLimiter } from "../middleware/middleware";

const router = Router();

router.post("/signup", loginLimiter, signup);
router.post("/login", loginLimiter, login);
router.post("/logout", requireAuth, logout);
router.get("/me", requireAuth, getMe);

export default router;