/* eslint-disable turbo/no-undeclared-env-vars */
import {
  getSession,
  touchSession,
  withPageAuthRequired,
} from "@auth0/nextjs-auth0";

export default withPageAuthRequired(
  async function Page() {
    await touchSession();
    const session = await getSession();
    const accessToken = session?.accessToken;
    let data = "nothing-found";

    if (accessToken) {
      try {
        const response = await fetch(
          `https://next-auth-fullstack-uw7g4.ondigitalocean.app/backend/private`,
          // `${process.env.NEXT_PUBLIC_BASE_URL}/backend/private`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        data = await response.json();
      } catch (error) {
        data = error.message;
      }
    }

    return (
      <main>
        <h1>Profile</h1>
        <h3>Access Token</h3>
        <pre>
          {JSON.stringify(
            {
              accessToken: session.accessToken,
              accessTokenExpiresAt: new Date(
                session.accessTokenExpiresAt * 1000
              ).toLocaleString(),
            },
            null,
            2
          )}
        </pre>
        <h3>User</h3>
        <pre>{JSON.stringify(session?.user, null, 2)}</pre>
        <h3>API Response</h3>
        <pre>{data}</pre>
      </main>
    );
  },
  { returnTo: "/" }
);
