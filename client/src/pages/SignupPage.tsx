import { useState } from "react"
import { Link } from "react-router-dom"
import type { Me } from "../types/types";
import { apiRequest } from "../api/client";

interface SignupPageProps {
  onLogin: (user: Me) => void;
}

export default function SignupPage({ onLogin }: SignupPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSignup(email: string, password: string) {
    return apiRequest<Me>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email: email, password: password })
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    handleSignup(email, password)
      .then(res => {
        setLoading(false);
        if (!res || res.success === false || !res.data) {
          setError(res?.message || 'Something went wrong');
          return;
        } else {
          setEmail('');
          setPassword('');
          onLogin(res.data);
        }
      })
  }

  return (
    <div className="page">
      <p className="mark"><span>Resume</span> Reviewer</p>
      <div className="auth-panel panel">
        <h1>Create an account</h1>
        <p className="lede">See where your resume falls short against a real job description.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input type="email"
              id="email"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input type="password"
              id="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required />
          </div>

          {error && <p className="notice">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="spinner" /> : null}
            {loading ? 'Creating account' : 'Sign up'}
          </button>
        </form>

        <p className="switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  )
}