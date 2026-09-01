import { Link } from "react-router-dom";
import { buildFeatured, type Profile, type Repo } from "../../lib/gh";

export default function WorkSection({ repos, profile }: { repos: Repo[]; profile: Profile | null }) {
  const featured = buildFeatured(repos);
  const count = profile?.public_repos || repos.length || "All";

  return (
    <section
      id="work"
      data-panel="Work"
      className="relative min-h-screen snap-start overflow-hidden border-t border-white/7 pt-[130px] px-[34px] pb-[60px]"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-[40px] right-[26px] font-display text-[min(26vw,380px)] leading-[.74] text-white/[.025] select-none"
      >
        01
      </span>
      <div data-stage="1" className="relative mx-auto max-w-[1360px]">
        <div className="mb-[60px] flex flex-wrap items-baseline justify-between gap-[30px]">
          <div>
            <div className="mb-[18px] font-mono text-[10px] tracking-[.26em] uppercase text-dim">
              01 — Selected work
            </div>
            <h2 className="m-0 font-display font-normal text-[length:clamp(38px,4.6vw,76px)] leading-none tracking-[-.02em]">
              Things I built
              <br />
              <i className="text-accent">and actually use.</i>
            </h2>
          </div>
          <Link
            to="/releases"
            className="border-b border-white/20 pb-[4px] font-mono text-[11px] tracking-[.16em] text-[#a3a1a8] uppercase hover:border-accent hover:text-accent"
          >
            {count} repositories ↗
          </Link>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(360px,1fr))] gap-px border border-white/8 bg-white/8">
          {featured.map(p => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="relative flex min-h-[300px] flex-col gap-5 bg-panel p-[34px_30px_30px] text-ink hover:bg-panel-3"
            >
              <div className="flex items-baseline justify-between gap-4 font-mono text-[10px] tracking-[.18em] uppercase text-dim">
                <span>{p.index}</span>
                <span style={{ color: p.langColor }}>{p.language}</span>
              </div>
              <h3 className="m-0 font-display font-normal text-[40px] leading-[1.02] tracking-[-.015em]">{p.title}</h3>
              <p className="m-0 flex-1 text-pretty text-[14.5px] leading-[1.62] text-[#a3a1a8]">{p.description}</p>
              <div className="flex flex-wrap gap-[6px]">
                {p.tags.map(t => (
                  <span
                    key={t}
                    className="rounded-[2px] border border-white/12 px-[9px] py-[5px] font-mono text-[9.5px] tracking-[.12em] text-mute uppercase"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-white/8 pt-[18px] font-mono text-[10px] tracking-[.14em] text-dim uppercase">
                <span>
                  ★ {p.stars} · {p.pushed}
                </span>
                <span className="text-accent">Source ↗</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
