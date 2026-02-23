import * as jose from 'jose';

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET);

export async function sign(
  payload: { sub: string; email?: string },
  expiresIn = '7d',
): Promise<string> {
  return new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret());
}

export async function verify(
  token: string,
): Promise<jose.JWTPayload & { sub: string; email?: string }> {
  const { payload } = await jose.jwtVerify(token, secret());
  return payload as jose.JWTPayload & { sub: string; email?: string };
}
