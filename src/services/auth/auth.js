import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
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

        if (!user) return null;

        return {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          status: user.status,
          roleId: user.roleId,
          isActive: user.isActive,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // - Before Update:", token);

      if (user) {
        token.userId = user.id;
        token.userRoleId = user.roleId;
        token.username = user.username;
        token.userFirstName = user.firstName;
        token.userLastName = user.lastName;
        token.isActive = user.isActive;
      }

      // - After Update:", token);
      return token;
    },

    async session({ session, token }) {
      //  - Before Fix:", session);
      //  - Token Data:", token);

      session.user = {
        id: token.userId,
        roleId: token.userRoleId,
        username: token.username,
        name: `${token.userFirstName} ${token.userLastName}`,
        firstName: token.userFirstName,
        lastName: token.userLastName,
        isActive: token.isActive,
      };

      //  - After Fix:", session);
      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === "development", // Enable debug mode in development only
});
