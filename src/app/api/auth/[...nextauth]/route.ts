
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthOptions } from 'next-auth';

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
// Provide a default development secret if NEXTAUTH_SECRET is missing, but require it in production.
const nextAuthSecret = process.env.NEXTAUTH_SECRET ?? (process.env.NODE_ENV !== 'production' ? 'development-secret-key' : undefined);

// Validate environment variables
if (!googleClientId) {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('Missing GOOGLE_CLIENT_ID environment variable in production. Google OAuth cannot be configured.');
    } else {
        console.warn('Missing GOOGLE_CLIENT_ID environment variable. Google login disabled in development.');
    }
}
if (!googleClientSecret) {
     if (process.env.NODE_ENV === 'production') {
        throw new Error('Missing GOOGLE_CLIENT_SECRET environment variable in production. Google OAuth cannot be configured.');
    } else {
        console.warn('Missing GOOGLE_CLIENT_SECRET environment variable. Google login disabled in development.');
    }
}
if (!nextAuthSecret && process.env.NODE_ENV === 'production') {
     // Throw error only in production if NEXTAUTH_SECRET is truly missing (not just using the dev default)
     throw new Error('Missing NEXTAUTH_SECRET environment variable in production. Authentication cannot be secured.');
} else if (!process.env.NEXTAUTH_SECRET && process.env.NODE_ENV !== 'production') {
     // Warn if using the default development secret
     console.warn('Missing NEXTAUTH_SECRET environment variable. Using a default insecure key for development. Set a proper secret for production!');
}


export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    // Conditionally add GoogleProvider only if credentials exist
    ...(googleClientId && googleClientSecret ? [
        GoogleProvider({
          clientId: googleClientId,
          clientSecret: googleClientSecret,
        })
      ] : []),
    // ...add more providers here if needed
  ],
  secret: nextAuthSecret, // Use the determined secret
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
