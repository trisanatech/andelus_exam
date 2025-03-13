// import NextAuth from 'next-auth';
// import GithubProvider from 'next-auth/providers/github';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import { PrismaAdapter } from '@auth/prisma-adapter';
// import { PrismaClient } from '@prisma/client';
// import { verifyPassword } from '@/utils/auth';

// const prisma = new PrismaClient();

// const handler = NextAuth({
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID!,
//       clientSecret: process.env.GITHUB_SECRET!,
//     }),
//     CredentialsProvider({
//       name: 'credentials',
//       credentials: {
//         email: { label: 'Email', type: 'email' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error('Please enter your email and password');
//         }

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         });

//         if (!user || !user.passwordHash) {
//           throw new Error('No user found with this email');
//         }

//         const isValid = await verifyPassword(credentials.password, user.passwordHash);

//         if (!isValid) {
//           throw new Error('Invalid password');
//         }

//         return {
//           id: user.id,
//           email: user.email,
//           name: user.displayName,
//           image: user.imageUrl,
//         };
//       },
//     }),
//   ],
//   pages: {
//     signIn: '/signin',
//   },
//   session: {
//     strategy: 'jwt',
//   },
//   callbacks: {
//     async session({ session, token }) {
//       if (token.sub) {
//         const dbUser = await prisma.user.findUnique({
//           where: { id: token.sub },
//           include: {
//             role: {
//               include: {
//                 permissions: {
//                   include: {
//                     permission: true,
//                   },
//                 },
//               },
//             },
//           },
//         });

//         return {
//           ...session,
//           user: {
//             ...session.user,
//             id: token.sub,
//             role: dbUser?.role?.name || 'user',
//             permissions: dbUser?.role?.permissions.map(p => p.permission.name) || [],
//           },
//         };
//       }
//       return session;
//     },
//   },
// });

// export { handler as GET, handler as POST };

// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "john@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Find the user by email.
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
          include: { role: true },
        });
        if (!user) throw new Error("No user found with that email");

        // Compare passwords.
        const isValid = await bcrypt.compare(
          credentials?.password || "",
          user.passwordHash || ""
        );
        if (!isValid) throw new Error("Incorrect password");

        // Check if the user is active.
        if (!user.active) throw new Error("User is not active");

        // Return user data with role information.
        return {
          id: user.id,
          email: user.email,
          name: user.displayName,
          role: user.role.name,
        };
      },
    }),
    // Add other providers if needed.
  ],
  session: {
    strategy: "jwt",
  },
  // pages: {
  //   error: "/unauthorized", // Redirect here when an error occurs.
  // },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id || token.sub; // Ensure id is present.
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST, authOptions };
