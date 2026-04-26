import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import pool from "@/lib/db";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      await pool.query(
        `INSERT INTO users (email, password)
         VALUES ($1, $2)
         ON CONFLICT (email) DO NOTHING`,
        [
          user.email,
          "OAUTH_GOOGLE_ACCOUNT"
        ]
      );

      return true;
    },

    async session({ session }) {
      return session;
    },
  },
});

export { handler as GET, handler as POST };