import type { Request, Response, NextFunction } from "express";
import { randomBytes } from "crypto";

const CSRF_HEADER = "x-csrf-token";
const CSRF_COOKIE = "csrf_token";
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * CSRF protection using the double-submit cookie pattern.
 * On GET requests, sets a CSRF cookie.
 * On state-changing requests (POST/PUT/PATCH/DELETE), validates the
 * X-CSRF-Token header matches the cookie value.
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  const isSecure = process.env["NODE_ENV"] === "production";

  if (SAFE_METHODS.has(req.method)) {
    const existingToken = req.cookies?.[CSRF_COOKIE] as string | undefined;
    if (!existingToken) {
      const token = randomBytes(32).toString("hex");
      res.cookie(CSRF_COOKIE, token, {
        httpOnly: false,
        secure: isSecure,
        sameSite: "strict",
        path: "/",
      });
    }
    next();
    return;
  }

  const cookieToken = req.cookies?.[CSRF_COOKIE] as string | undefined;
  const headerToken = req.headers[CSRF_HEADER] as string | undefined;

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    res.status(403).json({ error: "Invalid CSRF token" });
    return;
  }

  next();
}
