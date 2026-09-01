import {useRef} from "react";
import {useReveal} from "../../hooks/panels";

const GROUPS = [
    {
        title: "Primary",
        tone: "text-accent",
        big: true,
        chips: ["Rust", "TypeScript", "React", "PHP", "C++", "C#"],
    },
    {
        title: "Frameworks & UI",
        tone: "text-signal",
        big: false,
        chips: ["Actix", "Axum", "Tauri", "Iced", "Slint", "Node.js", ".NET", "React Native", "Qt", "Dear ImGui"],
    },
    {
        title: "Infrastructure & data",
        tone: "text-violet",
        big: false,
        chips: ["Docker", "AWS", "GCP", "MySQL", "TrueNAS SCALE", "Linux", "Windows"],
    },
] as const;

function chipClass(big: boolean, i: number): string {
    const base = "font-mono rounded-[2px] border";
    if (big) {
        return i === 0
            ? `${base} border-accent/35 bg-accent/7 text-[13px] text-ink px-[14px] py-[9px]`
            : `${base} border-white/14 text-[13px] text-ink px-[14px] py-[9px]`;
    }
    return `${base} border-white/12 text-[12.5px] text-[#c9c7ce] px-[13px] py-[8px]`;
}

export default function StackSection() {
    const ref = useRef<HTMLElement>(null);
    useReveal(ref);
    return (
        <section ref={ref} id="stack" data-panel="Stack" className="relative min-h-screen p-[120px_34px] border-t border-white/7 bg-base-2 snap-start">
            <span aria-hidden className="absolute top-[40px] right-[26px] font-display text-[min(26vw,380px)] leading-[.74] text-white/[.025] pointer-events-none select-none">
                03
            </span>
            <div data-stage="1" className="relative max-w-[1360px] mx-auto">
                <div className="grid grid-cols-[minmax(0,.8fr)_minmax(0,1.5fr)] gap-[70px] items-start">
                    <div className="sticky top-[110px]">
                        <div className="font-mono text-[10px] tracking-[.26em] uppercase text-dim mb-[18px]">03 — Stack</div>
                        <h2 className="font-display font-normal text-[clamp(38px,4.2vw,68px)] leading-none tracking-[-0.02em] mb-[22px]">
                            What I
                            <br />
                            <span className="italic text-accent">reach for.</span>
                        </h2>
                        <p className="text-[15px] leading-[1.65] text-mute">
                            Rust on both ends where I can, TypeScript where the browser insists, and my own boxes underneath rather than rented abstractions.
                        </p>
                    </div>
                    <div className="flex flex-col gap-px bg-white/8 border border-white/8">
                        {GROUPS.map(g => (
                            <div key={g.title} className="bg-panel p-[30px]">
                                <div className={`font-mono text-[10px] tracking-[.2em] uppercase mb-[20px] ${g.tone}`}>{g.title}</div>
                                <div className="flex flex-wrap gap-2">
                                    {g.chips.map((c, i) => (
                                        <span key={c} className={chipClass(g.big, i)}>
                                            {c}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
