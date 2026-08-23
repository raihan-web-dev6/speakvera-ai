import NextAuth from "next-auth";

import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import bcrypt from "bcryptjs";

import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { loginSchema } from "@/schemas/auth.schema";

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
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
        const validation =
          loginSchema.safeParse(
            credentials
          );

        if (!validation.success) {
          return null;
        }

        const {
          email,
          password,
        } = validation.data;

        await connectDb();

        const user =
          await User.findOne({
            email:
              email.toLowerCase(),
          }).select(
            "+passwordHash"
          );

        if (
          !user ||
          !user.passwordHash
        ) {
          return null;
        }

        const passwordMatches =
          await bcrypt.compare(
            password,
            user.passwordHash
          );

        if (!passwordMatches) {
          return null;
        }

        return {
          id:
            user._id.toString(),

          name:
            user.name,

          email:
            user.email,

          image:
            user.image || null,
        };
      },
    }),

    Google({
      clientId:
        process.env
          .AUTH_GOOGLE_ID ?? "",

      clientSecret:
        process.env
          .AUTH_GOOGLE_SECRET ?? "",
    }),
  ],

  callbacks: {
    async signIn({
      user,
      account,
    }) {
      /*
       * Google users do not go through
       * the Credentials authorize()
       * function.
       *
       * Therefore we create/update
       * their MongoDB user here.
       */
      if (
        account?.provider ===
        "google"
      ) {
        if (!user.email) {
          return false;
        }

        await connectDb();

        const email =
          user.email.toLowerCase();

        await User.findOneAndUpdate(
          {
            email,
          },

          {
            $set: {
              name:
                user.name ??
                "Speakvera User",

              image:
                user.image ?? "",
            },

            $setOnInsert: {
              email,

              role:
                "USER",

              onboardingCompleted:
                false,

              xp: 0,

              streak: 0,
            },

            $addToSet: {
              authProviders:
                "google",
            },
          },

          {
            upsert: true,

            new: true,

            setDefaultsOnInsert:
              true,
          }
        );
      }

      return true;
    },

    async jwt({
      token,
      user,
      trigger,
      session,
    }) {
      /*
       * This runs immediately
       * after login.
       *
       * We load the complete
       * Speakvera user from MongoDB
       * and put important information
       * inside the JWT.
       */
      if (user?.email) {
        await connectDb();

        const databaseUser =
          await User.findOne({
            email:
              user.email.toLowerCase(),
          }).lean();

        if (databaseUser) {
          token.id =
            databaseUser._id.toString();

          token.role =
            databaseUser.role;

          token.currentLevel =
            databaseUser.currentLevel ??
            null;

          token.onboardingCompleted =
            databaseUser.onboardingCompleted ??
            false;
        }
      }

      /*
       * This runs when we call:
       *
       * useSession().update({
       *   onboardingCompleted: true,
       *   currentLevel: "B1"
       * })
       *
       * after the placement test.
       */
      if (
        trigger === "update"
      ) {
        const updatedData =
          session as
            | {
                onboardingCompleted?:
                  boolean;

                currentLevel?:
                  | "A1"
                  | "A2"
                  | "B1"
                  | "B2"
                  | "C1"
                  | "C2"
                  | null;
              }
            | undefined;

        if (
          typeof updatedData
            ?.onboardingCompleted ===
          "boolean"
        ) {
          token.onboardingCompleted =
            updatedData.onboardingCompleted;
        }

        if (
          updatedData &&
          "currentLevel" in
            updatedData
        ) {
          token.currentLevel =
            updatedData.currentLevel ??
            null;
        }
      }

      return token;
    },

    async session({
      session,
      token,
    }) {
      /*
       * Send our custom JWT fields
       * to session.user so client
       * components can access them.
       */
      if (
        session.user &&
        token.id
      ) {
        session.user.id =
          token.id as string;

        session.user.role =
          (token.role as
            | "USER"
            | "ADMIN") ??
          "USER";

        session.user.currentLevel =
          token.currentLevel as
            | "A1"
            | "A2"
            | "B1"
            | "B2"
            | "C1"
            | "C2"
            | null;

        session.user.onboardingCompleted =
          Boolean(
            token.onboardingCompleted
          );
      }

      return session;
    },
  },
});