import { useMemo } from "react";
import type { Activity } from "../../lib/gh";

const ROWS = 18;
const COLS = 120;

export default function BitField({ activity }: { activity: Activity | null }) {
  const rows = useMemo(() => {
    const bitSrc = activity?.days.map(d => d.commits) ?? [];
    const base = new Array(ROWS).fill(0).map((_, r) => {
      let bits = "";
      for (let i = 0; i < COLS; i++) {
        const v = bitSrc[(i + r * 7) % bitSrc.length] ?? 0;
        bits += ((v >> (r % 4)) & 1) || ((i * (r + 3)) % 7 === 0) ? "1" : "0";
      }
      return {
        bits,
        color: r % 5 === 2 ? "rgba(216,251,60,.5)" : "rgba(244,242,237,.14)",
      };
    });
    return base.concat(base);
  }, [activity]);

  return (
    <section aria-hidden="true" className="relative h-[130px] overflow-hidden border-t border-b border-white/12 bg-base-2">
      <div
        className="absolute inset-0 flex flex-col"
        style={{ animation: "bitroll 34s linear infinite", willChange: "transform" }}
      >
        {rows.map((b, i) => (
          <div
            key={i}
            className="whitespace-nowrap font-mono text-[10px] leading-[1.62] tracking-[.34em]"
            style={{ color: b.color }}
          >
            {b.bits}
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#0d0d0f_0%,transparent_18%,transparent_82%,#0d0d0f_100%)]" />
      <div className="absolute left-[30px] top-1/2 -translate-y-1/2 border border-accent/30 bg-base-2 px-[12px] py-[6px] font-mono text-[10px] tracking-[.28em] uppercase text-accent">
        {activity ? `${activity.total} commits / 90 days` : "reading push events…"}
      </div>
    </section>
  );
}
