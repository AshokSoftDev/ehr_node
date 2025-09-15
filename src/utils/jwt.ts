import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtPayload {
  sub: string;      // user ID
  email: string;
  accountType: string;
  groupId?: string | null;
  iat?: number;     // issued at
  exp?: number;     // expiration
}

export function signJwt(payload: Omit<JwtPayload, 'iat' | 'exp'>, expiresIn: string = env.JWT_EXPIRES_IN) {
  const options: SignOptions = {
    expiresIn: expiresIn as any,
    issuer: 'your-app-name', // optional
    audience: 'your-app-audience', // optional
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyJwt<T = JwtPayload>(token: string): T {
  try {
    return jwt.verify(token, env.JWT_SECRET) as T;
  } catch (error: any) {
    throw new Error(`Invalid token: ${error.message}`);
  }
}

// Optional: Add a decode function that doesn't verify (useful for debugging)
export function decodeJwt<T = JwtPayload>(token: string): T | null {
  try {
    return jwt.decode(token) as T;
  } catch {
    return null;
  }
}

// Optional: Add refresh token functionality
export function signRefreshToken(userId: string): string {
  return jwt.sign(
    { sub: userId, type: 'refresh' },
    env.JWT_SECRET,
    { expiresIn: '30d' } // Longer expiry for refresh tokens
  );
}
