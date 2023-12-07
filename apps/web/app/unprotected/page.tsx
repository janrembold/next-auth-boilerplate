import { getSession } from "@auth0/nextjs-auth0";

export default async function Page() {
  const session = await getSession();

  return session ? (
    <main>
      <h1>Profile</h1>
      <h2>Page:</h2>
      <h3>Access Token</h3>
      <pre>
        {JSON.stringify({ accessToken: session?.accessToken }, null, 2)}
      </pre>
      <h3>User</h3>
      <pre>{JSON.stringify(session?.user, null, 2)}</pre>
      <a href="/api/auth/logout">Logout</a>
    </main>
  ) : (
    <main>
      <h1>Login</h1>
      <a href="/api/auth/login">Login</a>
    </main>
  );
}
