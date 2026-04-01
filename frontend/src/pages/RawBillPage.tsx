import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMe, fetchRawBill } from "../api";
import { AppHeader } from "../components/AppHeader";
import { HelpFab } from "../components/HelpFab";
import { IconBack } from "../components/Icons";

export function RawBillPage() {
  const [name, setName] = useState("");
  const [raw, setRaw] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let c = false;
    void (async () => {
      try {
        const [me, data] = await Promise.all([fetchMe(), fetchRawBill()]);
        if (!c) {
          setName(me.profile.name);
          setRaw(JSON.stringify(data, null, 2));
        }
      } catch (e) {
        if (!c) setError(e instanceof Error ? e.message : "Failed to load");
      }
    })();
    return () => {
      c = true;
    };
  }, []);

  return (
    <div className="vz-page">
      <div className="vz-page-inner vz-page-wide">
        {name ? <AppHeader name={name} /> : null}
        <Link to="/summary" className="vz-back-link">
          <IconBack />
          Back to AI Summary
        </Link>
        <h1 className="vz-h1">Raw bill (JSON)</h1>
        <p className="muted small vz-mb-md">Served from <code className="vz-code">GET /api/bills/raw</code></p>
        {error ? <div className="vz-banner vz-banner-error">{error}</div> : null}
        {raw ? (
          <pre className="vz-raw-json">{raw}</pre>
        ) : !error ? (
          <div className="vz-spinner" />
        ) : null}
      </div>
      <HelpFab />
    </div>
  );
}
