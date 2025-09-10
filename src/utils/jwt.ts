import jwt from 'jsonwebtoken';
import { env } from '@/config/env';

export type JwtPayload = { sub: string; email: string };

export function signJwt(payload: JwtPayload, expiresIn = '1d') {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
}

export function verifyJwt<T = JwtPayload>(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as T;
}
    