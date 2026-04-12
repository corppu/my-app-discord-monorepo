import * as openidClient from "openid-client";

let oidcConfig: openidClient.Configuration | null = null;

export async function getOidcConfig(): Promise<openidClient.Configuration> {
  if (!oidcConfig) {
    const issuerUrl = process.env["OPENID_ISSUER_URL"];
    const clientId = process.env["OPENID_CLIENT_ID"];
    const clientSecret = process.env["OPENID_CLIENT_SECRET"];

    if (!issuerUrl || !clientId || !clientSecret) {
      throw new Error(
        "OPENID_ISSUER_URL, OPENID_CLIENT_ID and OPENID_CLIENT_SECRET are required"
      );
    }

    oidcConfig = await openidClient.discovery(
      new URL(issuerUrl),
      clientId,
      clientSecret
    );
  }
  return oidcConfig;
}

type TokenResponse = Awaited<ReturnType<typeof openidClient.authorizationCodeGrant>>;

export async function buildAuthUrl(state: string, nonce: string): Promise<URL> {
  const config = await getOidcConfig();
  const redirectUri = process.env["OPENID_REDIRECT_URI"];
  if (!redirectUri) throw new Error("OPENID_REDIRECT_URI is required");

  return openidClient.buildAuthorizationUrl(config, {
    redirect_uri: redirectUri,
    scope: "openid email profile",
    state,
    nonce,
  });
}

export async function exchangeCode(
  code: string,
  state: string,
  expectedState: string,
  nonce: string
): Promise<TokenResponse> {
  const config = await getOidcConfig();
  const redirectUri = process.env["OPENID_REDIRECT_URI"];
  if (!redirectUri) throw new Error("OPENID_REDIRECT_URI is required");

  const currentUrl = new URL(redirectUri);
  currentUrl.searchParams.set("code", code);
  currentUrl.searchParams.set("state", state);

  return openidClient.authorizationCodeGrant(config, currentUrl, {
    expectedState,
    expectedNonce: nonce,
    idTokenExpected: true,
  });
}

export async function refreshTokens(
  refreshToken: string
): Promise<TokenResponse> {
  const config = await getOidcConfig();
  return openidClient.refreshTokenGrant(config, refreshToken);
}
