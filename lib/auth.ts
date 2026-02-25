import { createHash, randomBytes } from 'crypto';

// Secret for signing the tokens (use environment variable)
const SECRET = process.env.COOKIE_SECRET || '';

// Create a token (simple implementation)
export async function createToken() {
  const timestamp = Date.now();
  const randomString = randomBytes(16).toString('hex');
  const data = `admin:${timestamp}:${randomString}`;
  const signature = createHash('sha256')
    .update(data + SECRET)
    .digest('hex');
  
  return Buffer.from(`${data}:${signature}`).toString('base64');
}

// Verify a token
export async function verifyToken(token: string) {
  try {
    const decodedString = Buffer.from(token, 'base64').toString();
    const [role, timestamp, randomValue, signature] = decodedString.split(':');
    
    // Check if token is expired (24 hours)
    const expirationTime = parseInt(timestamp) + 24 * 60 * 60 * 1000;
    if (Date.now() > expirationTime) {
      return false;
    }
    
    // Verify signature
    const data = `${role}:${timestamp}:${randomValue}`;
    const expectedSignature = createHash('sha256')
      .update(data + SECRET)
      .digest('hex');
    
    return role === 'admin' && signature === expectedSignature;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
}
