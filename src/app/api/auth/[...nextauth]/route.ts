import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthOptions } from 'next-auth';

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error('Missing GOOGLE_CLIENT_ID environment variable');
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing GOOGLE_CLIENT_SECRET environment variable');
}
if (!process.env.NEXTAUTH_SECRET) {
    console.warn('Missing NEXTAUTH_SECRET environment variable. Using a generated value for development. Set a proper secret for production!');
}

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here if needed
  ],
  secret: process.env.NEXTAUTH_SECRET, // Secret used to encrypt the session cookie
  pages: {
    signIn: '/login', // Redirect users to custom login page
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for email/passwordless login)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out to disable)
  },
  callbacks: {
    // You can add callbacks here to control the session data or redirect behavior
    // async session({ session, token, user }) {
    //   // Send properties to the client, like an access_token from a provider.
    //   // session.accessToken = token.accessToken
    //   return session
    // }
    // async jwt({ token, account }) {
    //   // Persist the OAuth access_token to the token right after signin
    //   if (account) {
    //     token.accessToken = account.access_token
    //   }
    //   return token
    // }
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
