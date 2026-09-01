import {useMemo, useRef} from "react";
import {Link} from "react-router-dom";
import * as gh from "../../lib/gh";
import type {Repo} from "../../lib/gh";
import Constellation from "./Constellation";

export default function Hero({repos}: {repos: Repo[]}) {
  const sectionRef = useRef<HTMLElement>(null);
  const signal = useMemo(() => repos.filter(gh.isSignal), [repos]);
  const ticker = useMemo(() => {
    const names = (signal.length ? signal : Array.from({length: 14}, () => ({name: "loading"})))
      .slice(0, 22)
      .map(r => r.name);
    return [...names, ...names];
  }, [signal]);

  return (
    <section
      id="top"
      data-panel="Intro"
      ref={sectionRef}
      className="relative flex min-h-screen flex-col justify-end overflow-hidden pt-[96px]"
    >
      <Constellation repos={repos} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 40%, transparent 20%, rgba(10,10,11,.62) 100%), linear-gradient(180deg, rgba(10,10,11,.7) 0%, transparent 26%, rgba(10,10,11,.86) 88%, #0a0a0b 100%)",
        }}
      />
      <div className="pointer-events-none relative p-[0_30px_30px]">
        <div
          className="mb-[clamp(14px,2.6vh,26px)] flex items-center gap-[14px] font-mono text-[10px] uppercase tracking-[.28em] text-accent"
          style={{animation: "riseIn .7s cubic-bezier(.16,1,.3,1) 1.95s both"}}
        >
          <span className="h-[7px] w-[7px] rounded-full bg-accent" style={{animation: "blink 2.2s ease-in-out infinite"}} />
          Lead Software Engineer · Winslow, Maine · Est. 2016
        </div>
        <h1
          className="mb-[clamp(18px,3vh,30px)] font-display font-extrabold uppercase leading-[.84] tracking-[-.045em] text-[clamp(38px,min(9.6vw,15.5vh),200px)]"
        >
          <span className="flex gap-[0_.26em] whitespace-nowrap">
            <span className="inline-block" style={{WebkitTextStroke: "1.2px #f4f2ed", animation: "traceInk 1.15s cubic-bezier(.5,0,.2,1) 2.05s both"}}>
              Full
            </span>
            <span className="inline-block" style={{WebkitTextStroke: "1.2px #f4f2ed", animation: "traceInk 1.15s cubic-bezier(.5,0,.2,1) 2.22s both"}}>
              stack,
            </span>
          </span>
          <span className="flex gap-[0_.26em] whitespace-nowrap text-accent">
            <span className="inline-block" style={{WebkitTextStroke: "1.2px #d8fb3c", animation: "traceAcid 1.15s cubic-bezier(.5,0,.2,1) 2.42s both"}}>
              all
            </span>
            <span className="inline-block" style={{WebkitTextStroke: "1.2px #d8fb3c", animation: "traceAcid 1.15s cubic-bezier(.5,0,.2,1) 2.56s both"}}>
              the
            </span>
            <span className="inline-block" style={{WebkitTextStroke: "1.2px #d8fb3c", animation: "traceAcid 1.15s cubic-bezier(.5,0,.2,1) 2.7s both"}}>
              way
            </span>
          </span>
          <span
            className="block"
            style={{WebkitTextStroke: "1.4px #f4f2ed", WebkitTextFillColor: "transparent", animation: "traceGhost .9s cubic-bezier(.5,0,.2,1) 2.92s both"}}
          >
            down.
          </span>
        </h1>
        <div
          className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-[40px] border-t border-white/14 pt-[22px]"
          style={{animation: "riseIn .8s cubic-bezier(.16,1,.3,1) 3.3s both"}}
        >
          <p className="max-w-[560px] text-pretty leading-[1.6] text-body text-[clamp(14px,1.2vw,17px)]">
            Rust systems work, full-stack web, and the infrastructure underneath both. I own the entire stack for a 15-store retail chain — backend, frontend, mobile, desktop, deploys.
          </p>
          <div className="pointer-events-auto flex gap-[10px]">
            <a
              href="#work"
              data-magnet="1"
              className="inline-flex items-center gap-[10px] bg-accent p-[15px_24px] font-mono text-[10.5px] font-bold uppercase tracking-[.18em] text-[#0a0a0b] hover:bg-ink"
            >
              The work →
            </a>
            <Link
              to="/releases"
              data-magnet="1"
              className="inline-flex items-center gap-[10px] border border-white/20 p-[15px_24px] font-mono text-[10.5px] uppercase tracking-[.18em] text-ink hover:border-accent hover:text-accent"
            >
              Downloads
            </Link>
          </div>
        </div>
      </div>
      <div
        className="relative overflow-hidden border-b border-t border-white/14 bg-base"
        style={{animation: "riseIn .8s cubic-bezier(.16,1,.3,1) 3.5s both"}}
      >
        <div className="flex w-max" style={{animation: "marq 42s linear infinite", willChange: "transform"}}>
          {ticker.map((label, i) => (
            <span
              key={i}
              className="flex items-center gap-[18px] whitespace-nowrap p-[12px_18px] font-mono text-[11px] uppercase tracking-[.16em]"
              style={{color: i % 4 === 1 ? "#d8fb3c" : "#6b686f"}}
            >
              {label}
              <span style={{color: "#34333a"}}>/</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
