import { useEffect } from "react";
import type { JSX } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "@my-app/react";
import { SessionDTOBuilder } from "@my-app/common";

export function CallbackPage(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setSession } = useAuthContext();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      navigate("/login");
      return;
    }

    fetch(`/api/auth/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`)
      .then((res) => res.json())
      .then((data: unknown) => {
        if (data && typeof data === "object") {
          const d = data as Record<string, unknown>;
          const session = new SessionDTOBuilder()
            .setId(String(d["id"] ?? ""))
            .setUserId(String(d["userId"] ?? ""))
            .setAccessToken(String(d["accessToken"] ?? ""))
            .setRefreshToken(String(d["refreshToken"] ?? ""))
            .setExpiresAt(new Date(String(d["expiresAt"] ?? "")))
            .setCreatedAt(new Date(String(d["createdAt"] ?? "")))
            .setUpdatedAt(new Date(String(d["updatedAt"] ?? "")))
            .build();
          setSession(session);
          navigate("/dashboard");
        }
      })
      .catch(() => navigate("/login"));
  }, [searchParams, navigate, setSession]);

  return <div>Processing authentication...</div>;
}
