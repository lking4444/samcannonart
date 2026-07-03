import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email);
        const password = String(credentials.password);

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminEmail || !adminPasswordHash) {
          throw new Error("Missing admin auth environment variables");
        }

        if (email !== adminEmail) {
          return null;
        }

        const passwordIsValid = await bcrypt.compare(
          password,
          adminPasswordHash
        );

        if (!passwordIsValid) {
          return null;
        }

        return {
          id: "admin",
          email: adminEmail,
          role: "admin",
        };
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }

      return token;
    },

    session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});