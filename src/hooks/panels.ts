import {useEffect, useRef, useState, type RefObject} from "react";

const EASE = "cubic-bezier(.16,1,.3,1)";
const TRACE_EASE = "cubic-bezier(.5,0,.2,1)";

function stageChildren(panel: Element): HTMLElement[] {
  const out: HTMLElement[] = [];
  for (const stage of [...panel.querySelectorAll<HTMLElement>("[data-stage]")]) {
    let els = [...stage.children] as HTMLElement[];
    if (stage.dataset.stage === "1" && els.length === 1 && els[0].children.length > 1) {
      els = [...els[0].children] as HTMLElement[];
    }
    // a nested stage animates its own children, not itself
    out.push(...els.filter(el => !el.hasAttribute("data-stage")));
  }
  return out;
}

/**
 * Scroll choreography for a [data-panel] section: hides [data-stage] children
 * while off-screen, then on enter plays staggered revealBlur on them plus the
 * outline-trace on any [data-trace] heading (per-line via data-line="ink" |
 * "acid" | "ghost"). A safety timer guarantees nothing stays hidden.
 */
export function useReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const panel = ref.current;
    if (!panel || panel.dataset.revealed) return;
    const els = stageChildren(panel);
    const heads = [...panel.querySelectorAll<HTMLElement>("[data-trace]")];

    const trace = () => {
      for (const h of heads) {
        if (h.dataset.traced) continue;
        h.dataset.traced = "1";
        const ghostAll = h.hasAttribute("data-ghost-all");
        const lines = h.children.length ? ([...h.children] as HTMLElement[]) : [h as HTMLElement];
        lines.forEach((line, i) => {
          const kind = ghostAll || line.hasAttribute("data-ghost") ? "Ghost" : line.dataset.line === "acid" ? "Acid" : "Ink";
          line.style.animation = `trace${kind} 1.05s ${TRACE_EASE} ${i * 190}ms both`;
        });
      }
    };
    const reveal = () => {
      if (panel.dataset.revealed) return;
      panel.dataset.revealed = "1";
      trace();
      els.forEach((el, i) => {
        el.style.opacity = "";
        el.style.animation = `revealBlur .8s ${EASE} ${i * 85}ms both`;
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
      {threshold: [0, 0.2]}
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
