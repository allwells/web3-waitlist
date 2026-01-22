import NextAuth, { NextAuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID || "",
      clientSecret: process.env.TWITTER_CLIENT_SECRET || "",
      version: "2.0",
    }),
  ],
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        token.profile = profile;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user && token?.profile) {
        // @ts-ignore
        session.user.username =
          token.profile.data?.username || token.profile.screen_name;
      }
      return session;
    },
  },
  theme: {
    colorScheme: "light",
  },
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
