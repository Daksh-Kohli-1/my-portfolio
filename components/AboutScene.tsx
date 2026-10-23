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

type Shape = {
  g: THREE.Group;
  size: number;
  xf: number; // horizontal position as a fraction of half the screen width
  z0: number;
  sway: number;
  f: number;
  p: number;
  rx: number;
  ry: number;
  rz: number;
  t0: number;
  dur: number;
  still: number; // fixed progress used when reduced motion is on
  enabled: boolean;
};

export default function AboutScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      return; // no WebGL: the page simply shows without the shapes
    }
    const canvasEl = renderer.domElement;
    canvasEl.style.cssText = "width:100%;height:100%;display:block";
    mount.appendChild(canvasEl);

    const bg = new THREE.Color(), accent = new THREE.Color();
    const MIX = 0.28; // how much accent is mixed into the background color
    const readColors = () => {
      bg.set(cssColor("bg-bg", "backgroundColor", "#0a0c10"));
      accent.set(cssColor("text-accent", "color", "#7cff6b"));
    };
    readColors();

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(bg.clone(), 12, 36); // far shapes melt into the background
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 14;
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const sun = new THREE.DirectionalLight(0xffffff, 2.2);
    sun.position.set(-4, 5, 7);
    scene.add(sun);

    const mat = new THREE.MeshStandardMaterial({
      color: bg.clone().lerp(accent, MIX),
      emissive: accent.clone(),
      emissiveIntensity: 0.06,
      roughness: 0.45,
      metalness: 0.25,
      flatShading: true, // crisp facets
    });
    const lineMat = new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.5 });

    // Four shape types, three of each.
    const geos: THREE.BufferGeometry[] = [
      new THREE.BoxGeometry(1.5, 1.5, 1.5), // cube
      new THREE.BoxGeometry(2.4, 1.1, 0.9), // cuboid
      new THREE.IcosahedronGeometry(1.15, 0), // icosahedron
      new THREE.OctahedronGeometry(1.25, 0), // octahedron
    ];
    const edgeGeos = geos.map((g) => new THREE.EdgesGeometry(g, 1));

    const TOTAL = 12;
    const shapes: Shape[] = [];
    const respawn = (m: Shape, now: number, fresh: boolean) => {
      m.xf = rand(-0.95, 0.95);
      m.z0 = rand(-9, 1);
      m.sway = rand(0.03, 0.09);
      m.f = rand(0.0002, 0.0005);
      m.p = rand(0, 6.28);
      m.rx = rand(0.0001, 0.0003) * (Math.random() < 0.5 ? -1 : 1);
      m.ry = rand(0.00015, 0.00035) * (Math.random() < 0.5 ? -1 : 1);
      m.rz = rand(0.00005, 0.00015) * (Math.random() < 0.5 ? -1 : 1);
      m.dur = rand(26000, 42000);
      m.t0 = fresh ? now - rand(0, 1) * m.dur : now + rand(0, 4000);
    };
    const now0 = performance.now();
    for (let i = 0; i < TOTAL; i++) {
      const type = i % 4; // round-robin, so phones (first 8) still get 2 of each type
      const g = new THREE.Group();
      g.add(new THREE.Mesh(geos[type], mat), new THREE.LineSegments(edgeGeos[type], lineMat));
      scene.add(g);
      const m: Shape = {
        g, size: rand(0.1, 0.15),
        xf: 0, z0: 0, sway: 0, f: 0, p: 0, rx: 0, ry: 0, rz: 0, t0: 0, dur: 1,
        still: (i + 0.5) / TOTAL,
        enabled: true,
      };
      respawn(m, now0, true);
      shapes.push(m);
    }

    let hw = 8, hh = 5, unit = 5;
    const mouse = { x: 0, y: 0 };

    const render = (now: number) => {
      const t = reduced ? 0 : now;
      const ext = hh + 3;
      for (const m of shapes) {
        let u = reduced ? m.still : (now - m.t0) / m.dur;
        if (!reduced && u > 1) {
          respawn(m, now, false);
          u = -1;
        }
        const show = m.enabled && u >= 0 && u <= 1;
        m.g.visible = show;
        if (!show) continue;

        // Rises slowly from below the screen to above it, swaying and tumbling.
        m.g.position.set(
          m.xf * hw + Math.sin(t * m.f + m.p) * m.sway * hw,
          -ext + 2 * ext * u,
          m.z0,
        );
        m.g.rotation.set(t * m.rx + m.p, t * m.ry + m.p * 1.7, t * m.rz + m.p * 0.6);
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
      const limit = W < 640 ? 8 : TOTAL; // fewer on phones
      shapes.forEach((m, i) => (m.enabled = i < limit));
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

    // follow theme changes
    const onTheme = () => {
      readColors();
      (scene.fog as THREE.Fog).color.copy(bg);
      mat.color.copy(bg).lerp(accent, MIX);
      mat.emissive.copy(accent);
      lineMat.color.copy(accent);
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
      geos.forEach((g) => g.dispose());
      edgeGeos.forEach((g) => g.dispose());
      mat.dispose();
      lineMat.dispose();
      renderer.dispose();
      canvasEl.remove();
    };
  }, []);

  return <div ref={mountRef} aria-hidden className="pointer-events-none fixed inset-0 -z-10" />;
}