"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { projects } from "@/data/site";

// Read your Tailwind theme colors so the 3D scene matches the rest of the site.
const cssColor = (cls: string, prop: "color" | "backgroundColor", fallback: string) => {
  const el = document.createElement("div");
  el.className = cls;
  el.style.cssText = "position:absolute;visibility:hidden;pointer-events:none";
  document.body.appendChild(el);
  const v = getComputedStyle(el)[prop];
  el.remove();
  return !v || v === "rgba(0, 0, 0, 0)" ? fallback : v;
};

type Tile = {
  mesh: THREE.Mesh;
  mat: THREE.MeshStandardMaterial;
  planeMat?: THREE.MeshBasicMaterial;
  texN?: THREE.CanvasTexture;
  texH?: THREE.CanvasTexture;
  slug?: string;
  x: number;
  y: number;
  base: THREE.Color;
  hot: THREE.Color;
  delay: number;
};

export default function Projects() {
  const mountRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const mount = mountRef.current!;
    const accentCss = cssColor("text-accent", "color", "#7cff6b");
    const cardCss = cssColor("bg-card", "backgroundColor", "#12161c");
    const bgCss = cssColor("bg-bg", "backgroundColor", "#0a0c10");
    const mutedCss = cssColor("text-muted", "color", "#8892a0");
    const accent = new THREE.Color(accentCss);
    const card = new THREE.Color(cardCss);
    const bg = new THREE.Color(bgCss);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 10, 8000);
    scene.add(new THREE.AmbientLight(0xffffff, 1.3));
    const sun = new THREE.DirectionalLight(0xffffff, 2.2);
    sun.position.set(-500, 700, 1200);
    scene.add(sun);

    const group = new THREE.Group();
    scene.add(group);

    let tiles: Tile[] = [];
    let geo: THREE.ExtrudeGeometry | null = null;
    let W = 0, H = 0, R = 100;
    let hovered: Tile | null = null;
    const mouse = { x: 0, y: 0, inside: false }; // world px, y up
    const ndc = new THREE.Vector2();
    const ray = new THREE.Raycaster();
    const start = performance.now();

    const makeLabel = (icon: string, title: string, idx: number, fg: string, sub: string) => {
      const c = document.createElement("canvas");
      c.width = c.height = 512;
      const g = c.getContext("2d")!;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillStyle = sub;
      g.font = "600 30px ui-monospace, monospace";
      g.fillText(String(idx + 1).padStart(2, "0"), 256, 120);
      g.fillStyle = fg;
      g.font = "110px system-ui, sans-serif";
      g.fillText(icon, 256, 205);
      g.font = "800 46px system-ui, sans-serif";
      const lines: string[] = [];
      let cur = "";
      for (const w of title.toUpperCase().split(" ")) {
        const t = cur ? `${cur} ${w}` : w;
        if (g.measureText(t).width > 340 && cur) { lines.push(cur); cur = w; } else cur = t;
      }
      lines.push(cur);
      lines.slice(0, 3).forEach((l, i) => g.fillText(l, 256, 300 + i * 54));
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      return tex;
    };

    const clear = () => {
      tiles.forEach((t) => {
        t.mat.dispose();
        t.planeMat?.dispose();
        t.texN?.dispose();
        t.texH?.dispose();
      });
      group.clear();
      geo?.dispose();
      tiles = [];
      hovered = null;
    };

    const build = () => {
      clear();
      W = mount.clientWidth;
      H = mount.clientHeight;
      if (!W || !H) return;
      renderer.setSize(W, H);
      camera.aspect = W / H;
      // Distance chosen so 1 world unit == 1 CSS pixel at z = 0.
      camera.position.z = H / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      camera.updateProjectionMatrix();

      // Portrait / small screens: size tiles from the width so they stay big enough to tap.
      const portrait = W < H || W < 640;
      R = portrait
        ? THREE.MathUtils.clamp(W / 4.2, 56, 110)
        : THREE.MathUtils.clamp(Math.min(W / 6.5, H / 4.2), 70, 150);
      const DEPTH = R * 0.18;
      const r = R * 0.93; // small gap between tiles

      const shape = new THREE.Shape();
      for (let i = 0; i < 6; i++) {
        const a = THREE.MathUtils.degToRad(60 * i + 90); // pointy-top hexagon
        const px = r * Math.cos(a), py = r * Math.sin(a);
        i === 0 ? shape.moveTo(px, py) : shape.lineTo(px, py);
      }
      shape.closePath();
      geo = new THREE.ExtrudeGeometry(shape, {
        depth: DEPTH,
        bevelEnabled: true,
        bevelSize: 4,
        bevelThickness: 4,
        bevelSegments: 2,
      });

      // Honeycomb lattice that overshoots the viewport so the page is fully covered.
      const w3 = Math.sqrt(3) * R;
      const rowH = 1.5 * R;
      const hc = Math.ceil(W / 2 / w3) + 1;
      const hr = Math.ceil(H / 2 / rowH) + 1;
      const cells: { x: number; y: number; d: number }[] = [];
      for (let row = -hr; row <= hr; row++) {
        for (let col = -hc; col <= hc; col++) {
          const x = col * w3 + (Math.abs(row) % 2 ? w3 / 2 : 0);
          const y = -row * rowH;
          cells.push({ x, y, d: Math.hypot(x, y * 1.2) });
        }
      }
      cells.sort((a, b) => a.d - b.d); // projects take the most central cells

      cells.forEach((cell, i) => {
        const p = projects[i];
        const base = p
          ? card.clone().lerp(accent, 0.22)
          : card.clone().lerp(bg, 0.35);
        const hot = p ? accent.clone() : base.clone().lerp(accent, 0.15);
        const mat = new THREE.MeshStandardMaterial({
          color: base.clone(),
          roughness: 0.55,
          metalness: 0.25,
        });
        const mesh = new THREE.Mesh(geo!, mat);
        mesh.position.set(cell.x, cell.y, -400);
        mesh.visible = false;

        const tile: Tile = {
          mesh, mat, base, hot,
          x: cell.x, y: cell.y,
          slug: p?.slug,
          delay: cell.d * 1.1,
        };

        if (p) {
          tile.texN = makeLabel(p.icon, p.title, i, accentCss, mutedCss);
          tile.texH = makeLabel(p.icon, p.title, i, bgCss, bgCss);
          tile.planeMat = new THREE.MeshBasicMaterial({
            map: tile.texN,
            transparent: true,
            toneMapped: false,
            depthWrite: false,
          });
          const plane = new THREE.Mesh(new THREE.PlaneGeometry(R * 1.7, R * 1.7), tile.planeMat);
          plane.position.z = DEPTH + 4.5;
          mesh.add(plane);
        }

        mesh.userData.tile = tile;
        group.add(mesh);
        tiles.push(tile);
      });
    };

    const setHover = (next: Tile | null) => {
      if (next === hovered) return;
      if (hovered?.planeMat) hovered.planeMat.map = hovered.texN!;
      if (next?.planeMat) next.planeMat.map = next.texH!;
      hovered = next;
      renderer.domElement.style.cursor = next?.slug ? "pointer" : "default";
    };

    // Accepts both PointerEvent and MouseEvent.
    const pick = (e: { clientX: number; clientY: number }) => {
      const rect = mount.getBoundingClientRect();
      const px = e.clientX - rect.left, py = e.clientY - rect.top;
      ndc.set((px / rect.width) * 2 - 1, -(py / rect.height) * 2 + 1);
      mouse.x = ndc.x * (W / 2);
      mouse.y = ndc.y * (H / 2);
      mouse.inside = true;
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects(tiles.map((t) => t.mesh), false)[0];
      setHover(hit ? (hit.object.userData.tile as Tile) : null);
    };

    // Touch fires pointerleave BEFORE click, so only mouse clears hover here.
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouse.inside = false;
      setHover(null);
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") mouse.inside = false; // stop tilt after finger lifts
    };
    // Re-pick from the tap position so taps always open the right tile.
    const onClick = (e: MouseEvent) => {
      pick(e);
      if (hovered?.slug) router.push(`/projects/${hovered.slug}`);
    };

    const el = renderer.domElement;
    el.style.touchAction = "none";
    el.style.display = "block";
    el.addEventListener("pointermove", pick);
    el.addEventListener("pointerdown", pick);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("click", onClick);

    const ro = new ResizeObserver(build);
    ro.observe(mount);
    build();

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const now = performance.now() - start;
      for (const t of tiles) {
        if (!t.mesh.visible) {
          if (now < t.delay) continue; // staggered entrance from the center out
          t.mesh.visible = true;
        }
        const hot = t === hovered;
        const m = t.mesh;
        const tz = hot ? (t.slug ? R * 1.1 : R * 0.25) : 0;
        const ts = hot && t.slug ? 1.06 : 1;
        m.position.z += (tz - m.position.z) * 0.14;
        m.scale.setScalar(m.scale.x + (ts - m.scale.x) * 0.14);

        // Tilt so the side nearest the cursor presses in.
        const dx = hot && mouse.inside ? (mouse.x - t.x) / R : 0;
        const dy = hot && mouse.inside ? (mouse.y - t.y) / R : 0;
        m.rotation.y += (dx * 0.25 - m.rotation.y) * 0.12;
        m.rotation.x += (-dy * 0.25 - m.rotation.x) * 0.12;

        t.mat.color.lerp(hot ? t.hot : t.base, 0.15);
      }
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener("pointermove", pick);
      el.removeEventListener("pointerdown", pick);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("click", onClick);
      clear();
      renderer.dispose();
      el.remove();
    };
  }, [router]);

  return (
    <main className="fixed inset-0 overflow-hidden bg-bg">
      <div ref={mountRef} className="absolute inset-0 touch-none" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4 pt-[max(1rem,env(safe-area-inset-top))] md:p-8">
        <Link
          href="/"
          aria-label="Back to home"
          className="pointer-events-auto rounded-full border border-line bg-bg/70 px-4 py-2 font-mono text-xs text-muted backdrop-blur hover:text-accent"
        >
          ← Back
        </Link>
      </div>
    </main>
  );
}