import {Link} from "react-router-dom";
import Cursor from "../components/chrome/Cursor.tsx";
import Magnet from "../components/chrome/Magnet.tsx";

export default function NotFound() {
    return (
        <main className="relative min-h-screen bg-base text-ink flex flex-col items-center justify-center gap-[34px] p-[30px] text-center overflow-hidden">
            <div className="noise-overlay" aria-hidden="true"/>
            <Cursor/>
            <Magnet/>
            <div className="font-mono text-[10px] tracking-[.3em] uppercase text-hot">[ 404 ] Signal lost</div>
            <h1
                className="font-display font-extrabold text-[clamp(80px,22vw,320px)] leading-[.84] tracking-[-.045em] uppercase text-transparent transition-[color,-webkit-text-stroke-color] duration-300 hover:text-accent hover:[-webkit-text-stroke-color:#d8fb3c]"
                style={{WebkitTextStroke: "1.6px #f4f2ed"}}
            >
                404
            </h1>
            <p className="max-w-[420px] font-mono text-[11px] tracking-[.18em] uppercase text-dim leading-[1.8]">
                Nothing is installed at this address — the index goes deeper than the map.
            </p>
            <div className="flex gap-[10px]">
                <Link
                    to="/"
                    data-magnet="1"
                    className="inline-flex items-center gap-[10px] p-[15px_24px] bg-accent text-[#0a0a0b] font-mono text-[10.5px] font-bold tracking-[.18em] uppercase hover:bg-ink"
                >
                    Back home →
                </Link>
                <Link
                    to="/releases"
                    data-magnet="1"
                    className="inline-flex items-center gap-[10px] p-[15px_24px] border border-white/20 text-ink font-mono text-[10.5px] tracking-[.18em] uppercase hover:border-accent hover:text-accent"
                >
                    Index ↗
                </Link>
            </div>
        </main>
    );
}
