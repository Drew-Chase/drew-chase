// Pointer-follow (magnet) effect for [data-magnet] elements, via event
// delegation so any element anywhere can opt in with a single attribute.
const TRANSITION = "transform .32s cubic-bezier(.16,1,.3,1), background .2s, border-color .2s, color .2s";
let current: HTMLElement | null = null;

function reset(el: HTMLElement | null) {
    if (el) el.style.transform = "translate(0,0)";
}

export function initMagnets(): () => void {
    const move = (e: PointerEvent) => {
        const el = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-magnet]") : null;
        if (el !== current) {
            reset(current);
            current = el;
            if (el) el.style.transition = TRANSITION;
        }
        if (!el) return;
        const b = el.getBoundingClientRect();
        const dx = (e.clientX - (b.left + b.width / 2)) * 0.28;
        const dy = (e.clientY - (b.top + b.height / 2)) * 0.42;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    const leave = () => reset(current);
    window.addEventListener("pointermove", move, {passive: true});
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
        window.removeEventListener("pointermove", move);
        document.documentElement.removeEventListener("pointerleave", leave);
        reset(current);
        current = null;
    };
}
