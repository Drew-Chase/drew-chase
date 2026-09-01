import {useRef} from "react";
import {Link} from "react-router-dom";
import {useReveal} from "../../hooks/panels";
import resumePdf from "../../pdf/resume.pdf?url";

interface LinkItem {
    kind: string;
    value: string;
    note: string;
    href: string;
    external?: boolean;
    internal?: boolean;
    download?: boolean;
}

function buildLinks(repoCount: number): LinkItem[] {
    return [
        {kind: "Email", href: "mailto:me@drew-chase.com", value: "me@drew-chase.com", note: "say hello"},
        {kind: "GitHub", href: "https://github.com/Drew-Chase", value: "@Drew-Chase ↗", note: `${repoCount || 242} public repos`, external: true},
        {kind: "LinkedIn", href: "https://linkedin.com/in/drew-chase-762998171", value: "/in/drew-chase ↗", note: "professional", external: true},
        {kind: "crates.io", href: "https://crates.io/users/Drew-Chase", value: "Published crates ↗", note: "rust packages", external: true},
        {kind: "YouTube", href: "https://www.youtube.com/@drew-chase", value: "@drew-chase ↗", note: "build logs", external: true},
        {kind: "Discord", href: "https://discord.com/users/394008015986098177", value: "drewchase", note: "dm open", external: true},
        {kind: "Résumé", href: resumePdf, value: "Download PDF ↓", note: "v1.0", download: true},
        {kind: "Writing", href: "/blog", value: "Notes ↗", note: "coming soon", internal: true},
    ];
}

export default function ContactSection({repoCount}: {repoCount: number}) {
    const ref = useRef<HTMLElement>(null);
    useReveal(ref);
    const links = buildLinks(repoCount);
    return (
        <section ref={ref} id="contact" data-panel="Contact" className="relative p-[110px_30px_60px] overflow-hidden border-t border-white/12">
            <div data-stage="1">
                <div className="font-mono text-[10px] tracking-[.3em] uppercase text-hot mb-[26px]">[ 05 ] Contact</div>
                <a
                    href="mailto:me@drew-chase.com"
                    data-trace
                    data-ghost-all
                    className="block font-display font-extrabold text-[clamp(40px,9.4vw,190px)] leading-[.86] tracking-[-.05em] uppercase text-transparent mb-[46px] transition-[color,-webkit-text-stroke-color] duration-300 hover:text-accent hover:[-webkit-text-stroke-color:#d8fb3c]"
                    style={{WebkitTextStroke: "1.6px #f4f2ed"}}
                >
                    <span className="block">Let's build</span>
                    <span className="block">something</span>
                    <span className="block">sturdy.</span>
                </a>
                <div data-stage="2" className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] border-t border-white/14">
                    {links.map(l => {
                        const cls = "flex flex-col gap-[10px] p-[26px_20px] border-b border-r border-white/12 text-ink transition-[background] duration-[220ms] hover:bg-accent hover:text-[#0a0a0b]";
                        const body = (
                            <>
                                <span className="font-mono text-[9.5px] tracking-[.24em] uppercase opacity-50">{l.kind}</span>
                                <span className="font-display font-bold text-[20px] tracking-[-.02em]">{l.value}</span>
                                <span className="font-mono text-[9px] tracking-[.14em] uppercase opacity-38">{l.note}</span>
                            </>
                        );
                        if (l.internal) {
                            return (
                                <Link key={l.kind} to={l.href} data-magnet="1" className={cls}>
                                    {body}
                                </Link>
                            );
                        }
                        return (
                            <a
                                key={l.kind}
                                href={l.href}
                                target={l.external ? "_blank" : undefined}
                                rel={l.external ? "noreferrer" : undefined}
                                download={l.download}
                                data-magnet="1"
                                className={cls}
                            >
                                {body}
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
