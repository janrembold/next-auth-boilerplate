import { getSession } from "@auth0/nextjs-auth0";
import { SessionData } from "../../components/SessionData";

export default async function Page() {
  const session = await getSession();

  return session ? (
    <SessionData />
  ) : (
    <main>
      <h1>Login</h1>
      <a href="/api/auth/login">Login</a>
    </main>
  );
}
