import crypto from "crypto";

export const securelyHashString = (value: string, salt: string) => {
  return crypto.pbkdf2Sync(value, salt, 10000, 64, "sha512").toString("hex");
};

export const generateSecureString = (length = 32) => {
  return crypto.randomBytes(length).toString("hex");
};
