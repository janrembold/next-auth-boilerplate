import { UserProvider } from "@auth0/nextjs-auth0/client";
import { MainLayout } from "../layout/MainLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <MainLayout>{children}</MainLayout>
        </UserProvider>
      </body>
    </html>
  );
}
