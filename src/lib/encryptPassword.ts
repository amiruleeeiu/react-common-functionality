// encryptionUtils.js

const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Use fixed values like systemRootPath and salt
const SYSTEM_ROOT_PATH = "/var/www/html";
const SALT_V2 = "your-salt-value-here";

// Hash a string using SHA-256
async function sha256(str) {
  const hash = await crypto.subtle.digest("SHA-256", encoder.encode(str));
  return new Uint8Array(hash);
}

// Get IV (16 bytes)
async function getIV() {
  let secretIV = SYSTEM_ROOT_PATH;
  while (secretIV.length < 16) {
    secretIV += SYSTEM_ROOT_PATH;
  }
  return (await sha256(secretIV)).slice(0, 12); // GCM uses 12-byte IV
}

// Derive AES-GCM Key
async function getKey(useOldSalt = false) {
  const salt = encoder.encode(
    useOldSalt ? "fallbackSalt" : SALT_V2 || "fallbackSalt"
  );
  const baseKey = await crypto.subtle.importKey(
    "raw",
    await sha256(SALT_V2 || "fallbackSalt"),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"]
  );
}

// Encrypt or Decrypt
export async function encryptDecrypt(
  data,
  action = "encrypt",
  useOldSalt = false
) {
  if (!data) return false;
  try {
    const key = await getKey(useOldSalt);
    const iv = await getIV();

    if (action === "encrypt") {
      const encoded = encoder.encode(data);
      const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encoded
      );
      return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    } else if (action === "decrypt") {
      const encryptedBytes = Uint8Array.from(atob(data), (c) =>
        c.charCodeAt(0)
      );
      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        encryptedBytes
      );
      return decoder.decode(decrypted);
    }
  } catch (err) {
    if (!useOldSalt && action === "decrypt") {
      console.warn("Decryption failed, retrying with old salt...");
      return encryptDecrypt(data, action, true);
    }
    console.error("Encryption error:", err);
    return false;
  }
}

// Encrypt object or string
export async function encryptString(input) {
  const str = typeof input === "object" ? JSON.stringify(input) : input;
  return await encryptDecrypt(str, "encrypt");
}

// Decrypt string
export async function decryptString(encryptedStr) {
  return await encryptDecrypt(encryptedStr, "decrypt");
}

// Generate UNIX timestamp from "+7 days" like string
function getFutureTimestamp(valid = "+7 days") {
  const match = valid.match(
    /([+-]?\d+)\s*(day|days|hour|hours|minute|minutes)/i
  );
  const now = new Date();
  if (match) {
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    switch (unit) {
      case "day":
      case "days":
        now.setDate(now.getDate() + value);
        break;
      case "hour":
      case "hours":
        now.setHours(now.getHours() + value);
        break;
      case "minute":
      case "minutes":
        now.setMinutes(now.getMinutes() + value);
        break;
    }
  }
  return Math.floor(now.getTime() / 1000);
}

// Simulate getUserHash
export async function getUserHash(userId, password, valid = "+7 days") {
  const obj = {
    u: userId,
    v: getFutureTimestamp(valid),
    p: password,
  };
  const encrypted = await encryptString(obj);
  return `_user_hash_${encrypted}`;
}
