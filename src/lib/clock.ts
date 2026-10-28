/** Ticking clock stores for useSyncExternalStore. Snapshots are strings, so they only change once a second. */

const IST_OFFSET_MIN = 330;

const istFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});
const localFormat = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });

export const SERVER_IST = "--:--:--";
export const SERVER_LOCAL = "--:--|0";

export function subscribeClock(cb: () => void) {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
}

/** "19:26:51" in Bengaluru (24-hour, for calculations; format with `to12h` for display). */
export const istNow = () => istFormat.format(new Date());

/** "19:26|0": the visitor's local time, and how many minutes they are behind IST. */
export const localNow = () => `${localFormat.format(new Date())}|${IST_OFFSET_MIN + new Date().getTimezoneOffset()}`;

/** "19:26:51" → "7:26:51 PM", "19:26" → "7:26 PM". Placeholders pass through. */
export function to12h(time: string) {
  const [h, ...rest] = time.split(":");
  const hour = Number(h);
  if (!Number.isFinite(hour)) return time;
  return `${hour % 12 || 12}:${rest.join(":")} ${hour < 12 ? "AM" : "PM"}`;
}

/** 13 → "1 PM", 0 → "midnight". */
export function hourLabel(h: number) {
  if (h === 0) return "midnight";
  if (h === 12) return "noon";
  return `${h % 12} ${h < 12 ? "AM" : "PM"}`;
}

/** 192 → "3h 12m" */
export function spanLabel(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h${m ? ` ${m}m` : ""}` : `${m}m`;
}
