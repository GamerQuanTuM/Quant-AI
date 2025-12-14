import crypto from 'crypto';

const getSecret = () => {
  const secret = process.env.ENCRYPTION_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error("ENCRYPTION_KEY is missing. Fix your environment.");
    }
    return "12345678901234567890123456789012";
  }
  return secret;
}


const ALGO = 'aes-256-gcm';

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(
    ALGO,
    Buffer.from(getSecret()),
    iv
  );

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decrypt(stored: string): string {
  const [ivHex, authTagHex, encryptedHex] = stored.split(':');

  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error("Invalid encrypted value. You passed garbage.");
  }

  const decipher = crypto.createDecipheriv(
    ALGO,
    Buffer.from(getSecret()),
    Buffer.from(ivHex, 'hex')
  );

  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
