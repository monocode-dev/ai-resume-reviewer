import { useRef, useState } from "react";
import type { Me, ResumeReview } from "../types/types";

interface ReviewPageProps {
  userInfo: Me;
  onReviewComplete: (remaining: number) => void;
  onLogout: () => void;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function scoreTone(score: number) {
  if (score < 50) return "flag";
  if (score >= 75) return "good";
  return "";
}

export default function ReviewPage({ userInfo, onReviewComplete, onLogout }: ReviewPageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [review, setReview] = useState<ResumeReview | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  }

  function handleRemoveFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) {
      setError('Attach a resume file first.');
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

  const planLabel = userInfo.plan === 'pro' ? 'Pro' : 'Free';

  if (review) {
    const tone = scoreTone(review.matchScore);
    return (
      <div className="page review-page">
        <div className="review-top">
          <p className="mark" style={{ margin: 0 }}><span>Resume</span> Reviewer</p>
          <button onClick={onLogout} className="btn btn-line">Log out</button>
        </div>

        <div className="panel result-doc">
          <div>
            <div className="score-block">
              <span className={`score-value ${tone}`}>{review.matchScore}</span>
              <span className="score-max">/100</span>
            </div>
            <p className="score-label">Match against the job description</p>

            <div className="score-scale">
              <div className="score-scale-fill" style={{ width: `${review.matchScore}%` }} />
              <div className="score-scale-marker" style={{ left: `${review.matchScore}%` }} />
            </div>
            <div className="score-scale-ends">
              <span>0</span>
              <span>100</span>
            </div>
          </div>

          <p className="summary-text">{review.summary}</p>

          <div className="note-group flagged">
            <h3>Missing sections</h3>
            {review.missingSections.length > 0 ? (
              <ul className="note-list">
                {review.missingSections.map((s) => <li key={s}>{s}</li>)}
              </ul>
            ) : (
              <p className="note-empty">Nothing missing — your sections are complete.</p>
            )}
          </div>

          <div className="note-group flagged">
            <h3>Missing keywords</h3>
            {review.missingKeywords.length > 0 ? (
              <ul className="note-list">
                {review.missingKeywords.map((k) => <li key={k}>{k}</li>)}
              </ul>
            ) : (
              <p className="note-empty">No gaps found against the job description.</p>
            )}
          </div>

          <div className="note-group suggested">
            <h3>Suggestions</h3>
            {userInfo.plan === 'pro' ? (
              <ul className="note-list">
                {review.suggestions.map((s) => <li key={s}>{s}</li>)}
              </ul>
            ) : (
              <p className="upsell">Suggestions for improving this resume are a Pro feature.</p>
            )}
          </div>

          <div className="result-actions">
            <button onClick={() => setReview(null)} className="btn btn-line">
              Review another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page review-page">
      <div className="review-top">
        <p className="mark" style={{ margin: 0 }}><span>Resume</span> Reviewer</p>
        <button onClick={onLogout} className="btn btn-line">Log out</button>
      </div>

      <div className="status-line" style={{ marginBottom: '1.25rem' }}>
        <span>{userInfo.reviewsRemainingToday} review{userInfo.reviewsRemainingToday === 1 ? '' : 's'} left today</span>
        <span className={`plan-tag ${userInfo.plan === 'pro' ? 'pro' : ''}`}>{planLabel}</span>
      </div>

      <div className="panel">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="resume">Resume</label>

            {file ? (
              <div className="file-chip">
                <div className="file-chip-info">
                  <svg className="file-chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
                    <path d="M14 3v5h5" />
                  </svg>
                  <span className="file-chip-name">{file.name}</span>
                  <span className="file-chip-size">{formatFileSize(file.size)}</span>
                </div>
                <button type="button" className="file-chip-remove" onClick={handleRemoveFile} aria-label="Remove file">
                  ×
                </button>
              </div>
            ) : (
              <label
                htmlFor="resume"
                className={`dropzone${dragOver ? ' drag-over' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <svg className="dropzone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 16V4M12 4 7 9M12 4l5 5" />
                  <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
                </svg>
                <p className="dropzone-text"><strong>Choose a file</strong> or drag it here</p>
                <p className="dropzone-hint">PDF, PNG, JPG or WebP</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="resume"
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  onChange={handleFileChange}
                  required
                />
              </label>
            )}
          </div>

          <div className="field">
            <label htmlFor="jobDescription">Job description</label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              maxLength={3000}
              placeholder="Paste the job posting you're applying to…"
              required
            />
            <span className="char-count">{jobDescription.length}/3000</span>
          </div>

          {error && <p className="notice">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading || userInfo.reviewsRemainingToday <= 0}>
            {loading ? <span className="spinner" /> : null}
            {loading ? 'Reviewing' : 'Review my resume'}
          </button>
        </form>
      </div>
    </div>
  );
}