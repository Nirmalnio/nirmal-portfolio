"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-4 text-sm text-muted transition-colors hover:border-ink hover:text-ink"
    >
      {state === "copied" ? <Check aria-hidden className="size-4 text-accent" /> : <Copy aria-hidden className="size-4" />}
      <span role="status">
        {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy email"}
      </span>
    </button>
  );
}
