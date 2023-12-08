/* eslint-disable turbo/no-undeclared-env-vars */
import { getSession } from "@auth0/nextjs-auth0";

export const SessionData = async () => {
  const session = await getSession();
  const accessToken = session?.accessToken;

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/private`;
  let data = { message: "nothing-found" };

  if (accessToken) {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      data = await response.json();
    } catch (error) {
      data = { message: error.message };
    }
  }

  return (
    <main>
      <h1>Session Playground</h1>
      <h2>Access Token</h2>
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
      <h2>Session</h2>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <h2>API Response</h2>
      <pre>
        API: {url}
        <br />
        <br />
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
};
