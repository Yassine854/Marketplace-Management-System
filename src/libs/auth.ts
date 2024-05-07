//import Credentials from "next-auth/providers/credentials";
//import NextAuth from "next-auth";
//import { authConfig } from "@/utils/auth.config";
//import { config } from "./../middleware";
// import { DynamoDB, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";

// import CredentialsProvider from "next-auth/providers/credentials";
// import { DynamoDBAdapter } from "@auth/dynamodb-adapter";
// import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
// import NextAuth from "next-auth";
// import { NextAuthOptions } from "next-auth";

// const config: DynamoDBClientConfig = {
//   credentials: {
//     accessKeyId: process.env.AUTH_DYNAMODB_ID as string,
//     secretAccessKey: process.env.AUTH_DYNAMODB_SECRET as string,
//   },
//   region: process.env.AUTH_DYNAMODB_REGION,
// };

// const client = DynamoDBDocument.from(new DynamoDB(config), {
//   marshallOptions: {
//     convertEmptyValues: true,
//     removeUndefinedValues: true,
//     convertClassInstanceToMap: true,
//   },
// });

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         username: { label: "Username", type: "text" },
//         password: { label: "Password", type: "password" },
//       },

//       async authorize(credentials: any, req) {
//         try {
//   const user = await prisma.user.findUnique({
//     where: {
//       email: credentials.email,
//     },
//   });
// const user = await client.get(
//   {
//     TableName: "kamioun-oms-staging",
//     Key: {
//       id: "abcd",
//       timestamp: 2,
//     },
//   },
//   (err, data) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(data);
//     }
//   },
// );

//   if (!user || !user?.hashedPassword) {
//     throw new Error("Invalid credentials");
//   }

//   const isCorrectPassword = await bcrypt.compare(
//     credentials.password,
//     user.hashedPassword,
//   );

//   if (!isCorrectPassword) {
//     throw new Error("Invalid credentials");
//   }
//   return { ...user, password: null, role: user.role };
//         } catch (error) {
//           console.error(error);
//         }
//         return null;
//       },

//   authorize(credentials: any, req) {
//     // database operations
//     return {
//       id: "1",
//       Email: credentials.email,
//     };
//   },
//   authorize: async (credentials) => {
//     let user = null;

//     // logic to salt and hash password
//     const pwHash = saltAndHashPassword(credentials.password);

//     // logic to verify if user exists
//     user = await getUserFromDb(credentials.email, pwHash);

//     if (!user) {
//       // No user found, so this is their first attempt to login
//       // meaning this is also the place you could do registration
//       throw new Error("User not found.");
//     }

//     // return user object with the their profile data
//     return user;
//   }, authorize: async (credentials) => {
//     let user = null;

//     // logic to salt and hash password
//     const pwHash = saltAndHashPassword(credentials.password);

//     // logic to verify if user exists
//     user = await getUserFromDb(credentials.email, pwHash);

//     if (!user) {
//       // No user found, so this is their first attempt to login
//       // meaning this is also the place you could do registration
//       throw new Error("User not found.");
//     }

//     // return user object with the their profile data
//     return user;
//   },
//     }),
//   ],
//   //@ts-ignore
//   adapter: DynamoDBAdapter(client),
// });

// async function getUser(username: string, password: string): Promise<any> {
//   return {
//     id: 1,
//     username: username,
//     password: password,
//   };
// }

// export const {
//   auth,
//   signIn,
//   signOut,
//   handlers: { GET, POST },
// } = NextAuth({
//   //...authConfig,
//   providers: [
//     Credentials({
//       name: "credentials",
//       credentials: {
//         username: { label: "username", type: "text" },
//         password: { label: "password", type: "password" },
//       },
//       async authorize(credentials) {
//         try {
//           console.log("🚀 ~ authorize ~ credentials:", credentials);
//         } catch (error) {
//           console.error(error);
//         }
//         const user = await getUser(
//           credentials?.username as string,
//           credentials?.password as string,
//         );

//         return user ?? null;
//       },
//     }),
//   ],
// });

// import NextAuth from "next-auth";

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [],
// });

import Credentials from "next-auth/providers/credentials";
import NextAuth from "next-auth";

async function getUser(email: string, password: string): Promise<any> {
  return {
    id: 1,
    name: "test user",
    email: email,
    password: password,
  };
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🚀 ~ authorize ~ credentials:", credentials);
        const user = await getUser(
          credentials?.email as string,
          credentials?.password as string,
        );
        console.log("🚀 ~ authorize ~ user:", user);

        return user ?? null;
      },
    }),
  ],
});
