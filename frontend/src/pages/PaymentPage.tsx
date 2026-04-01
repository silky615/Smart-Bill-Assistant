import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BillBundle, fetchMe, money, postPayment } from "../api";
import { AppHeader } from "../components/AppHeader";
import { HelpFab } from "../components/HelpFab";
import { IconBack, IconWarning } from "../components/Icons";

export function PaymentPage() {
  const navigate = useNavigate();
  const [bill, setBill] = useState<BillBundle | null>(null);
  const [paying, setPaying] = useState(false);
  const [payErr, setPayErr] = useState<string | null>(null);

  async function reload() {
    try {
      setBill(await fetchMe());
    } catch {
      setBill(null);
    }
  }

  useEffect(() => {
    let c = false;
    void (async () => {
      try {
        const b = await fetchMe();
        if (!c) setBill(b);
      } catch {
        if (!c) setBill(null);
      }
    })();
    return () => {
      c = false;
    };
  }, []);

  if (!bill) {
    return (
      <div className="vz-page vz-loading">
        <div className="vz-spinner" />
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

        {bill.billing?.isPaid ? (
          <div className="vz-paid-banner">
            <strong>This statement is paid</strong>
            <span className="muted small">No further action needed for {bill.billMonth}.</span>
          </div>
        ) : null}

        {bill.dataUsage.overageBanner?.trim() ? (
          <div className="vz-banner vz-banner-warn flex-row">
            <IconWarning className="vz-warn-tri" />
            <span>{bill.dataUsage.overageBanner}</span>
          </div>
        ) : null}

        <section className="vz-card vz-charge">
          <div className="vz-charge-row">
            <div>
              <strong>Taxes & Fees</strong>
              <div className="vz-mt-sm">
                <span className="vz-badge vz-badge-gray">Tax</span>
              </div>
            </div>
            <strong>{money(bill.totals.taxes)}</strong>
          </div>
        </section>

        <section className="vz-card">
          <h2 className="vz-card-heading plain vz-mb-md">Order Summary &amp; Payment</h2>
          <div className="vz-order-lines">
            <div className="vz-order-line">
              <span>Subtotal</span>
              <span>{money(bill.totals.subtotal)}</span>
            </div>
            <div className="vz-order-line">
              <span>Taxes & Fees</span>
              <span>{money(bill.totals.taxes)}</span>
            </div>
          </div>
          <hr className="vz-divider" />
          <div className="vz-order-total">
            <span className="strong">Total Due</span>
            <span className="vz-order-total-amt">{money(bill.totals.current)}</span>
          </div>
          <div className="vz-due-inline">
            <span className="muted small">Due Date</span>
            <span className="small">{bill.profile.dueDate}</span>
          </div>
          {payErr ? (
            <div className="vz-banner vz-banner-error vz-mt-sm" role="alert">
              {payErr}
            </div>
          ) : null}
          <button
            type="button"
            className="vz-btn vz-btn-primary vz-btn-block vz-mt-md"
            disabled={paying || bill.billing?.isPaid}
            onClick={() => {
              setPayErr(null);
              setPaying(true);
              void (async () => {
                try {
                  await postPayment();
                  await reload();
                  navigate("/dashboard");
                } catch (e) {
                  setPayErr(e instanceof Error ? e.message : "Payment failed");
                } finally {
                  setPaying(false);
                }
              })();
            }}
          >
            {bill.billing?.isPaid ? "Paid" : paying ? "Processing…" : "Pay Now"}
          </button>
        </section>

        <section className="vz-ai-support-card">
          <h3 className="vz-ai-support-title">Questions about your bill?</h3>
          <p className="vz-ai-support-body">
            Our AI assistant can explain any charge or help you understand your bill better.
          </p>
          <Link to="/chat" className="vz-btn vz-btn-blue">
            Ask AI Assistant
          </Link>
        </section>
      </div>
      <HelpFab />
    </div>
  );
}
