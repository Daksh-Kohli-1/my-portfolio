"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

// Reads a computed color from your Tailwind theme so the scene follows it.
const cssColor = (cls: string, prop: "color" | "backgroundColor", fallback: string) => {
  const el = document.createElement("div");
  el.className = cls;
  el.style.cssText = "position:absolute;visibility:hidden;pointer-events:none";
  document.body.appendChild(el);
  const v = getComputedStyle(el)[prop];
  el.remove();
  return !v || v === "rgba(0, 0, 0, 0)" ? fallback : v;
};

type Ripple = { x: number; z: number; t: number };

export default function HexFloor() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      return; // no WebGL: the page simply shows without the grid
    }
    const canvas = renderer.domElement;
    canvas.style.cssText = "width:100%;height:100%;display:block";
    mount.appendChild(canvas);

    // Low camera looking across a floor, so the grid recedes to a horizon.
    const scene = new THREE.Scene();
    const fog = new THREE.Fog(0x000000, 450, 1500);
    scene.fog = fog;
    const camera = new THREE.PerspectiveCamera(50, 1, 10, 4000);
    camera.position.set(0, 170, 600);
    camera.lookAt(0, 0, -90);

    const accent = new THREE.Color();
    const bg = new THREE.Color();
    const readColors = () => {
      accent.set(cssColor("text-accent", "color", "#7cff6b"));
      bg.set(cssColor("bg-bg", "backgroundColor", "#0a0c10"));
      fog.color.copy(bg);
    };
    readColors();

    // Hex outlines blend toward the background color instead of using alpha.
    const mat = new THREE.MeshBasicMaterial();
    let mesh: THREE.InstancedMesh | null = null;
    let geo: THREE.BufferGeometry | null = null;
    let xs = new Float32Array(0), zs = new Float32Array(0);
    let lift = new Float32Array(0), glow = new Float32Array(0);
    let R = 48, halfX = 800, lastKey = "";

    const dummy = new THREE.Object3D();
    const tmp = new THREE.Color();

    const buildGrid = () => {
      if (mesh) { scene.remove(mesh); mesh.dispose(); }
      geo?.dispose();

      const w3 = Math.sqrt(3) * R;
      const rowH = 1.5 * R;
      const zNear = 430, zFar = -1400;
      const rows = Math.ceil((zNear - zFar) / rowH);
      const cols = Math.ceil(halfX / w3);
      const pts: number[] = [];
      for (let r = 0; r <= rows; r++) {
        const z = zNear - r * rowH;
        const off = r % 2 ? w3 / 2 : 0;
        for (let c = -cols; c <= cols; c++) pts.push(c * w3 + off, z);
      }
      const n = pts.length / 2;
      xs = new Float32Array(n); zs = new Float32Array(n);
      lift = new Float32Array(n); glow = new Float32Array(n);
      for (let i = 0; i < n; i++) { xs[i] = pts[i * 2]; zs[i] = pts[i * 2 + 1]; }

      const outer = R * 0.94;
      const inner = outer - Math.max(1.6, R * 0.04);
      geo = new THREE.RingGeometry(inner, outer, 6, 1);
      geo.rotateZ(Math.PI / 6); // pointy-top, same as the projects honeycomb
      geo.rotateX(-Math.PI / 2); // lay it flat on the floor

      mesh = new THREE.InstancedMesh(geo, mat, n);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.frustumCulled = false;
      scene.add(mesh);
    };

    // ---- pointer -> floor position ----
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const hit = new THREE.Vector3();
    const toFloor = (cx: number, cy: number, out: { x: number; z: number }) => {
      const rect = mount.getBoundingClientRect();
      if (cx < rect.left || cx > rect.right || cy < rect.top || cy > rect.bottom) return false;
      ndc.set(((cx - rect.left) / rect.width) * 2 - 1, -((cy - rect.top) / rect.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      if (!ray.ray.intersectPlane(plane, hit)) return false; // above the horizon
      out.x = hit.x; out.z = hit.z;
      return true;
    };

    const target = { x: 0, z: 0 };
    const cur = { x: 0, z: 0, p: 0 };
    let inside = false;
    let ripples: Ripple[] = [];

    const addRipple = (x: number, z: number) => {
      ripples.push({ x, z, t: performance.now() });
      if (ripples.length > 6) ripples.shift();
    };

    const onMove = (e: PointerEvent) => {
      if (reduced || e.pointerType === "touch") return;
      inside = toFloor(e.clientX, e.clientY, target);
    };
    const onDown = (e: PointerEvent) => {
      if (reduced) return;
      const p = { x: 0, z: 0 };
      if (toFloor(e.clientX, e.clientY, p)) addRipple(p.x, p.z);
    };
    const onLeave = () => { inside = false; };
    // Menu hover in the landing page sends a pulse from that item's position.
    const onPulse = (e: Event) => {
      if (reduced) return;
      const { x, y } = (e as CustomEvent<{ x: number; y: number }>).detail;
      const p = { x: 0, z: 0 };
      if (toFloor(x, y, p)) addRipple(p.x, p.z);
    };

    // ---- per-frame update ----
    const update = (now: number) => {
      if (!mesh) return;
      const t = reduced ? 0 : now;

      if (inside) {
        if (cur.p < 0.02) { cur.x = target.x; cur.z = target.z; }
        cur.x += (target.x - cur.x) * 0.2;
        cur.z += (target.z - cur.z) * 0.2;
      }
      cur.p += ((inside ? 1 : 0) - cur.p) * 0.08;
      ripples = ripples.filter((r) => now - r.t < 2600);

      const infl2 = (R * 2.2) * (R * 2.2);
      const ringW = R * 1.5;
      const xFade = 520 * Math.max(0.9, camera.aspect);

      for (let i = 0; i < xs.length; i++) {
        const x = xs[i], z = zs[i];
        const amb = 0.5 + 0.5 * Math.sin(z * 0.0045 + x * 0.002 - t * 0.0006); // slow drifting wave
        let tl = 0, tg = 0;

        if (cur.p > 0.01) {
          const dx = x - cur.x, dz = z - cur.z;
          const f = Math.exp(-(dx * dx + dz * dz) / infl2) * cur.p;
          tl += f * R * 0.8;
          tg += f * 0.75;
        }
        for (const rp of ripples) {
          const age = now - rp.t;
          const dx = x - rp.x, dz = z - rp.z;
          const u = (Math.sqrt(dx * dx + dz * dz) - age * 0.5) / ringW;
          const w = Math.exp(-u * u) * Math.exp(-age / 1200);
          tl += w * R * 0.6;
          tg += w * 0.7;
        }

        lift[i] += (Math.min(tl, R * 0.9) - lift[i]) * 0.1; // eases back down slowly
        glow[i] += (tg - glow[i]) * 0.08;

        const fade = Math.exp(-((x / xFade) * (x / xFade)));
        const k = Math.min(1, (0.13 + 0.09 * amb) * fade + glow[i]);

        dummy.position.set(x, lift[i], z);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        tmp.copy(bg).lerp(accent, k);
        mesh.setColorAt(i, tmp);
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    };

    const redrawStatic = () => {
      if (!reduced) return;
      update(0);
      renderer.render(scene, camera);
    };

    const resize = () => {
      const W = mount.clientWidth, H = mount.clientHeight;
      if (!W || !H) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, W < 640 ? 1.5 : 2));
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();

      // Bigger, sparser hexes on small screens.
      R = W < 640 ? 54 : W < 1024 ? 50 : 46;
      halfX = Math.max(650, 600 * camera.aspect);
      const key = `${R}|${Math.round(halfX / 100)}`;
      if (key !== lastKey) { lastKey = key; buildGrid(); }
      redrawStatic();
    };

    // ---- loop (paused when the tab is hidden) ----
    let raf = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      update(now);
      renderer.render(scene, camera);
    };
    const start = () => { if (!raf && !reduced) raf = requestAnimationFrame(tick); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const onVis = () => (document.hidden ? stop() : start());

    // ---- theme changes ----
    const onTheme = () => { readColors(); redrawStatic(); };
    const mo = new MutationObserver(onTheme);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme", "style"] });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", onTheme);

    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();
    start();

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("hex-pulse", onPulse);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      ro.disconnect();
      mo.disconnect();
      mq.removeEventListener("change", onTheme);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("hex-pulse", onPulse);
      document.removeEventListener("visibilitychange", onVis);
      if (mesh) mesh.dispose();
      geo?.dispose();
      mat.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return <div ref={mountRef} aria-hidden className="pointer-events-none absolute inset-0" />;
}