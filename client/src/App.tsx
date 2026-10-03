import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { apiRequest } from "./api/client"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import ReviewPage from "./pages/ReviewPage"
import type { Me } from "./types/types"

export default function App() {
  const [user, setUser] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<Me>('/auth/me')
    .then(res => {
      if(res && res.success) setUser(res.data);
      setLoading(false);
    });
  }, []);

  function handleReviewComplete(remaining: number) {
    setUser((prev) => prev ? { ...prev, reviewsRemainingToday: remaining } : prev);
  }

  function handleLogout() {
  apiRequest('/auth/logout', { method: 'POST' }).then(() => {
    setUser(null);
  });
}

  if(loading) return <p>Loading...</p>

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/"/> : <LoginPage onLogin={setUser} />}/>
        <Route path="/signup" element={user ? <Navigate to="/"/> : <SignupPage onLogin={setUser} /> }/>
        <Route path="/" element={user ? <ReviewPage userInfo={user} onReviewComplete={handleReviewComplete} onLogout={handleLogout} /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}