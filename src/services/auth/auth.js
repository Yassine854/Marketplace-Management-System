import NextAuth from "next-auth";
import { handleAuthentication } from "./handleAuthentication";
import CredentialsProvider from "next-auth/providers/credentials";

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
      let isAllowedToSignIn = true;

      if (!user?.isActive) {
        isAllowedToSignIn(false);
      }

      if (isAllowedToSignIn) {
        return true;
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        //return '/unauthorized'
      }
    },
    async jwt({ token, user, profile, session }) {
      if (user) {
        return {
          ...token,
          userId: user.id,
          userRoleId: user.roleId,
          username: user.username,
          userFirstName: user.firstName,
          userLastName: user.lastName,
          isActive: user.isActive,
        };
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.roleId = token.userRoleId;
        session.user.username = token.username;
        session.user.lastName = token.userLastName;
        session.user.firstName = token.userFirstName;
        session.user.isActive = token.isActive;
      }

      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
});
