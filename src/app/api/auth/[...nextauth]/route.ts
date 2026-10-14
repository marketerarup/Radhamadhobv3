import NextAuth from 'next-auth';
import { authOptions } from '@/src/lib/server/authOptions';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
