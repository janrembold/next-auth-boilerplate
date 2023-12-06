import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  callbacks: {
    async signIn({ user, credentials }) {
      console.log("signIn", user, credentials);
      return true;
    },
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        console.log("credentials", credentials);

        try {
          const user = await prisma.user.findUnique({
            where: {
              id: credentials.username as string,
            },
          });

          if (user) {
            return user;
          }
        } catch (error) {
          // throw new Error(
          //   "WTF! Something went wrong with your login. Please try again."
          // );
          return null;
        }

        // // Return null if user data could not be retrieved
        // return null;

        // return {
        //   id: "1",
        //   name: "J Smith",
        //   email: "teo@example.com",
        // };
        return null;
      },
    }),
  ],
  // callbacks: {
  //   async signIn({ user }) {
  //     let isAllowedToSignIn = true;
  //     const allowedUser = ["YOURGITHUBACCID"];

  //     console.log(
  //       "signIn callback [src/app/api/auth/[...nextauth]/auth.ts]",
  //       user
  //     );

  //     if (allowedUser.includes(String(user.id))) {
  //       isAllowedToSignIn = true;
  //     } else {
  //       isAllowedToSignIn = false;
  //     }
  //     return isAllowedToSignIn;
  //   },
  // },
});
