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
        <section ref={ref} id="about" data-panel="About" className="p-[110px_30px] overflow-hidden">
            <div data-stage="1">
                <div className="font-mono text-[10px] tracking-[.3em] uppercase text-hot mb-[16px]">[ 04 ] About</div>
                <div className="grid grid-cols-1 gap-[40px] items-start lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-[70px]">
                    <div>
                        <h2 data-trace className="font-display font-extrabold text-[min(6.2vw,76px)] leading-[.9] tracking-[-.04em] uppercase mb-[34px] [text-wrap:pretty]">
                            <span className="block" data-line="ink" style={{WebkitTextStroke: "1px #f4f2ed"}}>I'd rather own the box</span>
                            <span className="block text-accent" data-line="acid" style={{WebkitTextStroke: "1px #d8fb3c"}}>than rent the abstraction.</span>
                        </h2>
                        <div className="flex flex-col gap-[20px] text-[16px] leading-[1.72] text-body max-w-[620px]">
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
                                Two hundred–odd public repositories is less a portfolio than a paper trail. The interesting part isn't the count — it's that most
                                of them are still installed on something I use every day.
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-white/14">
                        {facts.map(([k, v]) => (
                            <div key={k} className="flex items-baseline justify-between gap-[24px] p-[18px_4px] border-b border-white/12 font-mono text-[12px]">
                                <span className="text-[9.5px] tracking-[.22em] uppercase text-faint">{k}</span>
                                <span className="text-ink text-right">{v}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
