import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BillBundle, fetchBillSummary, fetchMe } from "../api";
import { AppHeader } from "../components/AppHeader";
import { HelpFab } from "../components/HelpFab";
import { IconBack, IconDoc, IconSparkle } from "../components/Icons";

export function AISummaryPage() {
  const [bill, setBill] = useState<BillBundle | null>(null);
  const [lang, setLang] = useState<"en" | "es">("en");
  const [bullets, setBullets] = useState<string[]>([]);
  const [source, setSource] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const b = await fetchMe();
      setBill(b);
      const s = await fetchBillSummary(lang);
      setBullets(s.bullets);
      setSource(s.source);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load summary");
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  const warnings = bill?.charges.filter((c) => c.variant === "warning") ?? [];

  if (!bill) {
    return (
      <div className="vz-page">
        <div className="vz-page-inner vz-loading">
          {error ? <div className="vz-banner vz-banner-error">{error}</div> : <div className="vz-spinner" />}
        </div>
      </div>
    );
  }

  return (
    <div className="vz-page">
      <div className="vz-page-inner vz-page-wide">
        <AppHeader name={bill.profile.name} />
        <div className="vz-summary-top">
          <Link to="/dashboard" className="vz-back-link">
            <IconBack />
            Back to Dashboard
          </Link>
          <div className="vz-summary-head-row">
            <div>
              <h1 className="vz-h1">AI Bill Summary</h1>
              <p className="muted">Plain English explanation of your charges</p>
            </div>
            <button
              type="button"
              className="vz-lang-toggle"
              onClick={() => setLang((l) => (l === "en" ? "es" : "en"))}
            >
              {lang === "en" ? "Español" : "English"}
            </button>
          </div>
        </div>

        {error ? <div className="vz-banner vz-banner-error">{error}</div> : null}

        <section className="vz-card vz-ai-summary-card">
          <div className="vz-title-icon">
            <IconSparkle className="vz-red-icon" />
            <h2 className="vz-card-heading plain">AI Summary</h2>
          </div>
          {loading ? (
            <p className="muted">Generating summary…</p>
          ) : (
            <ul className="vz-ai-bullets">
              {bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
          <button type="button" className="vz-link-regenerate" disabled={loading} onClick={() => void loadSummary()}>
            Regenerate summary
          </button>
          {source ? (
            <p className="muted tiny vz-mt-sm">
              {source === "groq" ? "Powered by Groq" : "Demo fallback (add GROQ_API_KEY for live AI)"}
            </p>
          ) : null}
        </section>

        <section className="vz-card vz-unusual-card">
          <div className="vz-title-icon">
            <span className="vz-warn-circle" aria-hidden>
              !
            </span>
            <h2 className="vz-card-heading plain">Unusual Charges Detected</h2>
          </div>
          <div className="vz-unusual-list">
            {warnings.map((w) => (
              <div key={w.id} className="vz-unusual-item">
                <div className="vz-charge-row">
                  <strong>{w.title}</strong>
                  <strong>${w.amount.toFixed(2)}</strong>
                </div>
                <p className="muted small vz-mb-0">{w.warningDetail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="vz-card vz-detailed-row">
          <div className="vz-title-icon">
            <IconDoc className="vz-red-icon" />
            <h2 className="vz-card-heading plain">Detailed View</h2>
          </div>
          <Link to="/bill/raw" className="vz-text-link-red">
            Show raw bill
          </Link>
        </section>
      </div>
      <HelpFab />
    </div>
  );
}
