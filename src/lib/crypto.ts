const SECRET = process.env.CRYPTO_SECRET; 

async function getKey() {
  const enc = new TextEncoder();
  // Hash the secret to get exactly 32 bytes (256 bits)
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(SECRET));
  
  return crypto.subtle.importKey(
    "raw",
    digest,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptData(data: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getKey();
  const enc = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(data)
  );
  // Store iv + encrypted data as base64
  return btoa(
    String.fromCharCode(...iv) +
      String.fromCharCode(...new Uint8Array(encrypted))
  );
}

export async function decryptData(data: string): Promise<string> {
  const raw = atob(data);
  const iv = Uint8Array.from(raw.slice(0, 12), (c) => c.charCodeAt(0));
  const encrypted = Uint8Array.from(raw.slice(12), (c) => c.charCodeAt(0));
  const key = await getKey();
  const dec = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encrypted
  );
  return new TextDecoder().decode(dec);
}
