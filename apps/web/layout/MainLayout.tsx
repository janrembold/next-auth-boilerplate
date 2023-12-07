import { ReactNode } from "react";
import styles from "./MainLayout.module.css";
import { getSession } from "@auth0/nextjs-auth0";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = async ({ children }: MainLayoutProps) => {
  const session = await getSession();

  return (
    <>
      <header className={styles.header}>
        <a href="/">NextJS + Auth0 Playground</a>
        {session ? (
          <a href="/api/auth/logout">Logout</a>
        ) : (
          <a href="/api/auth/login">Login</a>
        )}
      </header>
      <main>{children}</main>
    </>
  );
};
