import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/client";
import PlanCard from "../components/PlanCard";

interface PlanPageProps {
  onPlanChange: (plan: "free" | "pro") => void;
}

export default function PlanPage({ onPlanChange }: PlanPageProps) {
  const navigate = useNavigate();
  const [freeLoading, setFreeLoading] = useState(false);
  const [freeError, setFreeError] = useState("");
  const [proLoading, setProLoading] = useState(false);
  const [proError, setProError] = useState("");

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

    // TODO: /api/checkout/create-session
    const res = await apiRequest<{ url: string }>("/api/checkout/create-session", {
      method: "POST",
      body: JSON.stringify({ plan: "pro" }),
    });

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