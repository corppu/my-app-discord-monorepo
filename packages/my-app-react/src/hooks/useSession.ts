import { useState, useCallback, useEffect } from "react";
import type { SessionDTO } from "@my-app/common";

export interface SessionState {
  session: SessionDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useSession(): SessionState & {
  setSession: (session: SessionDTO | null) => void;
  clearSession: () => void;
  isSessionExpired: () => boolean;
} {
  const [session, setSessionState] = useState<SessionDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const setSession = useCallback((newSession: SessionDTO | null) => {
    setSessionState(newSession);
  }, []);

  const clearSession = useCallback(() => {
    setSessionState(null);
  }, []);

  const isSessionExpired = useCallback((): boolean => {
    if (!session) return true;
    return session.expiresAt < new Date();
  }, [session]);

  return {
    session,
    isAuthenticated: session !== null && !isSessionExpired(),
    isLoading,
    setSession,
    clearSession,
    isSessionExpired,
  };
}
