"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import * as m from "motion/react-m";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudOff,
  CloudRain,
  CloudSun,
  Globe,
  Laptop,
  Moon,
  Snowflake,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { site } from "@/content/site";
import type { Weather } from "@/lib/weather";
import {
  SERVER_IST,
  SERVER_LOCAL,
  hourLabel,
  istNow,
  localNow,
  spanLabel,
  subscribeClock,
  to12h,
} from "@/lib/clock";
import { WorkspaceScene, type Phase, type Sky } from "./WorkspaceScene";

const DAY = 1440;
const { wake, sleep } = site.schedule;

function describe(code: number, isDay: boolean): { label: string; Icon: LucideIcon; sky: Sky } {
  if (code === 0) return { label: "Clear sky", Icon: isDay ? Sun : Moon, sky: "clear" };
  if (code <= 2) return { label: "Partly cloudy", Icon: isDay ? CloudSun : CloudMoon, sky: "cloudy" };
  if (code === 3) return { label: "Overcast", Icon: Cloud, sky: "cloudy" };
  if (code <= 48) return { label: "Foggy", Icon: CloudFog, sky: "fog" };
  if (code <= 57) return { label: "Drizzle", Icon: CloudDrizzle, sky: "rain" };
  if (code <= 67 || (code >= 80 && code <= 82)) return { label: "Rain", Icon: CloudRain, sky: "rain" };
  if (code <= 86) return { label: "Snow", Icon: Snowflake, sky: "cloudy" };
  return { label: "Thunderstorm", Icon: CloudLightning, sky: "storm" };
}

function offsetLabel(diff: number) {
  if (diff === 0) return "Same time zone as me";
  return diff > 0 ? `You're ${spanLabel(Math.abs(diff))} behind me` : `You're ${spanLabel(Math.abs(diff))} ahead of me`;
}

function isAwake(min: number) {
  const a = wake * 60;
  const b = sleep * 60;
  return a < b ? min >= a && min < b : min >= a || min < b;
}

const PREVIEWS = [
  { id: "live", label: "Live" },
  { id: "day", label: "11 AM", minutes: 11 * 60 },
  { id: "dusk", label: "6 PM", minutes: 18 * 60 },
  { id: "night", label: "2 AM", minutes: 2 * 60 },
] as const;
type Preview = (typeof PREVIEWS)[number]["id"];

/** Live scene of my day in Bengaluru: local time, real sky and weather, desk or bed by the clock. */
export function HeroVisual({ weather }: { weather: Weather | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const ist = useSyncExternalStore(subscribeClock, istNow, () => SERVER_IST);
  const local = useSyncExternalStore(subscribeClock, localNow, () => SERVER_LOCAL);
  const [preview, setPreview] = useState<Preview>("live");

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const ringY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });
  const px = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const py = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });

  // Before the clock is known (server render), show the afternoon desk scene.
  const [h, mi] = ist.split(":").map(Number);
  const liveMinutes = Number.isFinite(h) ? h * 60 + mi : 15 * 60;
  const chosen = PREVIEWS.find((p) => p.id === preview);
  const minutes = chosen && "minutes" in chosen ? chosen.minutes : liveMinutes;

  const sunrise = weather?.sunrise ?? 6 * 60;
  const sunset = weather?.sunset ?? 18 * 60;
  const isDay = minutes >= sunrise && minutes < sunset;
  // 40 minutes either side of sunrise and sunset get the warm dawn and dusk skies.
  const phase: Phase =
    Math.abs(minutes - sunrise) < 40 ? "dawn" : Math.abs(minutes - sunset) < 40 ? "dusk" : isDay ? "day" : "night";
  const arc = isDay
    ? (minutes - sunrise) / (sunset - sunrise)
    : ((minutes - sunset + DAY) % DAY) / (DAY - (sunset - sunrise));

  const awake = isAwake(minutes);
  const backIn = (wake * 60 - minutes + DAY) % DAY;
  const w = weather ? describe(weather.code, weather.isDay) : null;
  const [localTime, diffRaw] = local.split("|");
  const displayTime =
    preview === "live" ? to12h(ist) : to12h(`${Math.floor(minutes / 60)}:00`);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[28rem] px-2 pb-6 sm:px-4">
      <m.div
        aria-hidden
        style={reduce ? undefined : { y: ringY }}
        className="absolute -inset-8 -z-10 grid place-items-center"
      >
        <div className="spin-slow size-full rounded-full border border-dashed border-line-strong" />
      </m.div>
      <div
        aria-hidden
        className="absolute inset-x-4 bottom-6 top-0 -z-10 translate-x-4 translate-y-4 rotate-3 rounded-[2rem] bg-gradient-to-br from-accent to-accent/20 opacity-80"
      />

      <m.div
        style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1000 }}
        onPointerMove={(e) => {
          if (reduce || e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          rotateY.set(x * 10);
          rotateX.set(-y * 10);
          px.set(x);
          py.set(y);
        }}
        onPointerLeave={() => {
          rotateX.set(0);
          rotateY.set(0);
          px.set(0);
          py.set(0);
        }}
        className="relative"
      >
        <div className="rounded-[2rem] border border-line-strong bg-surface p-3">
          <WorkspaceScene
            awake={awake}
            phase={phase}
            isDay={isDay}
            sky={w?.sky ?? "clear"}
            arc={Math.min(1, Math.max(0, arc))}
            time={displayTime}
            label={preview === "live" ? "Live in Bengaluru" : "Preview · Bengaluru"}
            px={px}
            py={py}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 px-2 pt-4">
            <p className="flex items-center gap-2.5 text-sm" aria-live="polite" suppressHydrationWarning>
              {awake ? (
                <Laptop aria-hidden className="size-4 shrink-0 text-accent" />
              ) : (
                <Moon aria-hidden className="size-4 shrink-0 text-accent" />
              )}
              <span>
                <b className="font-semibold">{awake ? "At my desk" : "Asleep"}</b>
                <span className="text-muted">
                  {awake
                    ? ` · until ${hourLabel(sleep)} IST`
                    : ` · back at ${hourLabel(wake)} IST, in ${spanLabel(backIn)}`}
                </span>
              </span>
            </p>
            <div role="group" aria-label="Preview the scene at another time" className="flex rounded-full border border-line p-0.5">
              {PREVIEWS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={preview === p.id}
                  onClick={() => setPreview(p.id)}
                  className="min-h-8 rounded-full px-2.5 font-mono text-[0.7rem] text-muted transition-colors hover:text-ink aria-pressed:bg-accent aria-pressed:text-accent-ink"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 px-2 pb-2 pt-3 text-xs">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-bg px-3 py-1.5">
              {w ? <w.Icon aria-hidden className="size-4 text-accent" /> : <CloudOff aria-hidden className="size-4 text-faint" />}
              {weather && w ? (
                <span>
                  <b className="font-semibold tabular-nums">{weather.temp}&deg;C</b>{" "}
                  <span className="text-muted">{w.label}</span>
                </span>
              ) : (
                <span className="text-muted">Weather unavailable</span>
              )}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-bg px-3 py-1.5" suppressHydrationWarning>
              <Globe aria-hidden className="size-4 text-accent" />
              <span>
                <b className="font-semibold tabular-nums">{to12h(localTime)}</b>{" "}
                <span className="text-muted">your time · {offsetLabel(Number(diffRaw) || 0)}</span>
              </span>
            </span>
          </div>
        </div>
      </m.div>
    </div>
  );
}
