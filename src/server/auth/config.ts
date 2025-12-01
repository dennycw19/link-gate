import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcrypt";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
// import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import { string } from "zod";

import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */

const USERS = [{ id: "1", username: "dennycahyow", password: "secret123" }];

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials, req) {
        const username = credentials?.username as string;
        const password = credentials?.password as string;
        if (!credentials.username || !credentials.password) {
          return null;
        }

        // Cari user di database
        const user = await db.user.findUnique({
          where: { username: username },
        });

        if (!user?.password) return null;

        // Cocokkan dengan hashed password
        const isValid = await compare(password, user.password);

        if (!isValid) return null;
        return {
          id: user.id.toString(),
          username: user.username,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as typeof session.user;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  // adapter: PrismaAdapter(db),
  // callbacks: {
  //   session: ({ session, user }) => ({
  //     ...session,
  //     user: {
  //       ...session.user,
  //       id: user.id,
  //     },
  //   }),
  // },
} satisfies NextAuthConfig;
