import type { JSX } from "react";

export function LoginPage(): JSX.Element {
  const handleLogin = (): void => {
    window.location.href = "/api/auth/login";
  };

  return (
    <div>
      <h1>Sign In</h1>
      <button onClick={handleLogin}>Sign in with OpenID</button>
    </div>
  );
}
