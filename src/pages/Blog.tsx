import {useRef} from "react";
import {Link} from "react-router-dom";
import Cursor from "../components/chrome/Cursor.tsx";
import Magnet from "../components/chrome/Magnet.tsx";
import {useReveal} from "../hooks/panels.ts";
import {usePageMeta} from "../lib/meta.ts";

export default function Blog() {
    usePageMeta("Blog — Drew Chase", "Notes and build logs by Drew Chase.");
    const ref = useRef<HTMLElement>(null);
    useReveal(ref);
    return (
        <main ref={ref} data-panel="Blog" className="relative min-h-screen bg-base text-ink flex flex-col items-center justify-center gap-[34px] p-[30px] text-center overflow-hidden">
            <div className="noise-overlay" aria-hidden="true"/>
            <Cursor/>
            <Magnet/>
            <div className="font-mono text-[10px] tracking-[.3em] uppercase text-hot">[ 06 ] Writing</div>
            <h1
                data-trace
                data-ghost-all
                className="font-display font-extrabold text-[clamp(40px,9.4vw,190px)] leading-[.86] tracking-[-.05em] uppercase text-transparent"
                style={{WebkitTextStroke: "1.6px #f4f2ed"}}
            >
                <span className="block">Blog coming</span>
                <span className="block">soon.</span>
            </h1>
            <p className="max-w-[460px] font-mono text-[11px] tracking-[.18em] uppercase text-dim leading-[1.8]">
                Notes and build logs are being typeset — check back shortly.
            </p>
            <Link
                to="/"
                data-magnet="1"
                className="inline-flex items-center gap-[10px] p-[15px_24px] border border-white/20 text-ink font-mono text-[10.5px] tracking-[.18em] uppercase hover:border-accent hover:text-accent"
            >
                ← Back home
            </Link>
        </main>
    );
}
