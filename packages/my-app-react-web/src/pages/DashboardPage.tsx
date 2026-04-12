import type { JSX } from "react";
import { useAuthContext } from "@my-app/react";
import { useNavigate } from "react-router-dom";

export function DashboardPage(): JSX.Element {
  const { session, isAuthenticated, clearSession } = useAuthContext();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate("/login");
    return <div>Redirecting...</div>;
  }

  const handleLogout = (): void => {
    fetch("/api/auth/logout", { method: "POST" })
      .finally(() => {
        clearSession();
        navigate("/");
      });
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>User ID: {session?.userId}</p>
      <button onClick={handleLogout}>Sign Out</button>
    </div>
  );
}
