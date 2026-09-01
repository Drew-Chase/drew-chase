const DOT_EASE = "[transition-timing-function:cubic-bezier(.16,1,.3,1)]";

export default function SectionRail({sections, active}: {sections: readonly {id: string; label: string}[]; active: number}) {
    return (
        <div className="fixed right-[26px] top-1/2 -translate-y-1/2 z-[52] hidden lg:flex flex-col items-end gap-[15px]">
            {sections.map((s, i) => (
                <a key={s.id} href={`#${s.id}`} className="flex items-center gap-[11px] text-ink">
                    <span
                        className={`font-mono text-[9px] tracking-[.2em] uppercase transition-[opacity,color] duration-[350ms] ${
                            i === active ? "text-accent opacity-100" : "text-dim opacity-35"
                        }`}
                    >
                        {s.label}
                    </span>
                    <span
                        className={`h-[5px] rounded-[3px] transition-[width,background-color] duration-[400ms] ${DOT_EASE} ${
                            i === active ? "w-[26px] bg-accent" : "w-[10px] bg-white/22"
                        }`}
                    />
                </a>
            ))}
        </div>
    );
}
