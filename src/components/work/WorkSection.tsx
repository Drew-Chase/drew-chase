import { useRef } from "react";
import { Link } from "react-router-dom";
import { buildFeatured, type Profile, type Repo } from "../../lib/gh";
import { useReveal } from "../../hooks/panels";

export default function WorkSection({ repos, profile }: { repos: Repo[]; profile: Profile | null }) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const featured = buildFeatured(repos);
  const count = profile?.public_repos || repos.length || "242";

  return (
    <section ref={ref} id="work" data-panel="Work" className="relative overflow-hidden p-[110px_0_0]">
      <div data-stage="1" className="px-[30px]">
        <div className="flex flex-wrap items-end justify-between gap-[30px] border-b border-white/14 pb-[22px]">
          <div>
            <div className="mb-[16px] font-mono text-[10px] tracking-[.3em] uppercase text-hot">
              [ 01 ] Selected work
            </div>
            <h2
              data-trace
              className="m-0 font-display font-extrabold text-[clamp(40px,7.4vw,128px)] leading-[.84] tracking-[-.04em] uppercase"
            >
              <span data-line="ink" className="block" style={{ WebkitTextStroke: "1.1px #f4f2ed" }}>
                Built it.
              </span>
              <span data-line="acid" className="block text-accent" style={{ WebkitTextStroke: "1.1px #d8fb3c" }}>
                Use it daily.
              </span>
            </h2>
          </div>
          <Link
            to="/releases"
            data-magnet="1"
            className="border-b border-white/20 pb-[5px] font-mono text-[10.5px] tracking-[.18em] uppercase text-mute hover:border-accent hover:text-accent"
          >
            All {count} repositories ↗
          </Link>
        </div>

        <div data-stage="2" className="flex flex-col">
          {featured.map(p => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="grid grid-cols-[74px_minmax(0,auto)_minmax(0,1fr)_118px_150px_40px] items-center gap-[22px] border-b border-white/12 p-[30px_16px] text-ink transition-[background,padding] duration-[250ms] hover:bg-accent hover:pl-[30px] hover:text-[#0a0a0b]"
            >
              <span className="font-mono text-[11px] tracking-[.16em] opacity-45">{p.index} —</span>
              <span className="min-w-0 whitespace-nowrap font-display font-extrabold text-[clamp(20px,2.5vw,44px)] leading-[.95] tracking-[-.03em] uppercase">
                {p.title}
              </span>
              <span className="min-w-0 text-[13px] leading-[1.5] opacity-62 [text-wrap:pretty]">
                {p.description}
              </span>
              <span className="truncate font-mono text-[10.5px] tracking-[.14em] uppercase opacity-75">
                {p.language}
              </span>
              <span className="whitespace-nowrap font-mono text-[10.5px] tracking-[.14em] opacity-55">
                ★ {p.stars} · {p.pushed}
              </span>
              <span className="text-right font-display font-bold text-[26px]">↗</span>
            </a>
          ))}
        </div>
      </div>

      <div className="mt-[90px] overflow-hidden border-t border-b border-white/14 bg-accent">
        <div className="flex w-max" style={{ animation: "marq 26s linear infinite", willChange: "transform" }}>
          <span className="whitespace-nowrap py-[14px] font-display font-extrabold text-[clamp(30px,5vw,76px)] leading-none tracking-[-.03em] uppercase text-[#0a0a0b]">
            Rust · TypeScript · React · Docker · Rust · TypeScript · React · Docker ·&nbsp;
          </span>
          <span
            aria-hidden="true"
            className="whitespace-nowrap py-[14px] font-display font-extrabold text-[clamp(30px,5vw,76px)] leading-none tracking-[-.03em] uppercase text-[#0a0a0b]"
          >
            Rust · TypeScript · React · Docker · Rust · TypeScript · React · Docker ·&nbsp;
          </span>
        </div>
      </div>
    </section>
  );
}
