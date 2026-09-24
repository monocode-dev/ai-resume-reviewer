import { Router } from "express";
import { reviewResume } from "../controllers/reviewController";
import { requireAuth} from "../middleware/middleware";
import { checkQuota } from "../middleware/quota";
import { validateResumeFile, validateJobDescription, handleMulterError, upload } from "../middleware/upload";

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