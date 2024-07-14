import crypto from "crypto";

export const hashPassword = (password: string, salt: string) => {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
};

export const generatePasswordSalt = () => {
  return crypto.randomBytes(32).toString("hex");
};
