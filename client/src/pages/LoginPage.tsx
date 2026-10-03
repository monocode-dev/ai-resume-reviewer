import React, { useState } from "react"
import { Link } from "react-router-dom"
import { apiRequest } from "../api/client"
import type { Me } from "../types/types";

interface LoginPageProps {
  onLogin: (user: Me) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleLogin(email: string, password: string) {
    return apiRequest<Me>('/auth/login', {
      method: "POST",
      body: JSON.stringify({ email: email, password: password })
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    handleLogin(email, password)
      .then(res => {
        setLoading(false);
        if (!res || res?.success === false || !res.data) {
          setError(res?.message || 'Something went wrong');
          return;
        } else {
          setEmail('');
          setPassword('')
          onLogin(res.data);
        }
      });
  }

  return (
    <div className="page">
      <p className="mark"><span>Resume</span> Reviewer</p>
      <div className="auth-panel panel">
        <h1>Log in</h1>
        <p className="lede">Pick up where you left off — your daily reviews carry over.</p>

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
            {loading ? 'Logging in' : 'Log in'}
          </button>
        </form>

        <p className="switch">
          No account yet? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  )
}