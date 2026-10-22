import { Router } from "express";
import { createCheckoutSession } from "../controllers/checkoutController.js";
import { requireAuth } from "../middleware/middleware.js";

const router = Router();

router.post("/checkout/create-session", requireAuth, createCheckoutSession);

export default router;