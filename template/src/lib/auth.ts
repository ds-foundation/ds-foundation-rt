// Auth.js v5 configuration
// Docs: https://authjs.dev/getting-started
import NextAuth from 'next-auth';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Add providers here:
    // import GitHub from 'next-auth/providers/github'
    // GitHub({ clientId: process.env.AUTH_GITHUB_ID, clientSecret: process.env.AUTH_GITHUB_SECRET })
  ],
});
