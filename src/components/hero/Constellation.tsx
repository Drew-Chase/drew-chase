import {useEffect, useMemo, useRef, useState} from "react";
import * as gh from "../../lib/gh";
import type {Repo} from "../../lib/gh";

interface Star {
  name: string;
  language?: string;
  stars: number;
  pushed_at?: string;
}

interface TipData {
  name: string;
  language: string;
  stars: number;
  pushed: string;
}

export default function Constellation({repos}: {repos: Repo[]}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<TipData | null>(null);
  const signal = useMemo(() => repos.filter(gh.isSignal).slice(0, 150), [repos]);
  const live = signal.length > 0;
  const signalRef = useRef(signal);
  signalRef.current = signal;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let raf = 0;
    let teardown: (() => void) | null = null;

    void (async () => {
      try {
        const THREE = await import("three");
        if (disposed || !hostRef.current) return;

        const nodes: Star[] = signalRef.current.length
          ? signalRef.current
          : Array.from({length: 110}, () => ({name: "", language: undefined, stars: 0}));
        const n = nodes.length;
        const BX = 26, BY = 14, BZ = 15;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x08080a, 0.026);
        const cam = new THREE.PerspectiveCamera(44, host.clientWidth / Math.max(1, host.clientHeight), 0.1, 200);
        cam.position.set(0, 0, 23);
        const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
        renderer.setSize(host.clientWidth, host.clientHeight);
        host.appendChild(renderer.domElement);

        const group = new THREE.Group();
        scene.add(group);

        const pos = new Float32Array(n * 3);
        const col = new Float32Array(n * 3);
        const siz = new Float32Array(n);
        const vel: {x: number; y: number; z: number}[] = [];
        const maxStars = Math.max(1, ...nodes.map(d => d.stars || 0));

        nodes.forEach((d, i) => {
          pos[i * 3] = (Math.random() - 0.5) * BX;
          pos[i * 3 + 1] = (Math.random() - 0.5) * BY;
          pos[i * 3 + 2] = (Math.random() - 0.5) * BZ;
          vel.push({
            x: (Math.random() - 0.5) * 0.011,
            y: (Math.random() - 0.5) * 0.009,
            z: (Math.random() - 0.5) * 0.011,
          });
          const hex = (d.language && gh.LANG_COLOR[d.language]) || "#5a5c6e";
          const c = new THREE.Color(hex);
          if (!d.language) c.multiplyScalar(0.55);
          col[i * 3] = c.r;
          col[i * 3 + 1] = c.g;
          col[i * 3 + 2] = c.b;
          const t = Math.log2(1 + (d.stars || 0)) / Math.log2(1 + maxStars);
          siz[i] = 0.055 + t * 0.16 + Math.random() * 0.012;
        });

        const pg = new THREE.BufferGeometry();
        pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        pg.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
        pg.setAttribute("aSize", new THREE.BufferAttribute(siz, 1));
        const pm = new THREE.ShaderMaterial({
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          uniforms: {uScale: {value: host.clientHeight}},
          vertexShader: [
            "attribute float aSize; attribute vec3 aColor; varying vec3 vColor; uniform float uScale;",
            "void main(){ vColor = aColor; vec4 mv = modelViewMatrix * vec4(position,1.0);",
            "gl_PointSize = aSize * uScale / max(1.0, -mv.z); gl_Position = projectionMatrix * mv; }",
          ].join("\n"),
          fragmentShader: [
            "varying vec3 vColor;",
            "void main(){ float d = length(gl_PointCoord - vec2(0.5)); if (d > 0.5) discard;",
            "float core = smoothstep(0.5, 0.06, d); float halo = smoothstep(0.5, 0.2, d) * 0.35;",
            "gl_FragColor = vec4(vColor, core * 0.95 + halo); }",
          ].join("\n"),
        });
        const points = new THREE.Points(pg, pm);
        group.add(points);

        const MAXSEG = 2600;
        const lpos = new Float32Array(MAXSEG * 6);
        const lcol = new Float32Array(MAXSEG * 6);
        const lg = new THREE.BufferGeometry();
        lg.setAttribute("position", new THREE.BufferAttribute(lpos, 3));
        lg.setAttribute("color", new THREE.BufferAttribute(lcol, 3));
        const lm = new THREE.LineBasicMaterial({
          vertexColors: true,
          transparent: true,
          opacity: 0.55,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const lines = new THREE.LineSegments(lg, lm);
        group.add(lines);

        const base = siz.slice();
        const mouse = {x: 0, y: 0, tx: 0, ty: 0, px: -99, py: -99};
        const ndc = new THREE.Vector2();
        let hovering = false;
        let hoverIdx = -1;

        const onMove = (e: PointerEvent) => {
          const b = host.getBoundingClientRect();
          mouse.tx = ((e.clientX - b.left) / b.width - 0.5) * 2;
          mouse.ty = ((e.clientY - b.top) / b.height - 0.5) * 2;
          mouse.px = e.clientX - b.left;
          mouse.py = e.clientY - b.top;
          ndc.set(mouse.tx, -mouse.ty);
          hovering = true;
        };
        const onLeave = () => {
          hovering = false;
          if (hoverIdx >= 0) {
            siz[hoverIdx] = base[hoverIdx];
            pg.attributes.aSize.needsUpdate = true;
            hoverIdx = -1;
          }
          setTip(null);
          if (tipRef.current) tipRef.current.style.opacity = "0";
        };
        host.addEventListener("pointermove", onMove);
        host.addEventListener("pointerleave", onLeave);

        const ray = new THREE.Raycaster();
        ray.params.Points.threshold = 0.55;

        let visible = true;
        const io = new IntersectionObserver(es => {
          visible = es[0].isIntersecting;
        }, {threshold: 0});
        io.observe(host);

        const ro = new ResizeObserver(() => {
          const w = host.clientWidth;
          const h = host.clientHeight;
          cam.aspect = w / Math.max(1, h);
          cam.updateProjectionMatrix();
          renderer.setSize(w, h);
        });
        ro.observe(host);

        const t0 = performance.now();

        const loop = () => {
          raf = requestAnimationFrame(loop);
          if (!visible) return;
          const el = performance.now() - t0;

          for (let i = 0; i < n; i++) {
            const v = vel[i];
            const x = pos[i * 3] + v.x;
            const y = pos[i * 3 + 1] + v.y;
            const z = pos[i * 3 + 2] + v.z;
            if (x < -BX / 2 || x > BX / 2) v.x *= -1;
            if (y < -BY / 2 || y > BY / 2) v.y *= -1;
            if (z < -BZ / 2 || z > BZ / 2) v.z *= -1;
            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;
          }
          pg.attributes.position.needsUpdate = true;

          const THRESH = 4.15;
          let s = 0;
          for (let i = 0; i < n && s < MAXSEG; i++) {
            const ax = pos[i * 3];
            const ay = pos[i * 3 + 1];
            const az = pos[i * 3 + 2];
            for (let j = i + 1; j < n && s < MAXSEG; j++) {
              const dx = ax - pos[j * 3];
              const dy = ay - pos[j * 3 + 1];
              const dz = az - pos[j * 3 + 2];
              const d2 = dx * dx + dy * dy + dz * dz;
              if (d2 > THRESH * THRESH) continue;
              const f = 1 - Math.sqrt(d2) / THRESH;
              const k = s * 6;
              lpos[k] = ax;
              lpos[k + 1] = ay;
              lpos[k + 2] = az;
              lpos[k + 3] = pos[j * 3];
              lpos[k + 4] = pos[j * 3 + 1];
              lpos[k + 5] = pos[j * 3 + 2];
              const g = f * 0.5;
              lcol[k] = col[i * 3] * g;
              lcol[k + 1] = col[i * 3 + 1] * g;
              lcol[k + 2] = col[i * 3 + 2] * g;
              lcol[k + 3] = col[j * 3] * g;
              lcol[k + 4] = col[j * 3 + 1] * g;
              lcol[k + 5] = col[j * 3 + 2] * g;
              s++;
            }
          }
          lg.setDrawRange(0, s * 2);
          lg.attributes.position.needsUpdate = true;
          lg.attributes.color.needsUpdate = true;

          mouse.x += (mouse.tx - mouse.x) * 0.04;
          mouse.y += (mouse.ty - mouse.y) * 0.04;
          group.rotation.y = el / 34000 + mouse.x * 0.4;
          group.rotation.x = -mouse.y * 0.22 + Math.sin(el / 9000) * 0.05;
          const ease = 1 - Math.pow(1 - Math.min(1, el / 1500), 3);
          group.scale.setScalar(0.72 + 0.28 * ease);
          pm.uniforms.uScale.value = host.clientHeight * (0.5 + 0.5 * ease);

          if (hovering && el > 700) {
            ray.setFromCamera(ndc, cam);
            const hits = ray.intersectObject(points);
            const idx = hits.length ? hits[0].index ?? -1 : -1;
            if (idx !== hoverIdx) {
              if (hoverIdx >= 0) siz[hoverIdx] = base[hoverIdx];
              if (idx >= 0) siz[idx] = base[idx] * 2.4 + 0.06;
              pg.attributes.aSize.needsUpdate = true;
              hoverIdx = idx;
              const d = idx >= 0 ? nodes[idx] : null;
              setTip(
                d && d.name
                  ? {name: d.name, language: d.language || "—", stars: d.stars || 0, pushed: gh.relTime(d.pushed_at)}
                  : null
              );
            }
            const tipEl = tipRef.current;
            if (tipEl) {
              if (idx >= 0 && nodes[idx].name) {
                tipEl.style.left = Math.min(mouse.px + 16, host.clientWidth - 240) + "px";
                tipEl.style.top = Math.max(mouse.py - 54, 8) + "px";
                tipEl.style.opacity = "1";
              } else {
                tipEl.style.opacity = "0";
              }
            }
          }

          renderer.render(scene, cam);
        };
        raf = requestAnimationFrame(loop);

        teardown = () => {
          cancelAnimationFrame(raf);
          io.disconnect();
          ro.disconnect();
          host.removeEventListener("pointermove", onMove);
          host.removeEventListener("pointerleave", onLeave);
          pg.dispose();
          pm.dispose();
          lg.dispose();
          lm.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
      } catch {
        // three.js failed to load; the hero's static gradient underneath stays visible
      }
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      teardown?.();
      teardown = null;
    };
  }, [live]);

  return (
    <div ref={hostRef} className="absolute inset-0">
      <div
        ref={tipRef}
        className="pointer-events-none absolute left-0 top-0 z-[5] whitespace-nowrap rounded-[2px] border border-white/16 bg-panel px-3 py-[9px] font-mono text-[10.5px] tracking-[.06em] text-ink opacity-0 shadow-[0_10px_30px_rgba(0,0,0,.6)] transition-opacity duration-[140ms]"
      >
        {tip && (
          <>
            <div className="text-accent">{tip.name}</div>
            <div className="mt-[3px] text-[#a3a1a8]">{tip.language} · ★ {tip.stars}</div>
            <div className="mt-[3px] text-dim">pushed {tip.pushed}</div>
          </>
        )}
      </div>
    </div>
  );
}
