import { useEffect, useCallback } from "react";
import { AppRegistry } from "react-native";
import BackgroundFetch from "react-native-background-fetch";
import type { SessionDTO } from "@my-app/common";

const API_BASE_URL = process.env["MY_APP_API_URL"] ?? "http://localhost:3000";

async function pollSession(jwtToken: string): Promise<SessionDTO | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/native/session`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as Record<string, unknown>;
    return data as unknown as SessionDTO;
  } catch {
    return null;
  }
}

export function useBackgroundPolling(
  jwtToken: string | null,
  onSessionUpdate: (session: SessionDTO | null) => void
): { startPolling: () => void; stopPolling: () => void } {
  const handleBackgroundTask = useCallback(
    async (taskId: string) => {
      if (!jwtToken) {
        BackgroundFetch.finish(taskId);
        return;
      }

      const session = await pollSession(jwtToken);
      onSessionUpdate(session);
      BackgroundFetch.finish(taskId);
    },
    [jwtToken, onSessionUpdate]
  );

  useEffect(() => {
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15,
        enableHeadless: true,
        startOnBoot: true,
        stopOnTerminate: false,
      },
      handleBackgroundTask,
      (taskId) => {
        BackgroundFetch.finish(taskId);
      }
    ).catch(() => {
      // Background fetch not supported
    });

    return () => {
      BackgroundFetch.stop().catch(() => undefined);
    };
  }, [handleBackgroundTask]);

  const startPolling = useCallback(() => {
    BackgroundFetch.start().catch(() => undefined);
  }, []);

  const stopPolling = useCallback(() => {
    BackgroundFetch.stop().catch(() => undefined);
  }, []);

  return { startPolling, stopPolling };
}

export function registerHeadlessTask(): void {
  AppRegistry.registerHeadlessTask("ReactNativeBackgroundFetch", () => async (event: { taskId: string }) => {
    const { taskId } = event;
    BackgroundFetch.finish(taskId);
  });
}
