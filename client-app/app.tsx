import React from "react";
import { store } from "@/state/store";
import { Provider } from "react-redux";
import { App } from "expo-router/build/qualified-entry";

function ReactApp() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

export default ReactApp;
