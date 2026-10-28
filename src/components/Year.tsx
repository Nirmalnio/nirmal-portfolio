import { cacheLife } from "next/cache";

/** Cached so reading the clock doesn't opt the whole page out of prerendering. */
export async function Year() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
