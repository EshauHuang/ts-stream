import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.scss";

import { UsersProvider } from "@/contexts/userContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <UsersProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
  </UsersProvider>
);
