import { NotLoggedIn } from "@/components/NotLoggedIn/NotLoggedIn";
import { auth } from "../api/auth/[...nextauth]/auth";

export default async function Home() {
  const session = await auth();

  if (!session) {
    return <NotLoggedIn />;
  }

  return (
    <div>
      <h2>My Amazing App</h2>

      <div>
        <p>Signed in as {session.user?.name}</p>
        <a href="/api/auth/signout">Sign out by link</a>
      </div>
    </div>
  );
}
