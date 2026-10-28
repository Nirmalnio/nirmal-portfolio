import { cacheLife } from "next/cache";

export type Weather = {
  temp: number;
  code: number;
  isDay: boolean;
  /** Today's sunrise and sunset in Bengaluru, as minutes after midnight IST. */
  sunrise: number | null;
  sunset: number | null;
};

// Bengaluru. Open-Meteo needs no API key.
const URL =
  "https://api.open-meteo.com/v1/forecast?latitude=12.9716&longitude=77.5946&current=temperature_2m,weather_code,is_day&daily=sunrise,sunset&forecast_days=1&timezone=Asia%2FKolkata";

/** "2026-10-28T06:08" → 368 */
function toMinutes(iso: unknown): number | null {
  if (typeof iso !== "string") return null;
  const [h, m] = iso.slice(11, 16).split(":").map(Number);
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : null;
}

/** Current conditions in Bengaluru, fetched on the server and cached for 15 minutes. Null if unavailable. */
export async function getWeather(): Promise<Weather | null> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 900, expire: 3600 });
  try {
    const res = await fetch(URL, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const { current, daily } = (await res.json()) as {
      current?: { temperature_2m?: unknown; weather_code?: unknown; is_day?: unknown };
      daily?: { sunrise?: unknown[]; sunset?: unknown[] };
    };
    if (
      typeof current?.temperature_2m !== "number" ||
      typeof current.weather_code !== "number" ||
      typeof current.is_day !== "number"
    ) {
      return null;
    }
    return {
      temp: Math.round(current.temperature_2m),
      code: current.weather_code,
      isDay: current.is_day === 1,
      sunrise: toMinutes(daily?.sunrise?.[0]),
      sunset: toMinutes(daily?.sunset?.[0]),
    };
  } catch {
    return null;
  }
}
