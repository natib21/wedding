/**
 * Decode images in the browser so they are cached before first paint / transition.
 * Always resolves (never rejects) so boot screens do not hang on a single bad URL.
 */
export function preloadImage(src: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  return new Promise((resolve) => {
    const img = new window.Image();
    const done = () => resolve();

    img.onload = () => {
      if ("decode" in img && typeof img.decode === "function") {
        img.decode().then(done).catch(done);
      } else {
        done();
      }
    };
    img.onerror = done;
    img.src = src;
  });
}

export function preloadImages(urls: readonly string[]): Promise<void> {
  const unique = Array.from(new Set(urls.filter(Boolean)));
  return Promise.all(unique.map(preloadImage)).then(() => undefined);
}
