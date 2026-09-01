import { useEffect, useRef, useState } from "react";
import { isSignal, languageBreakdown, type Activity, type Profile, type Repo } from "../../lib/gh";
import { useReveal } from "../../hooks/panels";
import LanguageRadial from "./LanguageRadial";
import ActivityChart from "./ActivityChart";

interface Stat {
  n: number;
  label: string;
  color: string;
}

function StatsCells({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      es => {
        for (const en of es) {
          if (!en.isIntersecting || counted.current) continue;
          counted.current = true;
          io.disconnect();
          const t0 = performance.now();
          const step = () => {
            const q = Math.min(1, (performance.now() - t0) / 1400);
            setP(1 - Math.pow(1 - q, 3));
            if (q < 1) raf = requestAnimationFrame(step);
          };
          raf = requestAnimationFrame(step);
        }
      },
      { threshold: [0, 0.2] }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} data-stage="2" className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))]">
      {stats.map(s => (
        <div key={s.label} className="border-b border-r border-white/12 p-[34px_20px_30px]">
          <div
            className="font-display font-extrabold text-[clamp(48px,6vw,92px)] leading-[.84] tracking-[-.045em]"
            style={{ color: s.color }}
          >
            {s.n ? Math.round(s.n * p) : "—"}
          </div>
          <div className="mt-[16px] font-mono text-[10px] tracking-[.22em] uppercase text-dim">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function SignalSection({
  repos,
  activity,
  profile,
}: {
  repos: Repo[];
  activity: Activity | null;
  profile: Profile | null;
}) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const signal = repos.filter(isSignal);
  const stars = repos.reduce((s, r) => s + r.stars, 0);
  const stats: Stat[] = [
    { n: profile?.public_repos || repos.length || 0, label: "Public repositories", color: "#f4f2ed" },
    { n: signal.length, label: "Substantive projects", color: "#d8fb3c" },
    { n: languageBreakdown(signal).length, label: "Languages shipped", color: "#f4f2ed" },
    { n: stars, label: "Stars earned", color: "#ff4b2b" },
  ];

  return (
    <section ref={ref} id="signal" data-panel="Signal" className="relative overflow-hidden p-[110px_30px]">
      <div data-stage="1">
        <div className="grid grid-cols-1 gap-[24px] border-b border-white/14 pb-[22px] lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] lg:items-end lg:gap-[40px]">
          <div>
            <div className="mb-[16px] font-mono text-[10px] tracking-[.3em] uppercase text-hot">[ 02 ] Signal</div>
            <h2
              data-trace
              className="m-0 font-display font-extrabold text-[min(7.2vw,128px)] leading-[.84] tracking-[-.04em] uppercase"
            >
              <span data-line="ink" className="block" style={{ WebkitTextStroke: "1.1px #f4f2ed" }}>
                A decade
              </span>
              <span
                data-ghost
                className="block"
                style={{ WebkitTextStroke: "1.2px #f4f2ed", WebkitTextFillColor: "transparent" }}
              >
                of output.
              </span>
            </h2>
          </div>
          <p className="m-0 text-[13.5px] leading-[1.6] text-mute">
            Every number here is fetched from the GitHub API at load. Push tonight and this page is different
            tomorrow.
          </p>
        </div>

        <StatsCells stats={stats} />

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))]">
          <div className="min-w-0 border-b border-r border-white/12 p-[38px_24px_20px]">
            <div className="mb-[10px] flex items-baseline justify-between gap-[20px]">
              <h3 className="m-0 font-mono text-[11px] font-bold tracking-[.22em] uppercase text-ink">
                Language distribution
              </h3>
              <span className="font-mono text-[9.5px] tracking-[.16em] uppercase text-faint">by repo count</span>
            </div>
            <LanguageRadial repos={repos} />
          </div>
          <div className="min-w-0 border-b border-white/12 p-[38px_24px_20px]">
            <div className="mb-[10px] flex items-baseline justify-between gap-[20px]">
              <h3 className="m-0 font-mono text-[11px] font-bold tracking-[.22em] uppercase text-ink">
                Commit activity
              </h3>
              <span className="font-mono text-[9.5px] tracking-[.16em] uppercase text-faint">trailing 90 days</span>
            </div>
            <ActivityChart activity={activity} />
          </div>
        </div>
      </div>
    </section>
  );
}
