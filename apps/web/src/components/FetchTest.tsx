import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

export const FetchTest = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return;
    }

    console.log("fetching data");

    const fetchData = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: "https://jr-freelance.eu.auth0.com/api/v2/",
            scope: "read:current_user",
          },
        });

        console.log({ accessToken });

        const url = "https://localhost:4000/public";
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

        const data = await response.json();
        console.log({ data });
      } catch (error: any) {
        console.log({ error: error.message });
      }
    };

    fetchData();
  }, [isLoading, isAuthenticated, getAccessTokenSilently]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (!isAuthenticated) {
    return <div>Not authenticated</div>;
  }

  return <div>Authenticated</div>;
};
