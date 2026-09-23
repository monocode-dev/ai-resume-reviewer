import { Router } from "express";
import { signup, login, logout } from "../controllers/authController";
import { requireAuth } from "../controllers/middleware";
import { loginLimiter } from "../controllers/middleware";

const router = Router();

router.post("/signup", loginLimiter, signup);
router.post("/login", loginLimiter, login);
router.post("/logout", requireAuth, logout);

export default router;