import type { DefaultSession } from 'next-auth';

type AdminRole = 'admin' | 'super_admin' | 'editor';
type SessionError = 'RefreshTokenError' | 'AccessDenied';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role?: AdminRole;
    } & DefaultSession['user'];
    accessTokenExpires?: number;
    error?: SessionError;
  }

  interface User {
    role?: AdminRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: AdminRole;
    accessToken?: string;
    accessTokenExpires?: number;
    refreshToken?: string;
    refreshTokenExpires?: number;
    error?: SessionError;
  }
}
