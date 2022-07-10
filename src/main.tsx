import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { UsersProvider } from "@/contexts/userContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <UsersProvider>
    <App />
  </UsersProvider>
);
