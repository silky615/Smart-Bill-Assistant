import { useNavigate } from "react-router-dom";
import { IconBrand } from "./Icons";
import { setStoredAccount } from "../api";

export function AppHeader({ name }: { name: string }) {
  const navigate = useNavigate();
  return (
    <header className="vz-app-header">
      <div className="vz-app-header-left">
        <IconBrand />
        <div>
          <div className="vz-app-header-title">Verizon Assistant</div>
          <div className="vz-app-header-sub muted">{name}</div>
        </div>
      </div>
      <button
        type="button"
        className="vz-btn-signout"
        onClick={() => {
          setStoredAccount(null);
          navigate("/login", { replace: true });
        }}
      >
        Sign Out
      </button>
    </header>
  );
}
