export function getImageSource(src: string | { src: string }) {
  if (typeof src === "string") {
    return src;
  }

  return src.src;
}
