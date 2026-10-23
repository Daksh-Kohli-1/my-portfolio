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

const TRAIL_N = 64; // dots in each plane's trail
const TRAIL_STEP = 0.012; // spacing between dots, as a fraction of the flight path

type Flyer = {
  group: THREE.Group;
  lineMat: THREE.LineBasicMaterial;
  fillMat: THREE.MeshBasicMaterial;
  trail: THREE.Points;
  trailPos: THREE.BufferAttribute;
  trailAlpha: THREE.BufferAttribute;
  curve: THREE.CatmullRomCurve3;
  t0: number;
  dur: number;
  still: number; // fixed progress used when reduced motion is on
  roll: number;
  enabled: boolean;
};

// A low-poly folded paper plane pointing along +X.
const makePlaneGeo = () => {
  const N = [1.2, 0, 0], T = [-0.8, 0, 0], K = [-0.8, -0.3, 0];
  const L = [-0.8, 0.12, -0.95], R = [-0.8, 0.12, 0.95];
  const v = new Float32Array([...N, ...L, ...T, ...N, ...T, ...R, ...N, ...T, ...K]);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(v, 3));
  return g;
};

export default function ContactScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      return; // no WebGL: the page simply shows without the planes
    }
    const canvas = renderer.domElement;
    canvas.style.cssText = "width:100%;height:100%;display:block";
    mount.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 14;

    const accent = new THREE.Color(cssColor("text-accent", "color", "#7cff6b"));

    // Shared pieces
    const planeGeo = makePlaneGeo();
    const edgeGeo = new THREE.EdgesGeometry(planeGeo, 1);
    const trailMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uColor: { value: accent.clone() },
        uPx: { value: 2.2 },
        uPR: { value: 1 },
      },
      vertexShader: /* glsl */ `
        attribute float aAlpha;
        varying float vA;
        uniform float uPx;
        uniform float uPR;
        void main() {
          vA = aAlpha;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uPx * uPR * (14.0 / -mv.z);
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vA;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          gl_FragColor = vec4(uColor, vA * smoothstep(0.5, 0.25, d));
          #include <colorspace_fragment>
        }`,
    });

    let hw = 8, hh = 5, unit = 5;

    // A random swooping route that enters and leaves just outside the screen.
    const makePath = () => {
      const s = Math.random() < 0.5 ? -1 : 1;
      const ext = hw + 4;
      const pts = [new THREE.Vector3(-s * ext, rand(-0.9, 0.9) * hh, rand(-3, 1.5))];
      const mids = 3;
      for (let i = 1; i <= mids; i++) {
        pts.push(
          new THREE.Vector3(
            -s * ext + s * 2 * ext * (i / (mids + 1)) + rand(-0.1, 0.1) * hw,
            rand(-0.8, 0.8) * hh,
            rand(-3, 1.5),
          ),
        );
      }
      pts.push(new THREE.Vector3(s * ext, rand(-0.9, 0.9) * hh, rand(-3, 1.5)));
      return new THREE.CatmullRomCurve3(pts, false, "centripetal");
    };

    const flyers: Flyer[] = [];
    const now0 = performance.now();
    for (let i = 0; i < 6; i++) {
      const lineMat = new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0 });
      const fillMat = new THREE.MeshBasicMaterial({
        color: accent, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide,
      });
      const group = new THREE.Group();
      group.add(new THREE.LineSegments(edgeGeo, lineMat), new THREE.Mesh(planeGeo, fillMat));
      scene.add(group);

      const tg = new THREE.BufferGeometry();
      const trailPos = new THREE.BufferAttribute(new Float32Array(TRAIL_N * 3), 3);
      const trailAlpha = new THREE.BufferAttribute(new Float32Array(TRAIL_N), 1);
      trailPos.setUsage(THREE.DynamicDrawUsage);
      trailAlpha.setUsage(THREE.DynamicDrawUsage);
      tg.setAttribute("position", trailPos);
      tg.setAttribute("aAlpha", trailAlpha);
      const trail = new THREE.Points(tg, trailMat);
      trail.frustumCulled = false;
      scene.add(trail);

      const dur = rand(14000, 22000);
      flyers.push({
        group, lineMat, fillMat, trail, trailPos, trailAlpha,
        curve: makePath(),
        dur,
        t0: now0 - rand(0.1, 0.8) * dur, // start already mid-flight so the page isn't empty
        still: 0.25 + i * 0.25,
        roll: 0,
        enabled: true,
      });
    }

    // ---- per-frame ----
    const X = new THREE.Vector3(1, 0, 0);
    const UP = new THREE.Vector3(0, 1, 0);
    const p = new THREE.Vector3(), fwd = new THREE.Vector3(), fwd2 = new THREE.Vector3();
    const right = new THREE.Vector3(), up2 = new THREE.Vector3();
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), qr = new THREE.Quaternion();

    const render = (now: number) => {
      for (const f of flyers) {
        let u = reduced ? f.still : (now - f.t0) / f.dur;
        if (!reduced && u > 1) {
          f.curve = makePath();
          f.t0 = now + rand(800, 3500);
          f.dur = rand(14000, 22000);
          f.roll = 0;
          u = -1;
        }
        const show = f.enabled && u >= 0 && u <= 1;
        f.group.visible = show;
        f.trail.visible = show;
        if (!show) continue;

        const uu = clamp(u, 0, 1);
        const fade = smooth(0, 0.06, uu) * (1 - smooth(0.92, 1, uu));

        // Orientation: nose along the path, wings level, then bank into the turn.
        f.curve.getPoint(uu, p);
        f.curve.getTangent(uu, fwd);
        f.curve.getTangent(Math.min(1, uu + 0.02), fwd2);
        const turn = fwd.x * fwd2.y - fwd.y * fwd2.x;
        f.roll += (clamp(-turn * 4, -0.8, 0.8) - f.roll) * 0.05;
        right.crossVectors(fwd, UP).normalize();
        up2.crossVectors(right, fwd);
        m4.makeBasis(fwd, up2, right);
        q.setFromRotationMatrix(m4);
        qr.setFromAxisAngle(X, f.roll);
        f.group.position.copy(p);
        f.group.quaternion.copy(q).multiply(qr);

        f.lineMat.opacity = 0.8 * fade;
        f.fillMat.opacity = 0.14 * fade;

        // Dotted trail, fading out behind the plane.
        for (let i = 0; i < TRAIL_N; i++) {
          const ui = uu - (i + 1.5) * TRAIL_STEP;
          f.curve.getPoint(Math.max(0, ui), p);
          f.trailPos.setXYZ(i, p.x, p.y, p.z);
          f.trailAlpha.setX(i, ui < 0 ? 0 : Math.pow(1 - i / TRAIL_N, 1.6) * 0.65 * fade);
        }
        f.trailPos.needsUpdate = true;
        f.trailAlpha.needsUpdate = true;
      }
      renderer.render(scene, camera);
    };

    const resize = () => {
      const W = mount.clientWidth, H = mount.clientHeight;
      if (!W || !H) return;
      const pr = Math.min(window.devicePixelRatio, W < 640 ? 1.5 : 2);
      renderer.setPixelRatio(pr);
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      hh = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      hw = hh * camera.aspect;
      unit = Math.min(hw, hh * 1.3);
      flyers.forEach((f, i) => {
        f.group.scale.setScalar(unit * 0.16);
        f.curve = makePath();
        f.enabled = !(W < 640 && i === 2); // two planes on phones, three elsewhere
      });
      trailMat.uniforms.uPR.value = pr;
      trailMat.uniforms.uPx.value = W < 640 ? 2 : 2.4;
      if (reduced) render(performance.now());
    };

    let raf = 0;
    const tick = (now: number) => { raf = requestAnimationFrame(tick); render(now); };
    const start = () => { if (!raf && !reduced) raf = requestAnimationFrame(tick); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const onVis = () => (document.hidden ? stop() : start());

    // Follow theme changes.
    const onTheme = () => {
      accent.set(cssColor("text-accent", "color", "#7cff6b"));
      trailMat.uniforms.uColor.value.copy(accent);
      flyers.forEach((f) => { f.lineMat.color.copy(accent); f.fillMat.color.copy(accent); });
      if (reduced) render(performance.now());
    };
    const mo = new MutationObserver(onTheme);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme", "style"] });

    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();
    start();
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      ro.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      flyers.forEach((f) => {
        f.lineMat.dispose();
        f.fillMat.dispose();
        f.trail.geometry.dispose();
      });
      planeGeo.dispose();
      edgeGeo.dispose();
      trailMat.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return <div ref={mountRef} aria-hidden className="pointer-events-none absolute inset-0" />;
}