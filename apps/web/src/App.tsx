import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { LoginButton } from "./components/LoginButton";
import { useAuth0 } from "@auth0/auth0-react";
import { LogoutButton } from "./components/LogoutButton";
import { FetchTest } from "./components/FetchTest";

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      {isAuthenticated ? <LogoutButton /> : <LoginButton />}

      <FetchTest />

      {user ? <pre>{JSON.stringify(user, null, 2)}</pre> : null}
    </>
  );
}

export default App;
