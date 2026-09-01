import {useRef} from "react";
import {useReveal} from "../../hooks/panels";

const FACTS: [string, string][] = [
    ["Role", "Lead Software Engineer"],
    ["Company", "Mardens Inc."],
    ["Based", "Winslow, Maine"],
    ["Primary", "Rust · TypeScript"],
];

export default function AboutSection({years}: {years: number | string}) {
    const ref = useRef<HTMLElement>(null);
    useReveal(ref);
    const facts: [string, string][] = [...FACTS, ["Shipping since", String(years || "—")], ["Crates", "crates.io/Drew-Chase"]];
    return (
        <section ref={ref} id="about" data-panel="About" className="relative min-h-screen p-[120px_34px] border-t border-white/7 snap-start overflow-hidden">
            <span aria-hidden className="absolute top-[40px] right-[26px] font-display text-[min(26vw,380px)] leading-[.74] text-white/[.025] pointer-events-none select-none">
                04
            </span>
            <div data-stage="1" className="relative max-w-[1360px] mx-auto">
                <div className="font-mono text-[10px] tracking-[.26em] uppercase text-dim mb-[18px]">04 — About</div>
                <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-[70px] items-start">
                    <div>
                        <h2 className="font-display font-normal text-[clamp(34px,3.6vw,58px)] leading-[1.06] tracking-[-0.02em] mb-[32px] [text-wrap:pretty]">
                            I'd rather own the box
                            <br />
                            <span className="italic text-accent">than rent the abstraction.</span>
                        </h2>
                        <div className="flex flex-col gap-5 text-[16.5px] leading-[1.72] text-body max-w-[620px]">
                            <p className="[text-wrap:pretty]">
                                I'm the Lead Software Engineer at Mardens Inc., where I own the entire stack for a 15-store retail chain — purchase-order tracking,
                                label and barcode printing, pricing systems. Rust and React/TypeScript, containerized, running on AWS.
                            </p>
                            <p className="[text-wrap:pretty]">
                                Off the clock I write Rust for things I want to exist: an SFTP client that doesn't feel like 2004, a shell interpreter, a Minecraft
                                server panel, a media dashboard that swallows Plex and the *arrs whole. A handful of crates are published to crates.io. The rest
                                runs on hardware in my house.
                            </p>
                            <p className="[text-wrap:pretty]">
                                Two hundred–odd public repositories is less a portfolio than a paper trail. The interesting part isn't the count — it's that most of
                                them are still installed on something I use every day.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-px bg-white/8 border border-white/8">
                        {facts.map(([k, v]) => (
                            <div key={k} className="flex items-baseline justify-between gap-6 bg-panel px-[26px] py-[22px] font-mono text-[12px]">
                                <span className="text-[10px] tracking-[.18em] uppercase text-dim">{k}</span>
                                <span className="text-ink text-right">{v}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
