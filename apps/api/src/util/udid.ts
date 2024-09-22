import crypto from "crypto";

export const generateUdid = () =>
  [8, 4, 4, 4, 12]
    .map((n) => crypto.randomBytes(n / 2).toString("hex"))
    .join("-");
