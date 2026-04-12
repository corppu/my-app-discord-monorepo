import type { JSX } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "@my-app/react";

export function HomePage(): JSX.Element {
  const { isAuthenticated } = useAuthContext();

  return (
    <div>
      <h1>Welcome to My App</h1>
      {isAuthenticated ? (
        <Link to="/dashboard">Go to Dashboard</Link>
      ) : (
        <Link to="/login">Sign In</Link>
      )}
    </div>
  );
}
