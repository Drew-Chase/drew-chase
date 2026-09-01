import {Link} from "react-router-dom";

export default function Footer({note}: {note: string}) {
    return (
        <footer className="flex items-center justify-between gap-6 flex-wrap p-[28px_34px] border-t border-white/7 font-mono text-[10px] tracking-[.16em] uppercase text-faint">
            <span>© 2026 Drew Chase</span>
            <span>{note}</span>
            <Link to="/releases" className="text-mute hover:text-accent">
                Projects &amp; releases ↗
            </Link>
        </footer>
    );
}
