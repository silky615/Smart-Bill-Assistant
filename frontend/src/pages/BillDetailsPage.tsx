import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BillBundle, fetchMe, money } from "../api";
import { AppHeader } from "../components/AppHeader";
import { HelpFab } from "../components/HelpFab";
import { IconBack, IconDollar, IconWarning } from "../components/Icons";

function badgeClass(tone: string) {
  if (tone === "blue") return "vz-badge vz-badge-blue";
  if (tone === "purple") return "vz-badge vz-badge-purple";
  if (tone === "orange") return "vz-badge vz-badge-orange";
  return "vz-badge vz-badge-gray";
}

export function BillDetailsPage() {
  const [bill, setBill] = useState<BillBundle | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const b = await fetchMe();
        if (!cancelled) setBill(b);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error || !bill) {
    return (
      <div className="vz-page">
        <div className="vz-page-inner">
          {error ? <p className="vz-banner vz-banner-error">{error}</p> : <div className="vz-spinner" />}
          <Link to="/dashboard">Back</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="vz-page">
      <div className="vz-page-inner vz-page-wide">
        <AppHeader name={bill.profile.name} />
        <Link to="/dashboard" className="vz-back-link">
          <IconBack />
          Back to Dashboard
        </Link>

        <header className="vz-page-title-row">
          <div>
            <h1 className="vz-h1">Bill Details</h1>
            <p className="muted">{bill.billMonth}</p>
          </div>
          <div className="vz-total-due">
            <div className="vz-total-due-amt">{money(bill.totals.current)}</div>
            <div className="muted small">Total Due</div>
          </div>
        </header>
        <hr className="vz-divider" />

        <div className="vz-section-head">
          <div className="vz-title-icon">
            <IconDollar className="vz-red-icon" />
            <h2 className="vz-card-heading plain">Charges Breakdown</h2>
          </div>
          <Link to="/dashboard#comparison" className="vz-btn-outline">
            <span className="vz-refresh-icon" aria-hidden />
            Show Comparison
          </Link>
        </div>

        <div className="vz-stack">
          {bill.charges.map((c) =>
            c.variant === "warning" ? (
              <article key={c.id} className="vz-card vz-charge-warning">
                <div className="vz-charge-row">
                  <div className="vz-charge-title-row">
                    <strong>{c.title}</strong>
                    <IconWarning className="vz-warn-tri" />
                  </div>
                  <strong>{money(c.amount)}</strong>
                </div>
                <span className={badgeClass(c.badgeTone)}>{c.badge}</span>
                <div className="vz-nested-warn">
                  <IconWarning className="vz-warn-tri" />
                  <div>
                    <strong>{c.warningTitle}</strong>
                    <p className="muted small vz-mb-0">{c.warningDetail}</p>
                  </div>
                </div>
              </article>
            ) : (
              <article key={c.id} className="vz-card vz-charge">
                <div className="vz-charge-row">
                  <strong>{c.title}</strong>
                  <strong>{money(c.amount)}</strong>
                </div>
                <span className={badgeClass(c.badgeTone)}>{c.badge}</span>
              </article>
            )
          )}
        </div>
      </div>
      <HelpFab />
    </div>
  );
}
