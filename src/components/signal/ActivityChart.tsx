import { useEffect, useRef } from "react";
import type { Activity, ActivityDay } from "../../lib/gh";

const ACCENT = "#d8fb3c";

export default function ActivityChart({ activity }: { activity: Activity | null }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host || !activity) return;
    let alive = true;
    let raf = 0;
    let lastW = 0;

    const draw = async () => {
      const d3 = await import("d3");
      if (!alive || !activity) return;
      const W = host.clientWidth || 480;
      if (W === lastW) return;
      lastW = W;
      host.innerHTML = "";
      const days = activity.days.map(d => ({ ...d, dt: new Date(d.date + "T00:00:00") }));
      const H = Math.max(420, Math.min(520, W * 0.9));
      const m = { r: 8, l: 34 };
      const svg = d3.select(host).append("svg").attr("width", W).attr("height", H).style("display", "block");
      const chartH = H - 150;
      const x = d3
        .scaleTime()
        .domain(d3.extent(days, d => d.dt) as [Date, Date])
        .range([m.l, W - m.r]);
      const maxV = Math.max(1, d3.max(days, d => d.commits) || 0);
      const y = d3.scaleLinear().domain([0, maxV * 1.15]).range([chartH, 26]);

      y.ticks(4).forEach(t => {
        svg
          .append("line")
          .attr("x1", m.l)
          .attr("x2", W - m.r)
          .attr("y1", y(t))
          .attr("y2", y(t))
          .attr("stroke", "rgba(255,255,255,.07)");
        svg
          .append("text")
          .attr("x", m.l - 9)
          .attr("y", y(t))
          .attr("text-anchor", "end")
          .attr("dominant-baseline", "middle")
          .attr("font-family", "'JetBrains Mono', monospace")
          .attr("font-size", 9)
          .attr("fill", "#4a484e")
          .text(t);
      });

      const bw = Math.max(1.5, (W - m.l - m.r) / days.length - 1.6);
      svg
        .selectAll<SVGRectElement, ActivityDay & { dt: Date }>("rect.col")
        .data(days)
        .join("rect")
        .attr("class", "col")
        .attr("x", d => x(d.dt) - bw / 2)
        .attr("width", bw)
        .attr("y", chartH)
        .attr("height", 0)
        .attr("fill", d => (d.commits ? ACCENT : "rgba(255,255,255,.06)"))
        .transition()
        .duration(900)
        .delay((_, i) => i * 7)
        .ease(d3.easeCubicOut)
        .attr("y", d => (d.commits ? y(d.commits) : chartH - 1.5))
        .attr("height", d => (d.commits ? chartH - y(d.commits) : 1.5));

      x.ticks(4).forEach(t => {
        svg
          .append("text")
          .attr("x", x(t))
          .attr("y", chartH + 22)
          .attr("text-anchor", "middle")
          .attr("font-family", "'JetBrains Mono', monospace")
          .attr("font-size", 9)
          .attr("letter-spacing", "0.16em")
          .attr("fill", "#4a484e")
          .text(d3.timeFormat("%b %d")(t).toUpperCase());
      });

      const stripY = chartH + 62;
      const rows = 7;
      const cw = Math.min(15, (W - m.l - m.r) / 13 - 3);
      const heat = d3.scaleLinear<string>().domain([0, maxV]).range(["#1b1c20", ACCENT]);
      svg
        .append("text")
        .attr("x", m.l)
        .attr("y", stripY - 12)
        .attr("font-family", "'JetBrains Mono', monospace")
        .attr("font-size", 8.5)
        .attr("letter-spacing", "0.24em")
        .attr("fill", "#4a484e")
        .text("BY WEEK");
      days.forEach((d, i) => {
        const c = Math.floor(i / rows);
        const r = i % rows;
        svg
          .append("rect")
          .attr("x", m.l + c * (cw + 3))
          .attr("y", stripY + r * (cw + 3))
          .attr("width", cw)
          .attr("height", cw)
          .attr("fill", d.commits ? heat(d.commits) : "#141519")
          .append("title")
          .text(`${d.date} — ${d.commits} commits`);
      });

      svg
        .append("text")
        .attr("x", W - m.r)
        .attr("y", stripY + 18)
        .attr("text-anchor", "end")
        .attr("font-family", "Syne, sans-serif")
        .attr("font-weight", 800)
        .attr("font-size", 42)
        .attr("letter-spacing", "-0.04em")
        .attr("fill", "#f4f2ed")
        .text(activity.total);
      svg
        .append("text")
        .attr("x", W - m.r)
        .attr("y", stripY + 38)
        .attr("text-anchor", "end")
        .attr("font-family", "'JetBrains Mono', monospace")
        .attr("font-size", 8.5)
        .attr("letter-spacing", "0.22em")
        .attr("fill", "#4a484e")
        .text("COMMITS / 90D");
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
  }, [activity]);

  return <div ref={ref} className="w-full min-h-[420px]" />;
}
