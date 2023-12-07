"use client";
import { getAccessToken } from "@auth0/nextjs-auth0";
// import useAxios from "axios-hooks";
import { useState } from "react";
import { auth0Axios } from "../../lib/axiosInstance";

export const DataLoader = async () => {
  const [loading, setLoading] = useState(true);
  const { accessToken } = await getAccessToken();
  auth0Axios.get("/api/private").then((res) => console.log(res.data));
  //   const [{ data, loading, error }] = useAxios(
  //     "http://localhost:4000/api/private"
  //   );

  //   useEffect(() => {
  //     setLoading(false);
  //   }, [accessToken]);

  if (loading) return <p>Loading...</p>;
  //   if (error) return <p>Error!</p>;

  return <div>{/* <pre>{JSON.stringify(data || {}, null, 2)}</pre> */}</div>;
};
