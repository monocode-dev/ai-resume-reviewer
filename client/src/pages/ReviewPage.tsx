import { useState } from "react";
import type { Me, ResumeReview } from "../types/types";

interface ReviewPageProps {
  userInfo: Me;
  onReviewComplete: (remaining: number) => void;
  onLogout: () => void;
}

export default function ReviewPage({userInfo, onReviewComplete, onLogout}: ReviewPageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [review, setReview] = useState<ResumeReview | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) {
      setError('Please select a resume file.');
      return;
    }

    setError('');
    setLoading(true);
    setReview(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    fetch('/api/review', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        if (!res || res.success === false) {
          setError(res?.message || 'Something went wrong');
          return;
        }
        setReview(res.data);
        onReviewComplete(res.data.reviewsRemainingToday);
      })
      .catch(() => {
        setLoading(false);
        setError('Network error, please try again.');
      });
  }

  if (review) {
    return (
      <div>
        <button onClick={onLogout}>Log Out</button>
        <h2>Match Score: {review.matchScore}/100</h2>
        <p>{review.summary}</p>

        <h3>Missing Sections</h3>
        <ul>{review.missingSections.map((s) => <li key={s}>{s}</li>)}</ul>

        <h3>Missing Keywords</h3>
        <ul>{review.missingKeywords.map((k) => <li key={k}>{k}</li>)}</ul>

        {userInfo.plan === 'pro' ? (
          <>
            <h3>Suggestions</h3>
            <ul>{review.suggestions.map((s) => <li key={s}>{s}</li>)}</ul>
          </>
        ) : (
          <p>Upgrade to Pro to see improvement suggestions.</p>
        )}

        <button onClick={() => setReview(null)}>Review Another</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Resume Reviewer</h1>
      <button onClick={onLogout}>Log Out</button>
      <p>Reviews remaining today: {userInfo.reviewsRemainingToday}</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="resume">Resume (PDF or image)</label>
        <input type="file" id="resume" accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={handleFileChange} required />

        <label htmlFor="jobDescription">Job Description</label>
        <textarea
          id="jobDescription"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          maxLength={3000}
          required
        />

        {error && <p className="form-error">{error}</p>}

        <button type="submit" disabled={loading || userInfo.reviewsRemainingToday <= 0}>
          {loading ? 'Reviewing...' : 'Review My Resume'}
        </button>
      </form>
    </div>
  );
}