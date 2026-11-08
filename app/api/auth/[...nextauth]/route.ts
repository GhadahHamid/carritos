import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

const authOptions = {
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-now",
  session: { strategy: "jwt" as const },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return user;
      }
    })
  ],
  pages: { signIn: "/login" },
};

const handler = NextAuth(authOptions);

// Use standard functions instead of export const
export async function GET(req: Request, ctx: any) {
  return handler(req, ctx);
}

export async function POST(req: Request, ctx: any) {
  return handler(req, ctx);
}