import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain="jr-freelance.eu.auth0.com"
    clientId="qxG3bmyOlpDLrAYxFI8Fx8fuLuHW83Tg"
    authorizationParams={{
      scope: "read:current_user",
      redirect_uri: window.location.origin,
    }}
  >
    <App />
  </Auth0Provider>
);
