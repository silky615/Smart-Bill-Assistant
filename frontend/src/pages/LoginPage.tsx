import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredAccount, login, setStoredAccount } from "../api";

const DEMO = [
  { name: "Sarah Johnson", account: "123456", pin: "1234" },
  { name: "Michael Chen", account: "789012", pin: "5678" },
  { name: "Emily Rodriguez", account: "345678", pin: "9012" },
  { name: "James Wilson", account: "901234", pin: "3456" },
];

export function LoginPage() {
  const navigate = useNavigate();
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getStoredAccount()) navigate("/dashboard", { replace: true });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(accountNumber.trim(), pin.trim());
      setStoredAccount(user.accountNumber);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(account: string, p: string) {
    setAccountNumber(account);
    setPin(p);
    setError(null);
  }

  return (
    <div className="vz-login-page">
      <p className="vz-login-tagline">AI-powered bill analysis and support</p>
      <div className="vz-card vz-login-card">
        <h1 className="vz-login-title">Sign in to your account</h1>
        <form onSubmit={onSubmit} className="vz-login-form">
          <label className="vz-field">
            <span className="vz-label">Account Number</span>
            <input
              className="vz-input"
              placeholder="Enter your account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              autoComplete="username"
            />
          </label>
          <label className="vz-field">
            <span className="vz-label">PIN</span>
            <input
              className="vz-input"
              type="password"
              placeholder="Enter your 4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          {error ? (
            <div className="vz-banner vz-banner-error" role="alert">
              {error}
            </div>
          ) : null}
          <button type="submit" className="vz-btn vz-btn-primary vz-btn-block" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="vz-demo-divider">
          <span>Demo Accounts</span>
        </div>
        <div className="vz-demo-grid">
          {DEMO.map((d) => (
            <button
              key={d.account}
              type="button"
              className="vz-demo-card"
              onClick={() => fillDemo(d.account, d.pin)}
            >
              <div className="vz-demo-name">{d.name}</div>
              <div className="vz-demo-meta muted">
                Account: {d.account} | PIN: {d.pin}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
