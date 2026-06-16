import { BrowserRouter, Routes, Route } from "react-router-dom";
import type { JSX } from "react";
import { AuthProvider } from "@my-app/react";
import { HomePage } from "./pages/HomePage.js";
import { LoginPage } from "./pages/LoginPage.js";
import { CallbackPage } from "./pages/CallbackPage.js";
import { DashboardPage } from "./pages/DashboardPage.js";

export function App(): JSX.Element {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<CallbackPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
