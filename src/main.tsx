import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";

import { UsersProvider } from "@/contexts/userContext";
import { MessagesProvider } from "@/contexts/messagesContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <UsersProvider>
    <MessagesProvider>
      <App />
    </MessagesProvider>
  </UsersProvider>
);
