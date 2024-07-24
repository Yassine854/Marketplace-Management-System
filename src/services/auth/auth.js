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
          credentials.username,
          credentials.password,
        );

        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        return true;
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        //return '/unauthorized'
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.roleCode = user.roleCode;
        token.username = user.username;
        token.lastName = user.lastName;
        token.firstName = user.firstName;
        token.warehouseCode = user.warehouseCode;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.roleCode = token.roleCode;
        session.user.username = token.username;
        session.user.lastName = token.lastName;
        session.user.firstName = token.firstName;
        session.user.warehouseCode = token.warehouseCode;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === "production" ? false : true,
});
