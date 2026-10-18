import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import { apiRequest } from "./api/client"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import PlanPage from "./pages/PlanPage"
import ContactPage from "./pages/ContactPage"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import ReviewPage from "./pages/ReviewPage"
import type { Me } from "./types/types"

function Layout({ user, onLogout, children }: { user: Me | null; onLogout: () => void; children: React.ReactNode }) {
  return (
    <>
      {<Navbar user={user} onLogout={onLogout} />}
      {children}
    </>
  );
}

export default function App() {
  const [user, setUser] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<Me>('/auth/me')
      .then(res => {
        if (res && res.success) setUser(res.data);
        setLoading(false);
      });
  }, []);

  function handleReviewComplete(remaining: number) {
    setUser((prev) => prev ? { ...prev, reviewsRemainingToday: remaining } : prev);
  }

  function handlePlanChange(plan: "free" | "pro") {
    setUser((prev) => prev ? { ...prev, plan } : prev);
  }

  function handleLogout() {
    apiRequest('/auth/logout', { method: 'POST' }).then(() => {
      setUser(null);
    });
  }

  if (loading) {
    return (
      <div className="page">
        <span className="spinner" style={{ width: 20, height: 20, borderTopColor: 'var(--ink)', borderColor: 'rgba(27,36,48,0.2)' }} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/plans" element={<PlanPage onPlanChange={handlePlanChange} />} />
          <Route path="/login" element={user ? <Navigate to="/product" /> : <LoginPage onLogin={setUser} />} />
          <Route path="/signup" element={user ? <Navigate to="/plans" /> : <SignupPage onLogin={setUser} />} />
          <Route
            path="/product"
            element={
              !user ? <Navigate to="/signup" />
              : !user.plan ? <Navigate to="/plans" />
              : <ReviewPage userInfo={user} onReviewComplete={handleReviewComplete} />
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}