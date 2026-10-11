import 'server-only';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authenticateWithPassword } from './adminAuth';
import {
  REFRESH_TOKEN_TTL_SECONDS,
  SessionUser,
  issueTokensForSignIn,
  revokeRefreshToken,
  rotateRefreshToken,
} from './refreshTokens';

/** Rotate a little before expiry so in-flight requests never carry a stale token. */
const ACCESS_TOKEN_REFRESH_MARGIN_MS = 60_000;

/**
 * Session design
 * - NextAuth JWT strategy: the session lives in an encrypted, httpOnly cookie.
 * - Inside it: a 15-minute access token (verified by API routes) and a rotating
 *   7-day refresh token (validated against MongoDB on every rotation).
 * - Rotation happens only in this `jwt` callback, i.e. on /api/auth/session,
 *   where NextAuth can write the new cookie. API routes never rotate: they
 *   answer `401 token_expired` and the client refreshes the session and retries.
 */
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt', maxAge: REFRESH_TOKEN_TTL_SECONDS },
  pages: { signIn: '/admin/login', error: '/admin/login' },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Admin Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === 'string' ? credentials.email : '';
        const password = typeof credentials?.password === 'string' ? credentials.password : '';
        return authenticateWithPassword(email, password);
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // 1. Initial sign-in: start a new refresh-token family.
      if (user && account) {
        // Email + password is the only sign-in method (see CredentialsProvider).
        const sessionUser = user as unknown as SessionUser;
        const tokens = await issueTokensForSignIn(sessionUser);
        return {
          sub: sessionUser.id,
          email: sessionUser.email,
          name: sessionUser.name,
          picture: sessionUser.image,
          role: sessionUser.role,
          ...tokens,
        };
      }

      if (token.error) return token;

      // 2. Access token still fresh.
      if (
        typeof token.accessTokenExpires === 'number' &&
        Date.now() < token.accessTokenExpires - ACCESS_TOKEN_REFRESH_MARGIN_MS
      ) {
        return token;
      }

      // 3. Rotate the refresh token.
      if (!token.refreshToken) return { ...token, error: 'RefreshTokenError' };
      try {
        const result = await rotateRefreshToken(token.refreshToken);
        if ('reason' in result) {
          return { ...token, error: 'RefreshTokenError' };
        }
        return {
          ...token,
          email: result.user.email,
          name: result.user.name,
          picture: result.user.image,
          role: result.user.role,
          ...result.tokens,
          error: undefined,
        };
      } catch (err) {
        // Database briefly unreachable: keep the session; the next poll retries.
        console.warn('Token refresh notice:', err instanceof Error ? err.message : err);
        return token;
      }
    },

    async session({ session, token }) {
      session.user = {
        id: token.sub as string,
        email: token.email ?? null,
        name: token.name ?? null,
        image: token.picture ?? null,
        role: token.role,
      };
      session.accessTokenExpires = token.accessTokenExpires;
      session.error = token.error;
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      if (token?.refreshToken) {
        await revokeRefreshToken(token.refreshToken).catch(() => {});
      }
    },
  },
};
