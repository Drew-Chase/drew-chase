import {useRef} from "react";
import {useReveal} from "../../hooks/panels";

interface LinkItem {
    kind: string;
    value: string;
    note: string;
    href: string;
    external?: boolean;
}

function buildLinks(repoCount: number): LinkItem[] {
    return [
        {kind: "Email", href: "mailto:hello@example.com", value: "hello@example.com", note: "replace with your address"},
        {kind: "GitHub", href: "https://github.com/Drew-Chase", value: "@Drew-Chase ↗", note: `${repoCount || 242} public repos`, external: true},
        {kind: "LinkedIn", href: "https://linkedin.com/in/drew-chase-762998171", value: "/in/drew-chase ↗", note: "professional", external: true},
        {kind: "crates.io", href: "https://crates.io/users/Drew-Chase", value: "Published crates ↗", note: "rust packages", external: true},
        {kind: "YouTube", href: "https://www.youtube.com/@drew-chase", value: "@drew-chase ↗", note: "build logs", external: true},
        {kind: "Discord", href: "#", value: "drewchase", note: "confirm handle"},
        {kind: "Résumé", href: "#", value: "Download PDF ↓", note: "link your file"},
        {kind: "Writing", href: "#", value: "Notes ↗", note: "point at your blog"},
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
                    href="mailto:hello@example.com"
                    data-trace
                    data-ghost-all
                    className="block font-display font-extrabold text-[clamp(40px,9.4vw,190px)] leading-[.86] tracking-[-.05em] uppercase text-transparent mb-[46px] transition-[color] duration-300 hover:text-accent hover:[-webkit-text-stroke-color:#d8fb3c]"
                    style={{WebkitTextStroke: "1.6px #f4f2ed"}}
                >
                    <span className="block">Let's build</span>
                    <span className="block">something</span>
                    <span className="block">sturdy.</span>
                </a>
                <div data-stage="2" className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] border-t border-white/14">
                    {links.map(l => (
                        <a
                            key={l.kind}
                            href={l.href}
                            target={l.external ? "_blank" : undefined}
                            rel={l.external ? "noreferrer" : undefined}
                            className="flex flex-col gap-[10px] p-[26px_20px] border-b border-r border-white/12 text-ink transition-[background] duration-[220ms] hover:bg-accent hover:text-[#0a0a0b]"
                        >
                            <span className="font-mono text-[9.5px] tracking-[.24em] uppercase opacity-50">{l.kind}</span>
                            <span className="font-display font-bold text-[20px] tracking-[-.02em]">{l.value}</span>
                            <span className="font-mono text-[9px] tracking-[.14em] uppercase opacity-38">{l.note}</span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
