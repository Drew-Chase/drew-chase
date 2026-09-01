import {useEffect, useRef} from "react";

// Acid ring that trails the pointer and swells over links (fine pointers only).
export default function Cursor() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!matchMedia("(pointer: fine)").matches) return;
        const el = ref.current;
        if (!el) return;
        const onMove = (e: PointerEvent) => {
            el.style.opacity = "1";
            el.style.transform = `translate3d(${e.clientX - 13}px, ${e.clientY - 13}px, 0) scale(${e.target instanceof Element && e.target.closest("a") ? 2.1 : 1})`;
        };
        window.addEventListener("pointermove", onMove, {passive: true});
        return () => window.removeEventListener("pointermove", onMove);
    }, []);

    return (
        <div
            ref={ref}
            className="pointer-events-none fixed top-0 left-0 z-[95] h-[26px] w-[26px] rounded-full border border-accent opacity-0 mix-blend-difference"
            style={{transition: "transform .18s cubic-bezier(.16,1,.3,1), opacity .3s"}}
        />
    );
}
