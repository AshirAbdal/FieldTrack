// auth.ts
import { connectDB, getNativeClient } from "@/lib/mongodb";
import User from "@/models/User";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { Adapter } from "next-auth/adapters";

// Initialize the database connection and get the native client
const clientPromise = (async () => {
  await connectDB();
  return getNativeClient();
})();

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password.");
        }

        // The database connection should already be established by clientPromise
        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user) {
          throw new Error("Wrong email or password.");
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
          throw new Error("Wrong email or password.");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user }) {
      return !!user;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name || "",
        email: token.email || "",
      };
      return session;
    },
    redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
  useSecureCookies: process.env.NODE_ENV === "production",
};
