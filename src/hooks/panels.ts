import {useEffect, useRef, useState, type RefObject} from "react";

const EASE = "cubic-bezier(.16,1,.3,1)";

function stageChildren(panel: Element): HTMLElement[] {
  const stage = panel.querySelector("[data-stage]");
  if (!stage) return [];
  const els = [...stage.children] as HTMLElement[];
  return els.length === 1 && els[0].children.length > 1 ? ([...els[0].children] as HTMLElement[]) : els;
}

/**
 * Staggered blur-reveal for a [data-panel] section: hides its [data-stage]
 * children while off-screen, then animates them in once the panel enters
 * the viewport (plus a safety timer so nothing can stay hidden).
 */
export function useReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const panel = ref.current;
    if (!panel || panel.dataset.revealed) return;
    const els = stageChildren(panel);
    if (!els.length) return;
    const ghost = panel.querySelector<HTMLElement>("span[aria-hidden]");
    const reveal = () => {
      if (panel.dataset.revealed) return;
      panel.dataset.revealed = "1";
      if (ghost) ghost.style.animation = `ghostIn 1.2s ${EASE} both`;
      els.forEach((el, i) => {
        el.style.opacity = "";
        el.style.animation = `revealBlur .95s ${EASE} ${i * 110}ms both`;
      });
    };
    if (panel.getBoundingClientRect().top > window.innerHeight * 0.86) {
      els.forEach(el => {
        el.style.opacity = "0";
      });
    }
    const io = new IntersectionObserver(
      es => {
        for (const en of es) {
          if (en.isIntersecting) {
            reveal();
            io.disconnect();
          }
        }
      },
      {rootMargin: "0px 0px -12% 0px"}
    );
    io.observe(panel);
    const safety = setTimeout(reveal, 2500);
    return () => {
      io.disconnect();
      clearTimeout(safety);
    };
  }, [ref]);
}

/**
 * Page-level scroll tracking over the named panels: writes the top progress
 * bar width straight to the DOM (no re-render) and reports the active panel.
 */
export function usePanels(ids: readonly string[]) {
  const progressRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const panels = ids.map(id => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (!panels.length) return;
    let raf = 0;
    const track = () => {
      raf = 0;
      const vh = window.innerHeight;
      const doc = document.documentElement;
      const top = Math.max(-doc.getBoundingClientRect().top, window.scrollY || 0);
      const max = Math.max(1, doc.scrollHeight - vh);
      if (progressRef.current) {
        progressRef.current.style.width = (Math.min(1, Math.max(0, top / max)) * 100).toFixed(2) + "%";
      }
      let a = 0;
      panels.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= vh * 0.42) a = i;
      });
      setActive(prev => (prev === a ? prev : a));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(track);
    };
    track();
    window.addEventListener("scroll", onScroll, {passive: true});
    window.addEventListener("resize", onScroll, {passive: true});
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);

  return {progressRef, active};
}
