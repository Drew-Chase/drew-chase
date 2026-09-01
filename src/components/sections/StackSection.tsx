import {useRef} from "react";
import {useReveal} from "../../hooks/panels";

const LANES = [
    {text: "Rust · TypeScript · React · PHP · C++ · C# · Node · ", color: "#f4f2ed", stroke: "0", anim: "marq 30s linear infinite"},
    {text: "Actix · Axum · Tauri · Iced · Slint · .NET · Qt · ImGui · ", color: "transparent", stroke: "1px #6b686f", anim: "marqR 38s linear infinite"},
    {text: "Docker · AWS · GCP · MySQL · TrueNAS · Linux · ", color: "#d8fb3c", stroke: "0", anim: "marq 34s linear infinite"},
] as const;

export default function StackSection() {
    const ref = useRef<HTMLElement>(null);
    useReveal(ref);
    return (
        <section ref={ref} id="stack" data-panel="Stack" className="relative p-[110px_0] overflow-hidden">
            <div data-stage="1" className="px-[30px]">
                <div className="font-mono text-[10px] tracking-[.3em] uppercase text-hot mb-[16px]">[ 03 ] Stack</div>
                <h2 data-trace className="font-display font-extrabold text-[clamp(40px,7.4vw,128px)] leading-[.84] tracking-[-.04em] uppercase mb-[22px]">
                    <span className="block" data-line="ink" style={{WebkitTextStroke: "1.1px #f4f2ed"}}>What I</span>
                    <span className="block text-accent" data-line="acid" style={{WebkitTextStroke: "1.1px #d8fb3c"}}>reach for.</span>
                </h2>
                <p className="max-w-[540px] text-[14.5px] leading-[1.65] text-mute mb-[60px]">
                    Rust on both ends where I can, TypeScript where the browser insists, and my own hardware underneath rather than rented abstractions.
                </p>
            </div>
            <div className="flex flex-col border-t border-white/12">
                {LANES.map(l => (
                    <div key={l.anim} className="relative overflow-hidden border-b border-white/12 py-[4px]">
                        <div className="flex w-max will-change-transform" style={{animation: l.anim}}>
                            {[0, 1].map(i => (
                                <span
                                    key={i}
                                    className="font-display font-bold text-[clamp(24px,3.4vw,52px)] leading-[1.4] tracking-[-.02em] uppercase whitespace-nowrap"
                                    style={{color: l.color, WebkitTextStroke: l.stroke}}
                                >
                                    {l.text}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
