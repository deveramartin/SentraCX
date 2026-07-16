import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    systems: string[];
    user: DefaultSession["user"];
  }

  interface Profile {
    systems?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    systems?: string[];
  }
}