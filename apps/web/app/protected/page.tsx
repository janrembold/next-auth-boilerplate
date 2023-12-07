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

    if (accessToken) {
      try {
        const response = await fetch("http://localhost:4000/api/private", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log("Data:", data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
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
      </main>
    );
  },
  { returnTo: "/" }
);
