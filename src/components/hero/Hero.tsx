import {useMemo} from "react";
import {Link} from "react-router-dom";
import * as gh from "../../lib/gh";
import type {Repo} from "../../lib/gh";
import Constellation from "./Constellation";

export default function Hero({repos}: {repos: Repo[]}) {
  const signal = useMemo(() => repos.filter(gh.isSignal), [repos]);
  const caption = signal.length ? `${signal.length} projects · hover a node` : "Mapping repositories…";
  const legend = useMemo(
    () =>
      gh.languageBreakdown(signal)
        .slice(0, 4)
        .map(l => ({label: l.language, color: gh.LANG_COLOR[l.language] || "#6d6b74"})),
    [signal]
  );

  return (
    <section id="top" data-panel="Intro" className="relative h-screen min-h-[680px] snap-start overflow-hidden">
      <Constellation repos={repos} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 72% 40%, rgba(255,179,64,.1), transparent 62%), radial-gradient(130% 120% at 50% 50%, transparent 26%, rgba(8,8,10,.72) 100%), linear-gradient(90deg, rgba(8,8,10,.94) 0%, rgba(8,8,10,.5) 44%, transparent 74%), linear-gradient(180deg, rgba(8,8,10,.6) 0%, transparent 22%, rgba(8,8,10,.55) 92%, #08080a 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-center px-[34px]">
        <div className="max-w-[1000px]" style={{animation: "riseIn .9s cubic-bezier(.16,1,.3,1) both"}}>
          <div className="mb-[26px] flex items-center gap-3 font-mono text-[11px] uppercase tracking-[.24em] text-accent">
            <span className="size-1.5 rounded-full bg-accent" style={{animation: "blink 2.4s ease-in-out infinite"}} />
            Lead Software Engineer · Winslow, Maine
          </div>
          <h1
            className="mb-7 font-display font-normal leading-[.92] tracking-[-.02em] text-balance text-ink"
            style={{fontSize: "clamp(52px, 8.4vw, 140px)"}}
          >
            Full stack,
            <br />
            <i className="text-accent">all the way</i> down.
          </h1>
          <p
            className="mb-[38px] max-w-[620px] text-pretty leading-[1.6] text-body"
            style={{fontSize: "clamp(16px, 1.35vw, 20px)"}}
          >
            Rust systems work, full-stack web, and the infrastructure underneath both. Sole owner of the stack for a
            15-store retail chain — backend, frontend, mobile, desktop, and deploys.
          </p>
          <div className="pointer-events-auto flex flex-wrap gap-3">
            <a
              href="#work"
              className="inline-flex items-center gap-2.5 rounded-[2px] bg-ink px-[22px] py-3.5 font-mono text-[11px] font-medium uppercase tracking-[.16em] text-[#08080a] transition-colors hover:bg-accent"
            >
              See the work →
            </a>
            <Link
              to="/releases"
              className="inline-flex items-center gap-2.5 rounded-[2px] border border-white/18 px-[22px] py-3.5 font-mono text-[11px] uppercase tracking-[.16em] text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Releases &amp; downloads
            </Link>
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-[30px] left-[34px] flex items-end gap-7 font-mono text-[10px] uppercase tracking-[.16em] text-dim"
        style={{animation: "fadeIn 1.6s ease both"}}
      >
        <div className="flex flex-col gap-1.5">
          <span className="text-[#a3a1a8]">Project constellation</span>
          <span>{caption}</span>
        </div>
        <div className="flex items-center gap-3.5">
          {legend.map(l => (
            <span key={l.label} className="flex items-center gap-[7px]">
              <span className="size-[7px] rounded-full" style={{background: l.color}} />
              <span>{l.label}</span>
            </span>
          ))}
        </div>
      </div>
      <div
        className="absolute bottom-[30px] right-[34px] flex flex-col items-center gap-2 font-mono text-[9px] uppercase tracking-[.2em] text-dim"
        style={{animation: "drift 3.4s ease-in-out infinite"}}
      >
        <span>scroll</span>
        <span className="h-[34px] w-px" style={{background: "linear-gradient(180deg, #6d6b74, transparent)"}} />
      </div>
    </section>
  );
}
