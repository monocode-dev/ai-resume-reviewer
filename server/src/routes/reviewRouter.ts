import { Router } from "express";
import { reviewResume } from "../controllers/reviewController.js";
import { requireAuth} from "../middleware/middleware.js";
import { checkQuota } from "../middleware/quota.js";
import { validateResumeFile, validateJobDescription, handleMulterError, upload } from "../middleware/upload.js";

const router = Router();

router.post("/review",
    requireAuth,
    checkQuota,
    upload.single("resume"),
    handleMulterError,
    validateResumeFile,
    validateJobDescription,
    reviewResume
)

export default router;