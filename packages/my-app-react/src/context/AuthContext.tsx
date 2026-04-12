import { createContext, useContext, type ReactNode, type JSX, useState, useCallback } from "react";
import type { SessionDTO } from "@my-app/common";

interface AuthContextValue {
  session: SessionDTO | null;
  isAuthenticated: boolean;
  setSession: (session: SessionDTO | null) => void;
  clearSession: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [session, setSessionState] = useState<SessionDTO | null>(null);

  const setSession = useCallback((newSession: SessionDTO | null) => {
    setSessionState(newSession);
  }, []);

  const clearSession = useCallback(() => {
    setSessionState(null);
  }, []);

  const isAuthenticated = session !== null && session.expiresAt > new Date();

  return (
    <AuthContext.Provider value={{ session, isAuthenticated, setSession, clearSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return ctx;
}
