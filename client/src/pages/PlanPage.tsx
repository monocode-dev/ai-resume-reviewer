import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams  } from "react-router-dom";
import { apiRequest } from "../api/client";
import PlanCard from "../components/PlanCard";
import type { Me } from "../types/types";

interface PlanPageProps {
  onPlanChange: (plan: "free" | "pro") => void;
}

const CONFIRM_POLL_ATTEMPTS = 6;
const CONFIRM_POLL_INTERVAL_MS = 1500;

export default function PlanPage({ onPlanChange }: PlanPageProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [freeLoading, setFreeLoading] = useState(false);
  const [freeError, setFreeError] = useState("");
  const [proLoading, setProLoading] = useState(false);
  const [proError, setProError] = useState("");
  const confirming = useRef(false);

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    if (checkout !== "success" || confirming.current) return;
    confirming.current = true;
 
    setProLoading(true);
 
    (async () => {
      for (let attempt = 0; attempt < CONFIRM_POLL_ATTEMPTS; attempt++) {
        const res = await apiRequest<Me>("/auth/me");
        if (res?.success && res.data?.plan === "pro") {
          onPlanChange("pro");
          navigate("/product");
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, CONFIRM_POLL_INTERVAL_MS));
      }
      setProLoading(false);
      setProError("Payment received — still confirming with the server. Refresh in a moment if this doesn't update.");
    })();
  }, [searchParams, navigate, onPlanChange]);

  async function handleFreeSelect() {
    setFreeError("");
    setFreeLoading(true);

    const res = await apiRequest("/auth/plan", {
      method: "PUT",
      body: JSON.stringify({ plan: "free" }),
    });

    if (res === null) {
      navigate("/signup");
      return;
    }

    if (!res.success) {
      setFreeError("Couldn't set your plan — try again.");
      setFreeLoading(false);
      return;
    }

    onPlanChange("free");
    navigate("/product");
  }

  async function handleProSelect() {
    setProError("");
    setProLoading(true);

    const res = await apiRequest<{ url: string }>("/api/checkout/create-session", {
      method: "POST",
    });

    if (res === null) {
      navigate("/signup");
      return;
    }

    if (res?.success && res.data?.url) {
      window.location.href = res.data.url;
      return;
    }

    setProError("Pro checkout isn't live yet — check back soon.");
    setProLoading(false);
  }

  return (
    <div className="plans-page">
      <div className="plans-header">
        <h1>Choose your plan</h1>
        <p className="lede">Start free. Upgrade any time for more reviews and detailed suggestions.</p>
      </div>

      <div className="plan-grid">
        <PlanCard
          name="Free"
          price="$0"
          tagline="Enough to check how you stack up against one role."
          features={[
            { label: "1 review per day", included: true },
            { label: "Match score", included: true },
            { label: "Missing keywords & sections", included: true },
            { label: "Improvement suggestions", included: false },
          ]}
          ctaLabel="Start Free"
          onSelect={handleFreeSelect}
          loading={freeLoading}
          error={freeError}
        />

        <PlanCard
          name="Pro"
          price="$9"
          period="/lifetime"
          tagline="For an active job search across multiple roles."
          highlight
          features={[
            { label: "5 reviews per day", included: true },
            { label: "Match score", included: true },
            { label: "Missing keywords & sections", included: true },
            { label: "Improvement suggestions", included: true },
          ]}
          ctaLabel="Go Pro"
          onSelect={handleProSelect}
          loading={proLoading}
          error={proError}
        />
      </div>
    </div>
  );
}