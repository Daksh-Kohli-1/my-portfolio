"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const cssColor = (cls: string, prop: "color" | "backgroundColor", fallback: string) => {
  const el = document.createElement("div");
  el.className = cls;
  el.style.cssText = "position:absolute;visibility:hidden;pointer-events:none";
  document.body.appendChild(el);
  const v = getComputedStyle(el)[prop];
  el.remove();
  return !v || v === "rgba(0, 0, 0, 0)" ? fallback : v;
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

type Glyph = {
  g: THREE.Group;
  size: number;
  xf: number; // horizontal position as a fraction of half the screen width
  z0: number;
  sway: number;
  f: number;
  p: number;
  ry: number;
  t0: number;
  dur: number;
  still: number; // fixed progress used when reduced motion is on
  enabled: boolean;
};

// `subtle` is for the reading page: fewer marks, dimmer.
export default function ThoughtsScene({ subtle = false }: { subtle?: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      return; // no WebGL: the page simply shows without the marks
    }
    const canvas = renderer.domElement;
    canvas.style.cssText = "width:100%;height:100%;display:block";
    mount.appendChild(canvas);

    const bg = new THREE.Color(cssColor("bg-bg", "backgroundColor", "#0a0c10"));
    const accent = new THREE.Color(cssColor("text-accent", "color", "#7cff6b"));
    const MIX = subtle ? 0.2 : 0.3; // how much accent is mixed into the background color

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(bg.clone(), 12, 36); // far marks melt into the background
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 14;

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const sun = new THREE.DirectionalLight(0xffffff, 2.2);
    sun.position.set(-4, 5, 7);
    scene.add(sun);

    const mat = new THREE.MeshStandardMaterial({
      color: bg.clone().lerp(accent, MIX),
      emissive: accent.clone(),
      emissiveIntensity: subtle ? 0.04 : 0.08,
      roughness: 0.45,
      metalness: 0.2,
    });

    // ---- build "?" and "!" from simple geometry ----
    const ball = new THREE.SphereGeometry(1, 20, 16);
    const qCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.55, 0.55, 0),
      new THREE.Vector3(-0.5, 0.9, 0),
      new THREE.Vector3(-0.2, 1.15, 0),
      new THREE.Vector3(0.2, 1.15, 0),
      new THREE.Vector3(0.55, 0.9, 0),
      new THREE.Vector3(0.6, 0.5, 0),
      new THREE.Vector3(0.4, 0.15, 0),
      new THREE.Vector3(0.05, -0.15, 0),
      new THREE.Vector3(0, -0.55, 0),
    ]);
    const qTube = new THREE.TubeGeometry(qCurve, 72, 0.17, 14, false);
    const stem = new THREE.CylinderGeometry(0.26, 0.12, 1.5, 24);

    const addBall = (parent: THREE.Object3D, r: number, x: number, y: number) => {
      const m = new THREE.Mesh(ball, mat);
      m.scale.setScalar(r);
      m.position.set(x, y, 0);
      parent.add(m);
    };

    const buildQuestion = () => {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(qTube, mat));
      addBall(g, 0.17, -0.55, 0.55); // round the tube ends
      addBall(g, 0.17, 0, -0.55);
      addBall(g, 0.22, 0, -1.1); // the dot
      return g;
    };

    const buildExclaim = () => {
      const g = new THREE.Group();
      const inner = new THREE.Group();
      inner.position.y = -0.22; // re-center
      const s = new THREE.Mesh(stem, mat);
      s.position.y = 0.5;
      inner.add(s);
      addBall(inner, 0.26, 0, 1.25);
      addBall(inner, 0.12, 0, -0.25);
      addBall(inner, 0.22, 0, -0.85);
      g.add(inner);
      return g;
    };

    // ---- the floating marks ----
    const TOTAL = subtle ? 10 : 18;
    const glyphs: Glyph[] = [];
    const respawn = (m: Glyph, now: number, fresh: boolean) => {
      m.xf = rand(-0.95, 0.95);
      m.z0 = rand(-9, 1);
      m.sway = rand(0.03, 0.09);
      m.f = rand(0.0002, 0.0005);
      m.p = rand(0, 6.28);
      m.ry = rand(0.00025, 0.0006) * (Math.random() < 0.5 ? -1 : 1);
      m.dur = rand(26000, 42000);
      m.t0 = fresh ? now - rand(0, 1) * m.dur : now + rand(0, 4000);
    };
    const now0 = performance.now();
    for (let i = 0; i < TOTAL; i++) {
      const g = i % 2 === 0 ? buildQuestion() : buildExclaim();
      scene.add(g);
      const m: Glyph = {
        g, size: rand(0.11, 0.15),
        xf: 0, z0: 0, sway: 0, f: 0, p: 0, ry: 0, t0: 0, dur: 1,
        still: (i + 0.5) / TOTAL,
        enabled: true,
      };
      respawn(m, now0, true);
      glyphs.push(m);
    }

    let hw = 8, hh = 5, unit = 5;
    const mouse = { x: 0, y: 0 };

    const render = (now: number) => {
      const t = reduced ? 0 : now;
      const ext = hh + 3;
      for (const m of glyphs) {
        let u = reduced ? m.still : (now - m.t0) / m.dur;
        if (!reduced && u > 1) {
          respawn(m, now, false);
          u = -1;
        }
        const show = m.enabled && u >= 0 && u <= 1;
        m.g.visible = show;
        if (!show) continue;

        // Rises slowly from below the screen to above it, swaying and turning.
        m.g.position.set(
          m.xf * hw + Math.sin(t * m.f + m.p) * m.sway * hw,
          -ext + 2 * ext * u,
          m.z0,
        );
        m.g.rotation.set(
          Math.sin(t * 0.0004 + m.p) * 0.5,
          t * m.ry + m.p,
          Math.sin(t * 0.0003 + m.p * 2) * 0.25,
        );
        const s = unit * m.size * smooth(0, 0.05, u) * (1 - smooth(0.95, 1, u));
        m.g.scale.setScalar(Math.max(s, 1e-4));
      }

      // A gentle parallax toward the cursor.
      camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.04;
      camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    const resize = () => {
      const W = mount.clientWidth, H = mount.clientHeight;
      if (!W || !H) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, W < 640 ? 1.5 : 2));
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      hh = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      hw = hh * camera.aspect;
      unit = Math.min(hw, hh * 1.3);
      const limit = W < 640 ? (subtle ? 6 : 10) : TOTAL; // fewer on phones
      glyphs.forEach((m, i) => (m.enabled = i < limit));
      if (reduced) render(performance.now());
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    let raf = 0;
    const tick = (now: number) => { raf = requestAnimationFrame(tick); render(now); };
    const start = () => { if (!raf && !reduced) raf = requestAnimationFrame(tick); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const onVis = () => (document.hidden ? stop() : start());

    // Follow theme changes.
    const onTheme = () => {
      bg.set(cssColor("bg-bg", "backgroundColor", "#0a0c10"));
      accent.set(cssColor("text-accent", "color", "#7cff6b"));
      mat.color.copy(bg).lerp(accent, MIX);
      mat.emissive.copy(accent);
      (scene.fog as THREE.Fog).color.copy(bg);
      if (reduced) render(performance.now());
    };
    const mo = new MutationObserver(onTheme);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme", "style"] });

    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();
    start();
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      ball.dispose();
      qTube.dispose();
      stem.dispose();
      mat.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, [subtle]);

  return <div ref={mountRef} aria-hidden className="pointer-events-none fixed inset-0 -z-10" />;
}