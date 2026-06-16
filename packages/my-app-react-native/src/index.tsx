import { AppRegistry } from "react-native";
import type { JSX } from "react";
import { AuthProvider } from "@my-app/react";
import { MainScreen } from "./screens/MainScreen.js";
import { registerHeadlessTask } from "./background/BackgroundPolling.js";

function App(): JSX.Element {
  return (
    <AuthProvider>
      <MainScreen />
    </AuthProvider>
  );
}

AppRegistry.registerComponent("MyApp", () => App);
registerHeadlessTask();
