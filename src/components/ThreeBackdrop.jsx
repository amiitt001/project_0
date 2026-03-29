import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBackdrop() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return undefined;

    const isMobile = window.innerWidth < 768;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: false,
      powerPreference: isMobile ? "low-power" : "high-performance"
    });
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100;

    // ── Main particle field (reduced on mobile) ───────
    const particleCount = isMobile ? 600 : 2400;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const neonGreen = new THREE.Color(0x00ff88);
    const white = new THREE.Color(0xaaccff);

    for (let i = 0; i < particleCount; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 300;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 300;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 300;

      const pick = Math.random();
      const c = pick < 0.8 ? neonGreen : white;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.6 : 0.45,
      transparent: true,
      opacity: 0.7,
      vertexColors: true,
      sizeAttenuation: true
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ── Perspective grid ──────────────────────────────
    const gridDivisions = isMobile ? 25 : 50;
    const grid = new THREE.GridHelper(300, gridDivisions, 0x0d3420, 0x0d2416);
    grid.position.y = -55;
    grid.material.opacity = 0.35;
    grid.material.transparent = true;
    scene.add(grid);

    // Disposables for cleanup
    const disposables = [geometry, material];

    // ── Desktop-only: torus, ring, lines ──────────────
    let torus, ring2;
    if (!isMobile) {
      const torusGeo = new THREE.TorusGeometry(60, 1.2, 6, 80);
      const torusMat = new THREE.MeshBasicMaterial({ color: 0x00ff88, wireframe: true, transparent: true, opacity: 0.08 });
      torus = new THREE.Mesh(torusGeo, torusMat);
      torus.rotation.x = Math.PI / 2.5;
      torus.position.set(40, -10, -40);
      scene.add(torus);

      const ring2Geo = new THREE.TorusGeometry(30, 0.6, 4, 60);
      const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true, transparent: true, opacity: 0.06 });
      ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2.rotation.x = Math.PI / 3;
      ring2.position.set(-50, 20, -60);
      scene.add(ring2);

      const lineMat = new THREE.LineBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.04 });
      const lineCount = 40;
      for (let i = 0; i < lineCount; i++) {
        const lineGeo = new THREE.BufferGeometry();
        const p1 = new THREE.Vector3((Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200);
        const p2 = new THREE.Vector3(p1.x + (Math.random() - 0.5) * 80, p1.y + (Math.random() - 0.5) * 80, p1.z + (Math.random() - 0.5) * 80);
        lineGeo.setFromPoints([p1, p2]);
        scene.add(new THREE.Line(lineGeo, lineMat));
        disposables.push(lineGeo);
      }
      disposables.push(torusGeo, torusMat, ring2Geo, ring2Mat, lineMat);
    }

    const cursor = { x: 0, y: 0 };
    const cursorTarget = { x: 0, y: 0 };

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    const handlePointerMove = (event) => {
      cursorTarget.x = (event.clientX / window.innerWidth) * 2 - 1;
      cursorTarget.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener("resize", handleResize);
    if (!isMobile) {
      window.addEventListener("pointermove", handlePointerMove);
    }

    let frameId;
    let t = 0;
    let lastFrame = 0;
    const targetInterval = isMobile ? 1000 / 30 : 0; // 30fps cap on mobile

    const animate = (timestamp) => {
      frameId = requestAnimationFrame(animate);

      if (isMobile && timestamp - lastFrame < targetInterval) return;
      lastFrame = timestamp;

      t += 0.004;
      cursor.x += (cursorTarget.x - cursor.x) * 0.05;
      cursor.y += (cursorTarget.y - cursor.y) * 0.05;

      points.rotation.y = t * 0.08;
      points.rotation.x = t * 0.03;
      points.position.x = cursor.x * 8;
      points.position.y = cursor.y * 6;

      grid.position.x = cursor.x * 4;

      if (torus) {
        torus.rotation.z = t * 0.15;
        torus.rotation.y = t * 0.08;
      }
      if (ring2) {
        ring2.rotation.z = -t * 0.12;
        ring2.rotation.x = Math.PI / 3 + t * 0.05;
      }

      material.opacity = 0.5 + Math.sin(t * 2.5) * 0.2;

      camera.position.x += ((cursor.x * 14) - camera.position.x) * 0.035;
      camera.position.y += ((Math.sin(t) * 8) + cursor.y * 10 - camera.position.y) * 0.035;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate(0);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      disposables.forEach(d => d.dispose());
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 opacity-60" aria-hidden="true" />;
}
