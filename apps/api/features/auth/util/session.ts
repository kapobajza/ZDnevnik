export const getCookieExpiry = (maxAxe: number) => {
  return Date.now() + maxAxe * 1000;
};
