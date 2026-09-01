import {Link} from "react-router-dom";

const MARQUEE = "Drew Chase — Full stack engineer — Drew Chase — Full stack engineer —\u00A0";

export default function Footer({note}: {note: string}) {
    return (
        <footer className="relative overflow-hidden border-t border-white/12">
            <div className="flex w-max will-change-transform" style={{animation: "marqR 30s linear infinite"}}>
                {[0, 1].map(i => (
                    <span
                        key={i}
                        className="font-display font-extrabold text-[clamp(38px,8vw,118px)] leading-[1.05] tracking-[-.04em] uppercase text-[rgba(244,242,237,.07)] py-[10px] whitespace-nowrap"
                    >
                        {MARQUEE}
                    </span>
                ))}
            </div>
            <div className="border-t border-white/12 p-[22px_30px] flex items-center justify-between gap-[24px] flex-wrap font-mono text-[10px] tracking-[.18em] uppercase text-faint">
                <span>© 2026 Drew Chase</span>
                <span>{note}</span>
                <Link to="/releases" data-magnet="1" className="text-mute hover:text-accent">
                    Projects &amp; releases ↗
                </Link>
            </div>
        </footer>
    );
}
