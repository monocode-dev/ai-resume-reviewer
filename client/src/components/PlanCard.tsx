interface PlanFeature {
  label: string;
  included: boolean;
}

interface PlanCardProps {
  name: string;
  price: string;
  period?: string;
  tagline: string;
  features: PlanFeature[];
  ctaLabel: string;
  onSelect: () => void;
  highlight?: boolean;
  loading?: boolean;
  error?: string;
}

export default function PlanCard({
  name,
  price,
  period,
  tagline,
  features,
  ctaLabel,
  onSelect,
  highlight = false,
  loading = false,
  error,
}: PlanCardProps) {
  return (
    <div className={`plan-card${highlight ? ' highlight' : ''}`}>
      <div className="plan-card-head">
        <h3>{name}</h3>
      </div>

      <p className="plan-tagline">{tagline}</p>

      <div className="plan-price">
        <span className="plan-price-value">{price}</span>
        {period && <span className="plan-price-period">{period}</span>}
      </div>

      <ul className="plan-features">
        {features.map((feature) => (
          <li key={feature.label}>
            <span className={`mock-dot${feature.included ? (highlight ? ' accent' : ' good') : ''}`} />
            <span className={feature.included ? '' : 'plan-feature-muted'}>{feature.label}</span>
          </li>
        ))}
      </ul>

      <button
        className="btn btn-primary plan-cta"
        onClick={onSelect}
        disabled={loading}
      >
        {loading ? <span className="spinner" /> : ctaLabel}
      </button>

      {error && <p className="notice plan-error">{error}</p>}
    </div>
  );
}