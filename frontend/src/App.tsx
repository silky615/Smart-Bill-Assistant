import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { getStoredAccount } from "./api";
import { AISummaryPage } from "./pages/AISummaryPage";
import { BillDetailsPage } from "./pages/BillDetailsPage";
import { ChatPage } from "./pages/ChatPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { PaymentPage } from "./pages/PaymentPage";
import { RawBillPage } from "./pages/RawBillPage";

function ProtectedLayout() {
  if (!getStoredAccount()) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function RootRedirect() {
  return <Navigate to={getStoredAccount() ? "/dashboard" : "/login"} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/bill" element={<BillDetailsPage />} />
          <Route path="/bill/raw" element={<RawBillPage />} />
          <Route path="/summary" element={<AISummaryPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/payment" element={<PaymentPage />} />
        </Route>
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
