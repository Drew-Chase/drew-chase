import { useEffect, useRef } from "react";
import type { Activity } from "../../lib/gh";

const ACCENT = "#ffb340";

export default function ActivityChart({ activity }: { activity: Activity | null }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host || !activity) return;
    let alive = true;
    let raf = 0;
    let first = true;

    const draw = async () => {
      const d3 = await import("d3");
      if (!alive || !activity) return;
      host.innerHTML = "";
      const days = activity.days.map(d => ({ ...d, dt: new Date(d.date + "T00:00:00") }));
      const W = host.clientWidth || 480;
      const H = Math.max(420, Math.min(520, W * 0.9));
      const m = { t: 26, r: 8, b: 34, l: 34 };
      const svg = d3.select(host).append("svg").attr("width", W).attr("height", H).style("display", "block");
      const chartH = H - 150;
      const x = d3
        .scaleTime()
        .domain(d3.extent(days, d => d.dt) as [Date, Date])
        .range([m.l, W - m.r]);
      const maxV = Math.max(1, d3.max(days, d => d.commits) || 0);
      const y = d3.scaleLinear().domain([0, maxV * 1.15]).range([chartH, m.t]);

      y.ticks(4).forEach(t => {
        svg
          .append("line")
          .attr("x1", m.l)
          .attr("x2", W - m.r)
          .attr("y1", y(t))
          .attr("y2", y(t))
          .attr("stroke", "rgba(255,255,255,.06)");
        svg
          .append("text")
          .attr("x", m.l - 8)
          .attr("y", y(t))
          .attr("text-anchor", "end")
          .attr("dominant-baseline", "middle")
          .attr("font-family", "'JetBrains Mono', monospace")
          .attr("font-size", 9)
          .attr("fill", "#57555e")
          .text(t);
      });

      const defs = svg.append("defs");
      const grad = defs.append("linearGradient").attr("id", "actGrad").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", 1);
      grad.append("stop").attr("offset", "0%").attr("stop-color", ACCENT).attr("stop-opacity", 0.5);
      grad.append("stop").attr("offset", "100%").attr("stop-color", ACCENT).attr("stop-opacity", 0);

      const area = d3
        .area<{ dt: Date; commits: number }>()
        .x(d => x(d.dt))
        .y0(chartH)
        .y1(d => y(d.commits))
        .curve(d3.curveMonotoneX);
      const line = d3
        .line<{ dt: Date; commits: number }>()
        .x(d => x(d.dt))
        .y(d => y(d.commits))
        .curve(d3.curveMonotoneX);

      svg
        .append("path")
        .datum(days)
        .attr("fill", "url(#actGrad)")
        .attr("d", area)
        .attr("opacity", 0)
        .transition()
        .duration(1000)
        .attr("opacity", 1);

      const p = svg
        .append("path")
        .datum(days)
        .attr("fill", "none")
        .attr("stroke", ACCENT)
        .attr("stroke-width", 1.6)
        .attr("d", line);
      const len = p.node()!.getTotalLength();
      p.attr("stroke-dasharray", `${len} ${len}`)
        .attr("stroke-dashoffset", len)
        .transition()
        .duration(1600)
        .ease(d3.easeCubicOut)
        .attr("stroke-dashoffset", 0);

      x.ticks(4).forEach(t => {
        svg
          .append("text")
          .attr("x", x(t))
          .attr("y", chartH + 20)
          .attr("text-anchor", "middle")
          .attr("font-family", "'JetBrains Mono', monospace")
          .attr("font-size", 9)
          .attr("letter-spacing", "0.14em")
          .attr("fill", "#57555e")
          .text(d3.timeFormat("%b %d")(t).toUpperCase());
      });

      const stripY = chartH + 62;
      const cols = 13;
      const rows = 7;
      const cw = Math.min(16, (W - m.l - m.r) / cols - 3);
      const heat = d3.scaleLinear<string>().domain([0, maxV]).range(["#1c1e2c", ACCENT]);
      svg
        .append("text")
        .attr("x", m.l)
        .attr("y", stripY - 12)
        .attr("font-family", "'JetBrains Mono', monospace")
        .attr("font-size", 9)
        .attr("letter-spacing", "0.2em")
        .attr("fill", "#57555e")
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
          .attr("rx", 1)
          .attr("fill", d.commits ? heat(d.commits) : "#15161e")
          .append("title")
          .text(`${d.date} — ${d.commits} commits`);
      });

      svg
        .append("text")
        .attr("x", W - m.r)
        .attr("y", stripY + 12)
        .attr("text-anchor", "end")
        .attr("font-family", "'Instrument Serif', serif")
        .attr("font-size", 34)
        .attr("fill", "#f2f0ec")
        .text(activity.total);
      svg
        .append("text")
        .attr("x", W - m.r)
        .attr("y", stripY + 30)
        .attr("text-anchor", "end")
        .attr("font-family", "'JetBrains Mono', monospace")
        .attr("font-size", 9)
        .attr("letter-spacing", "0.18em")
        .attr("fill", "#6d6b74")
        .text("COMMITS / 90D");
    };

    void draw();
    const ro = new ResizeObserver(() => {
      if (first) {
        first = false;
        return;
      }
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (alive) void draw();
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
