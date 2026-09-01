import type {RefObject} from "react";
import {useNavigate} from "react-router-dom";

const LINKS = [
    {href: "#work", label: "Work"},
    {href: "#signal", label: "Signal"},
    {href: "#stack", label: "Stack"},
    {href: "#about", label: "About"},
];

export default function Nav({progressRef}: {progressRef: RefObject<HTMLDivElement | null>}) {
    const navigate = useNavigate();
    return (
        <>
            <div className="fixed top-0 left-0 right-0 h-[2px] z-[55] bg-white/6">
                <div ref={progressRef} className="h-full w-0 bg-gradient-to-r from-signal to-accent"/>
            </div>
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-6 p-[18px_34px] bg-[linear-gradient(180deg,rgba(8,8,10,.92),rgba(8,8,10,.35)_70%,transparent)] backdrop-blur-[6px]">
                <a href="#top" className="flex items-baseline gap-[10px] text-ink">
                    <span className="font-mono text-[13px] font-medium tracking-[.22em] uppercase">Drew Chase</span>
                    <span className="font-mono text-[10px] tracking-[.18em] uppercase text-accent">FS·ENG</span>
                </a>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-1 font-mono text-[11px] tracking-[.14em] uppercase">
                        {LINKS.map(l => (
                            <a
                                key={l.href}
                                href={l.href}
                                className="px-[12px] py-2 text-mute hover:text-ink hover:bg-white/6 rounded-[2px] transition-colors"
                            >
                                {l.label}
                            </a>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate("/releases")}
                        className="ml-0 md:ml-[10px] inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-[2px] border-0 px-[15px] py-[9px] font-mono text-[11px] font-medium tracking-[.16em] uppercase bg-accent text-[#08080a] hover:bg-accent-hi focus-visible:outline-none"
                    >
                        All projects ↗
                    </button>
                </div>
            </nav>
        </>
    );
}
