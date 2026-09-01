import {useEffect, useRef} from "react";

const SLABS = ["#d8fb3c", "#0f1013", "#d8fb3c", "#0f1013", "#ff4b2b", "#0f1013", "#d8fb3c"];

// Boot sequence: a counter rolling up to the public repo count over 1.5s
// above a 7-slab curtain that sweeps up once the counter finishes.
export default function IntroVeil({target}: {target?: number}) {
    const loaderRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const curtainRef = useRef<HTMLDivElement>(null);
    const targetRef = useRef(target || 242);
    targetRef.current = target || 242;

    useEffect(() => {
        let raf = 0;
        const t0 = performance.now();
        const step = () => {
            const p = Math.min(1, (performance.now() - t0) / 1500);
            const e = 1 - Math.pow(1 - p, 2.4);
            if (counterRef.current) {
                counterRef.current.textContent = String(Math.round(e * targetRef.current)).padStart(3, "0");
            }
            if (barRef.current) barRef.current.style.width = (e * 100).toFixed(1) + "%";
            if (p < 1) {
                raf = requestAnimationFrame(step);
                return;
            }
            const l = loaderRef.current;
            if (l) {
                l.style.opacity = "0";
                l.style.visibility = "hidden";
            }
        };
        raf = requestAnimationFrame(step);
        const hide = setTimeout(() => {
            if (curtainRef.current) curtainRef.current.style.display = "none";
        }, 3000);
        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(hide);
        };
    }, []);

    return (
        <>
            <div ref={curtainRef} className="pointer-events-none fixed inset-0 z-[998] grid grid-cols-7">
                {SLABS.map((c, i) => (
                    <span
                        key={i}
                        className="h-full"
                        style={{background: c, animation: `curtainUp .82s cubic-bezier(.76,0,.24,1) ${(1.42 + i * 0.08).toFixed(2)}s both`}}
                    />
                ))}
            </div>
            <div
                ref={loaderRef}
                className="fixed inset-0 z-[999] flex flex-col justify-end bg-base p-[44px] transition-[opacity,visibility] duration-500"
            >
                <div className="flex items-end justify-between gap-[30px]">
                    <div className="font-mono text-[10px] tracking-[.3em] uppercase text-accent">
                        Indexing github
                        <span style={{animation: "blink 1s steps(1) infinite"}}>_</span>
                    </div>
                    <div
                        ref={counterRef}
                        className="font-display font-extrabold text-[clamp(70px,16vw,220px)] leading-[.8] tracking-[-.04em] text-ink"
                    >
                        000
                    </div>
                </div>
                <div className="mt-[26px] h-[2px] bg-white/10">
                    <div ref={barRef} className="h-full w-0 bg-accent"/>
                </div>
            </div>
        </>
    );
}
