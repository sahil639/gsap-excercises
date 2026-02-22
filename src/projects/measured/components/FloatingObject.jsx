import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function FloatingObject() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x4466ff, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.8);
    mainLight.position.set(3, 4, 5);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x3344cc, 0.6);
    fillLight.position.set(-3, -2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x6688ff, 1.2, 20);
    rimLight.position.set(-2, 3, -3);
    scene.add(rimLight);

    // Torus knot geometry — compact sculptural object
    const geometry = new THREE.TorusKnotGeometry(1, 0.35, 200, 32, 2, 3);

    const material = new THREE.MeshPhysicalMaterial({
      color: 0x2244dd,
      metalness: 0.15,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 0.9,
      envMapIntensity: 1.0,
    });

    // Create a simple environment map for reflections
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
    const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeRenderTarget);

    // Simple gradient environment using a scene with colored lights
    const envScene = new THREE.Scene();
    const envGeo = new THREE.SphereGeometry(5, 32, 32);
    const envMat = new THREE.MeshBasicMaterial({
      color: 0x1a2a6c,
      side: THREE.BackSide,
    });
    const envMesh = new THREE.Mesh(envGeo, envMat);
    envScene.add(envMesh);

    const envLight1 = new THREE.PointLight(0x4466ff, 3, 10);
    envLight1.position.set(2, 3, 2);
    envScene.add(envLight1);

    const envLight2 = new THREE.PointLight(0x2233aa, 2, 10);
    envLight2.position.set(-3, -1, -2);
    envScene.add(envLight2);

    cubeCamera.update(renderer, envScene);
    material.envMap = cubeRenderTarget.texture;

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = 0.3;
    mesh.rotation.z = -0.2;
    scene.add(mesh);

    // Cursor tracking with lerp
    const mouse = { x: 0, y: 0 };
    const targetRotation = { x: 0.3, y: 0 };
    const currentRotation = { x: 0.3, y: 0 };

    const handleMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotation.x = 0.3 + mouse.y * 0.3;
      targetRotation.y = mouse.x * 0.4;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth lerp rotation following cursor
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.04;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.04;

      mesh.rotation.x = currentRotation.x;
      mesh.rotation.y = currentRotation.y + t * 0.15;
      mesh.rotation.z = -0.2 + Math.sin(t * 0.5) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      material.dispose();
      geometry.dispose();
      envMat.dispose();
      envGeo.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="floating-object" />;
}
