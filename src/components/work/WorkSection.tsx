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
              className="m-0 font-display font-extrabold text-[min(7.2vw,128px)] leading-[.84] tracking-[-.04em] uppercase"
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
              className="flex flex-col gap-[10px] border-b border-white/12 p-[24px_16px] text-ink transition-[background,padding] duration-[250ms] lg:grid lg:grid-cols-[74px_minmax(0,auto)_minmax(0,1fr)_118px_150px_40px] lg:items-center lg:gap-[22px] lg:p-[30px_16px] hover:bg-accent hover:pl-[30px] hover:text-[#0a0a0b]"
            >
              <div className="flex items-baseline gap-[12px] lg:contents">
                <span className="shrink-0 font-mono text-[11px] tracking-[.16em] opacity-45 lg:order-1">{p.index} —</span>
                <span className="min-w-0 break-words font-display font-extrabold text-[min(5.5vw,44px)] leading-[.95] tracking-[-.03em] uppercase lg:order-2 lg:whitespace-nowrap lg:text-[clamp(20px,2.5vw,44px)]">
                  {p.title}
                </span>
                <span className="ml-auto font-display font-bold text-[26px] lg:hidden">↗</span>
              </div>
              <span className="text-[13px] leading-[1.5] opacity-62 [text-wrap:pretty] lg:order-3">
                {p.description}
              </span>
              <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[4px] lg:contents">
                <span className="min-w-0 truncate font-mono text-[10.5px] tracking-[.14em] uppercase opacity-75 lg:order-4">
                  {p.language}
                </span>
                <span className="whitespace-nowrap font-mono text-[10.5px] tracking-[.14em] opacity-55 lg:order-5">
                  ★ {p.stars} · {p.pushed}
                </span>
              </div>
              <span className="hidden text-right font-display font-bold text-[26px] lg:order-6 lg:block">↗</span>
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
