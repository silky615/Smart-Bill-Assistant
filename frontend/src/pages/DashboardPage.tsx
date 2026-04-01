import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BillBundle, fetchMe, money } from "../api";
import { AppHeader } from "../components/AppHeader";
import { HelpFab } from "../components/HelpFab";
import { IconCalendar, IconChart, IconChat, IconData, IconDoc, IconDollar } from "../components/Icons";

export function DashboardPage() {
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

  if (error) {
    return (
      <div className="vz-page">
        <div className="vz-page-inner">
          <p className="vz-banner vz-banner-error">{error}</p>
          <Link to="/login">Back to sign in</Link>
        </div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="vz-page vz-loading">
        <div className="vz-spinner" />
      </div>
    );
  }

  const pct = Math.min(100, (bill.dataUsage.usedGb / bill.dataUsage.totalGb) * 100);

  return (
    <div className="vz-page">
      <div className="vz-page-inner vz-page-wide">
        <AppHeader name={bill.profile.name} />

        {bill.billing?.isPaid ? (
          <div className="vz-paid-banner">
            <strong>Payment received</strong>
            <span className="muted small">
              Your {bill.billMonth} balance is paid. Thank you.
              {bill.billing.recentPayments?.[0]?.id ? ` Ref: ${bill.billing.recentPayments[0].id}` : null}
            </span>
          </div>
        ) : null}

        <div className="vz-alert-bar">
          <div>
            <strong>{bill.alertBanner.title}</strong>
            <div className="muted small">{bill.alertBanner.body}</div>
          </div>
          <Link to="/bill" className="vz-link-action">
            {bill.alertBanner.actionLabel}
          </Link>
        </div>

        <section className="vz-card vz-account-card">
          <div className="vz-account-card-top">
            <div>
              <h2 className="vz-card-heading plain">Account Overview</h2>
              <p className="muted small">Account #{bill.profile.accountNumber}</p>
            </div>
            <div className="vz-current-bill">
              <div className="vz-current-bill-amount">{money(bill.totals.current)}</div>
              <div className="muted small">Current Bill</div>
            </div>
          </div>
          <div className="vz-account-grid">
            <div>
              <div className="vz-kicker">Plan</div>
              <div className="vz-kicker-val">{bill.profile.plan}</div>
            </div>
            <div>
              <div className="vz-kicker">Address</div>
              <div className="vz-kicker-val">{bill.profile.address}</div>
            </div>
            <div>
              <div className="vz-kicker">Due Date</div>
              <div className="vz-kicker-val">{bill.profile.dueDate}</div>
            </div>
          </div>
        </section>

        <section className="vz-card">
          <div className="vz-row-spread">
            <div className="vz-title-icon">
              <IconData className="vz-red-icon" />
              <h2 className="vz-card-heading plain">Data Usage</h2>
            </div>
            <span className="muted">
              {bill.dataUsage.usedGb}GB / {bill.dataUsage.totalGb}GB
            </span>
          </div>
          <div className="vz-progress">
            <div className="vz-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <p className="muted small vz-mt-sm">{bill.dataUsage.note}</p>
        </section>

        <section className="vz-action-grid">
          <Link to="/bill" className="vz-action-tile">
            <IconDoc className="vz-red-icon" />
            <div className="vz-action-title">Bill Details</div>
            <div className="muted small">View all charges</div>
          </Link>
          <Link to="/summary" className="vz-action-tile">
            <IconChart className="vz-red-icon" />
            <div className="vz-action-title">AI Summary</div>
            <div className="muted small">Get bill explained</div>
          </Link>
          <Link to="/chat" className="vz-action-tile">
            <IconChat className="vz-red-icon" />
            <div className="vz-action-title">Chat Support</div>
            <div className="muted small">Ask questions</div>
          </Link>
          <Link to="/payment" className="vz-action-tile">
            <IconCalendar className="vz-red-icon" />
            <div className="vz-action-title">Payment</div>
            <div className="muted small">Make a payment</div>
          </Link>
        </section>

        <section className="vz-card" id="comparison">
          <div className="vz-title-icon">
            <IconDollar className="vz-red-icon" />
            <h2 className="vz-card-heading plain">Bill Comparison</h2>
          </div>
          <div className="vz-compare-row">
            <div className="vz-compare-cell">
              <div className="muted small">Last Month</div>
              <div className="vz-compare-amt">{money(bill.totals.lastMonth)}</div>
            </div>
            <div className="vz-compare-cell highlight">
              <div className="vz-compare-label-red small">This Month</div>
              <div className="vz-compare-amt red">{money(bill.totals.current)}</div>
            </div>
            <div className="vz-compare-cell">
              <div className="muted small">Difference</div>
              <div
                className={`vz-compare-amt ${bill.totals.difference !== 0 ? "red" : ""}`}
              >
                {bill.totals.difference === 0
                  ? money(0)
                  : `${bill.totals.difference > 0 ? "+" : "−"}${money(Math.abs(bill.totals.difference))}`}
              </div>
            </div>
          </div>
          <p className="muted small vz-mt-md">{bill.comparisonFootnote}</p>
          <div className="vz-inline-actions">
            <Link to="/bill" className="vz-btn vz-btn-secondary">
              View Full Details
            </Link>
            <Link to="/chat" className="vz-btn vz-btn-primary">
              Ask Questions
            </Link>
          </div>
        </section>
      </div>
      <HelpFab />
    </div>
  );
}
