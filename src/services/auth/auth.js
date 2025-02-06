import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Static user data for testing purposes
let staticUser = {
  id: "100",
  username: "intern",
  firstName: "intern",
  lastName: "intern",
  password: "intern", // Remember to hash passwords in production
  roleId: "1",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Simulate checking credentials against the static user
        if (credentials.password === staticUser.password) {
          // Return the static user if credentials match
          staticUser.username=credentials.username;
          staticUser.firstName=credentials.username;
          staticUser.lastName="";
          return staticUser;
        } else {
          // Return null if credentials don't match (simulating invalid login)
          return null;
        }
      },
    }),
  ],

  callbacks: {
    // Sign-in callback - Checks if the user is active before allowing sign-in
    async signIn({ user }) {
    /*  if (!user?.isActive) {
        return false; // Prevent sign-in if the user is not active
      }*/
      return true; // Allow sign-in if the user is active
    },

    // JWT callback - Populates the token with user data
    async jwt({ token, user }) {
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
      return token; // Return the existing token if no user is provided
    },

    // Session callback - Adds user data from the token to the session object
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId;
        session.user.roleId = token.userRoleId;
        session.user.username = token.username;
        session.user.firstName = token.userFirstName;
        session.user.lastName = token.userLastName;
        session.user.isActive = token.isActive;
      }
      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === "development", // Enable debug mode in development only
});
