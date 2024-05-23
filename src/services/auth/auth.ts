import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { handleAuthentication } from "./handleAuthentication";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await handleAuthentication(
          credentials?.username as string,
          credentials?.password as string,
        );

        if (!user) {
          throw new Error("User not found.");
        }

        return user;
      },
    }),
  ],
  trustHost: true,
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      //@ts-ignore
      if (user) token.role = user?.role;
      return token;
    },
    async session({ session, token }) {
      //@ts-ignore
      if (session?.user) session.user.role = token.role;
      return session;
    },
  },
});
