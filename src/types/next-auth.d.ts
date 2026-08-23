import type {
  DefaultSession,
} from "next-auth";

type UserRole =
  | "USER"
  | "ADMIN";

type CEFRLevel =
  | "A1"
  | "A2"
  | "B1"
  | "B2"
  | "C1"
  | "C2";

declare module "next-auth" {
  interface User {
    id?: string;

    role?: UserRole;

    currentLevel?:
      | CEFRLevel
      | null;

    onboardingCompleted?:
      boolean;
  }

  interface Session {
    user: {
      id: string;

      role: UserRole;

      currentLevel:
        | CEFRLevel
        | null;

      onboardingCompleted:
        boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;

    role?: UserRole;

    currentLevel?:
      | CEFRLevel
      | null;

    onboardingCompleted?:
      boolean;
  }
}