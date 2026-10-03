export interface ResumeReview {
  matchScore: number;
  summary: string;
  missingSections: string[];
  missingKeywords: string[];
  suggestions: string[];
}

export interface Me{
  email: string;
  plan: "free" | 'pro';
  reviewsRemainingToday: number;
}

interface ReviewResponse {
  review: ResumeReview;
  reviewsRemainingToday: number;
}