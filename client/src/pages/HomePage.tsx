import { Link } from "react-router-dom";
import type { Me } from "../types/types";
 
interface HomePageProps {
  user: Me | null;
}
 
export default function HomePage({ user }: HomePageProps) {
  const ctaTarget = user ? "/product" : "/signup";
  const ctaLabel = user ? "Go to Product" : "Get Started Free";
 
  return (
    <div className="home">
      <section className="home-hero">
        <p className="home-kicker">AI-powered resume review</p>
        <h1>
          Know exactly why your resume<br />
          <em>isn't</em> landing interviews.
        </h1>
        <p className="home-lede">
          Upload your resume and a job description. Get a match score, the
          keywords and sections you're missing, and specific edits to close
          the gap — in under a minute.
        </p>
        <div className="home-hero-cta">
          <Link to={ctaTarget} className="btn btn-primary home-cta-btn">{ctaLabel}</Link>
          <Link to="/plans" className="btn btn-line home-cta-btn">See Plans</Link>
        </div>
        <p className="home-hero-note">No credit card required to start.</p>
      </section>
 
      <section className="home-preview panel">
        <div className="score-block">
          <span className="score-value good">82</span>
          <span className="score-max">/ 100</span>
        </div>
        <p className="score-label">Match score for Senior Frontend Engineer</p>
        <div className="score-scale">
          <div className="score-scale-fill" style={{ width: "82%" }} />
          <div className="score-scale-marker" style={{ left: "82%" }} />
        </div>
        <div className="score-scale-ends">
          <span>0</span>
          <span>100</span>
        </div>
      </section>
 
      <section className="home-section">
        <div className="home-section-howItWorks">
        <h2>How it works</h2>
        <ol className="process">
          <li className="process-step">
            <span className="process-marker">01</span>
            <div className="process-body">
              <h3>Upload your resume</h3>
              <p>Drop in a PDF or image of your resume and paste the job description you're targeting.</p>
            </div>
          </li>
          <li className="process-step">
            <span className="process-marker">02</span>
            <div className="process-body">
              <h3>Get scored instantly</h3>
              <p>AI reads both documents and scores how well your resume matches the role, 0–100.</p>
            </div>
          </li>
          <li className="process-step">
            <span className="process-marker">03</span>
            <div className="process-body">
              <h3>Fix what's missing</h3>
              <p>See missing sections, missing keywords, and on Pro plan you get concrete suggestions to improve your score.</p>
            </div>
          </li>
        </ol>
        </div>
      </section>
 
      <section className="home-section">
        <h2>What you get</h2>
        <div className="annotated-resume">
          <div className="mock-resume" aria-hidden="true">
            <p className="mock-heading">Match Score</p>
            <div className="mock-line mock-name" />
            <p className="mock-heading">Summary</p>
            <div className="mock-line" style={{ width: '92%' }} />
            <div className="mock-line" style={{ width: '68%' }} />
            <div className="mock-section-row">
              <p className="mock-heading">Experience</p>
              <span className="mock-dot flag" />
            </div>
            <div className="mock-line" style={{ width: '85%' }} />
            <div className="mock-line" style={{ width: '40%' }} />
            <div className="mock-section-row">
              <p className="mock-heading">Skills</p>
              <span className="mock-dot good" />
            </div>
            <div className="mock-line" style={{ width: '55%' }} />
          </div>
 
          <ul className="annotation-list">
            <li>
              <span className="mock-dot good" />
              <div>
                <h3>Match score</h3>
                <p>A single, honest number showing how well your resume fits the job description.</p>
              </div>
            </li>
            <li>
              <span className="mock-dot flag" />
              <div>
                <h3>Missing keywords</h3>
                <p>The exact terms from the job description your resume doesn't mention.</p>
              </div>
            </li>
            <li>
              <span className="mock-dot flag" />
              <div>
                <h3>Missing sections</h3>
                <p>Structural gaps — no summary, no metrics, no skills section — flagged automatically.</p>
              </div>
            </li>
            <li>
              <span className="mock-dot accent" />
              <div>
                <h3>Suggestions <span className="plan-tag pro">Pro</span></h3>
                <p>Specific, line-level edits to raise your match score, not just a diagnosis.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section className="home-section home-plans-teaser panel">
        <div>
          <h2>Start free, upgrade when you need it</h2>
        </div>
        <Link to="/plans" className="btn btn-primary home-cta-btn">Compare Plans</Link>
      </section>

      <footer className="home-footer">
        <p>All Right Resesverd to monocode ©</p>
      </footer>
    </div>
  );
}