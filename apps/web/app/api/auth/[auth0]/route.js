import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      audience: "https://jr-freelance.eu.auth0.com/api/v2/",
      scope: "openid profile email read:products offline_access",
    },
  }),
});
