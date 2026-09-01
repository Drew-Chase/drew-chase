import { useEffect, useRef } from "react";
import { isSignal, languageBreakdown, type Repo } from "../../lib/gh";

type Seg = ReturnType<typeof languageBreakdown>[number];

const ACCENT = "#d8fb3c";

export default function LanguageRadial({ repos }: { repos: Repo[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let alive = true;
    let raf = 0;
    let lastW = 0;

    const draw = async () => {
      const d3 = await import("d3");
      if (!alive || !repos.length) return;
      const data = languageBreakdown(repos.filter(isSignal)).slice(0, 9);
      if (!data.length) return;
      const W = host.clientWidth || 520;
      if (W === lastW) return;
      lastW = W;
      host.innerHTML = "";
      const H = Math.max(420, Math.min(520, W * 0.9));
      const R = Math.min(W, H) / 2 - 68;
      const R0 = R * 0.34;
      const svg = d3
        .select(host)
        .append("svg")
        .attr("width", W)
        .attr("height", H)
        .style("display", "block")
        .style("overflow", "visible");
      const g = svg.append("g").attr("transform", `translate(${W / 2},${H / 2})`);
      const total = d3.sum(data, d => d.count);
      const maxC = d3.max(data, d => d.count) || 1;
      const ang = d3.scaleBand<string>().domain(data.map(d => d.language)).range([0, Math.PI * 2]).padding(0.16);
      const rad = d3.scaleRadial().domain([0, maxC]).range([R0, R]);

      [0.25, 0.5, 0.75, 1].forEach(f => {
        g.append("circle").attr("r", rad(maxC * f)).attr("fill", "none").attr("stroke", "rgba(255,255,255,.07)");
      });

      const arc = d3
        .arc<Seg>()
        .innerRadius(R0)
        .startAngle(d => ang(d.language)!)
        .endAngle(d => ang(d.language)! + ang.bandwidth())
        .padAngle(0.004);

      const paths = g
        .selectAll<SVGPathElement, Seg>("path.seg")
        .data(data)
        .join("path")
        .attr("class", "seg")
        .attr("fill", (_, i) => (i === 0 ? ACCENT : "rgba(244,242,237,.16)"))
        .attr("stroke", (_, i) => (i === 0 ? "none" : "rgba(244,242,237,.4)"))
        .attr("stroke-width", 1)
        .attr("d", d => arc.outerRadius(R0)(d) || "");

      paths
        .transition()
        .duration(1100)
        .delay((_, i) => i * 70)
        .ease(d3.easeCubicOut)
        .attrTween("d", d => {
          const i = d3.interpolate(R0, rad(d.count));
          return t => arc.outerRadius(i(t))(d) || "";
        });

      paths
        .on("mouseenter", function () {
          d3.select(this).attr("fill", ACCENT).attr("stroke", "none");
        })
        .on("mouseleave", function (_e, d) {
          const i = data.indexOf(d);
          d3.select(this)
            .attr("fill", i === 0 ? ACCENT : "rgba(244,242,237,.16)")
            .attr("stroke", i === 0 ? "none" : "rgba(244,242,237,.4)");
        });

      data.forEach(d => {
        const a = ang(d.language)! + ang.bandwidth() / 2 - Math.PI / 2;
        const r = rad(d.count) + 17;
        const flip = Math.cos(a) < 0;
        g.append("text")
          .attr(
            "transform",
            `translate(${Math.cos(a) * r},${Math.sin(a) * r}) rotate(${(a * 180 / Math.PI) + (flip ? 180 : 0)})`
          )
          .attr("text-anchor", flip ? "end" : "start")
          .attr("dominant-baseline", "middle")
          .attr("font-family", "'JetBrains Mono', monospace")
          .attr("font-size", 10)
          .attr("letter-spacing", "0.14em")
          .attr("fill", "#8d8a93")
          .text(`${d.language.toUpperCase()} ${d.count}`)
          .attr("opacity", 0)
          .transition()
          .delay(900)
          .duration(500)
          .attr("opacity", 1);
      });

      g.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 6)
        .attr("font-family", "Syne, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 46)
        .attr("letter-spacing", "-0.04em")
        .attr("fill", "#f4f2ed")
        .text(total);
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 26)
        .attr("font-family", "'JetBrains Mono', monospace")
        .attr("font-size", 8.5)
        .attr("letter-spacing", "0.24em")
        .attr("fill", "#4a484e")
        .text("REPOS");
    };

    void draw().catch(() => undefined);
    const ro = new ResizeObserver(() => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (alive) void draw().catch(() => undefined);
      });
    });
    ro.observe(host);
    return () => {
      alive = false;
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [repos]);

  return <div ref={ref} className="w-full min-h-[420px]" />;
}
