import NextAuth, { DefaultSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";
import { log } from "@/lib/utils";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        name: { label: "name", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { name, password } = credentials ?? {};
        if (!name || !password) {
          throw new Error("Missing username or password");
        }
        const user = await prisma.user.findFirst({
          where: {
            name: {
              equals: name.trim(),
              mode: "insensitive",
            },
          },
        });
        if (!user || !(await compare(password, user.password))) {
          log.warn("Auth", "Failed login attempt");
          throw new Error("Invalid username or password");
        }
        log.debug("Auth", "Successful login");
        return user;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      const dbUser = await prisma.user.findUnique({
        where: {
          id: token.sub,
        },
      });
      
      if (!dbUser) {
        log.warn("Auth", "User not found in database");
        throw new Error("User not found");
      }

      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
