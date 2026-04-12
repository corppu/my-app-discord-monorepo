import { View, StyleSheet } from "react-native";
import type { JSX } from "react";
import WebView from "react-native-webview";
import { useAuthContext } from "@my-app/react";
import { useBackgroundPolling } from "../background/BackgroundPolling.js";

const WEB_APP_URL = process.env["MY_APP_WEB_URL"] ?? "http://localhost:8080";

export function MainScreen(): JSX.Element {
  const { session, setSession } = useAuthContext();

  useBackgroundPolling(session?.jwtToken ?? null, (updatedSession) => {
    if (updatedSession) {
      setSession(updatedSession);
    } else {
      setSession(null);
    }
  });

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: WEB_APP_URL }}
        style={styles.webview}
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
