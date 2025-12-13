import crypto from 'crypto';

const SECRET = process.env.ENCRYPTION_KEY!;

if (!SECRET) {
  throw new Error("ENCRYPTION_KEY is missing. Fix your environment.");
}


const ALGO = 'aes-256-gcm';

// Encrypts a string and returns a single storable string
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(
    ALGO,
    Buffer.from(SECRET),
    iv
  );

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

// Decrypts the value produced by encrypt()
export function decrypt(stored: string): string {
  const [ivHex, authTagHex, encryptedHex] = stored.split(':');

  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error("Invalid encrypted value. You passed garbage.");
  }

  const decipher = crypto.createDecipheriv(
    ALGO,
    Buffer.from(SECRET),
    Buffer.from(ivHex, 'hex')
  );

  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
