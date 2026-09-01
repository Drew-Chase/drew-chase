import {useRef} from "react";
import {useReveal} from "../../hooks/panels";

interface Card {
    label: string;
    href: string;
    value: string;
    hint?: string;
    accent?: boolean;
    external?: boolean;
}

const CARDS: Card[] = [
    {label: "Email", href: "mailto:hello@example.com", value: "hello@example.com", accent: true, hint: "replace with your address"},
    {label: "LinkedIn", href: "https://linkedin.com/in/drew-chase-762998171", value: "/in/drew-chase ↗", external: true},
    {label: "GitHub", href: "https://github.com/Drew-Chase", value: "@Drew-Chase ↗", external: true},
    {label: "crates.io", href: "https://crates.io/users/Drew-Chase", value: "Published crates ↗", external: true},
    {label: "YouTube", href: "https://www.youtube.com/@drew-chase", value: "@drew-chase ↗", external: true},
    {label: "Discord", href: "#", value: "drewchase", hint: "confirm handle"},
    {label: "Résumé", href: "#", value: "Download PDF ↓", hint: "link your file"},
    {label: "Writing", href: "#", value: "Notes & build logs ↗", hint: "point at your blog"},
];

export default function ContactSection() {
    const ref = useRef<HTMLElement>(null);
    useReveal(ref);
    return (
        <section
            ref={ref}
            id="contact"
            data-panel="Contact"
            className="relative min-h-screen p-[120px_34px_90px] border-t border-white/7 bg-gradient-to-b from-base-2 to-base snap-start overflow-hidden"
        >
            <span aria-hidden className="absolute top-[40px] right-[26px] font-display text-[min(26vw,380px)] leading-[.74] text-white/[.025] pointer-events-none select-none">
                05
            </span>
            <div data-stage="1" className="relative max-w-[1360px] mx-auto">
                <div className="font-mono text-[10px] tracking-[.26em] uppercase text-dim mb-[18px]">05 — Contact</div>
                <h2 className="font-display font-normal text-[clamp(44px,6.4vw,108px)] leading-[.98] tracking-[-0.025em] mb-[50px]">
                    Let's build
                    <br />
                    <span className="italic text-accent">something sturdy.</span>
                </h2>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-px bg-white/8 border border-white/8">
                    {CARDS.map(c => (
                        <a
                            key={c.label}
                            href={c.href}
                            target={c.external ? "_blank" : undefined}
                            rel={c.external ? "noreferrer" : undefined}
                            className="flex flex-col gap-3 bg-panel hover:bg-panel-3 p-[30px] text-ink"
                        >
                            <span className="font-mono text-[10px] tracking-[.2em] uppercase text-dim">{c.label}</span>
                            <span className={`font-mono text-[14px] ${c.accent ? "text-accent" : ""}`}>{c.value}</span>
                            {c.hint && <span className="font-mono text-[9.5px] tracking-[.1em] uppercase text-faint">{c.hint}</span>}
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
