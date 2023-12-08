import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      audience: "https://next-auth-fullstack-uw7g4.ondigitalocean.app",
      scope: "openid profile email offline_access",
    },
  }),
});
