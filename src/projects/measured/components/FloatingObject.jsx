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

    /* ================================================
     * SCROLL-BASED ROTATION & POSITION ANIMATION
     * ------------------------------------------------
     * - scrollProgress (0→1) drives progressive rotation
     * - When the footer-tagline is in view, the object
     *   smoothly animates from top-left to the center
     *   of the page, between "Get" and "Measured."
     * ================================================ */
    let scrollProgress = 0;

    // Current animated position (lerped for smoothness)
    const currentPos = { top: -6, left: -6 }; // vw units (matches CSS default)
    const targetPos = { top: -6, left: -6 };
    let isAtFooter = false;

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = docHeight > 0 ? window.scrollY / docHeight : 0;

      // Check if footer tagline is visible
      const tagline = document.querySelector('.footer-tagline');
      if (tagline) {
        const rect = tagline.getBoundingClientRect();
        const viewH = window.innerHeight;

        // Trigger when footer-tagline enters bottom 60% of viewport
        const footerVisible = rect.top < viewH * 0.7 && rect.bottom > 0;

        if (footerVisible) {
          isAtFooter = true;
          // Position: center of viewport, accounting for object container size
          const containerW = container.clientWidth;
          const containerH = container.clientHeight;
          // Center between "Get" and "Measured." — use tagline center as reference
          const tagCenterX = rect.left + rect.width / 2;
          const tagCenterY = rect.top + rect.height / 2;
          targetPos.top = tagCenterY - containerH / 2;
          targetPos.left = tagCenterX - containerW / 2;
        } else {
          isAtFooter = false;
          // Default top-left position (in pixels, converting from vw)
          targetPos.top = -6 * window.innerWidth / 100;
          targetPos.left = -6 * window.innerWidth / 100;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      handleScroll(); // Recalculate positions on resize
    };
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth lerp rotation following cursor + scroll-based progressive rotation
      // scrollProgress adds up to 2 full rotations (4π) across the page
      const scrollRotationOffset = scrollProgress * Math.PI * 4;

      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.04;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.04;

      mesh.rotation.x = currentRotation.x + scrollRotationOffset * 0.3;
      mesh.rotation.y = currentRotation.y + t * 0.15 + scrollRotationOffset * 0.5;
      mesh.rotation.z = -0.2 + Math.sin(t * 0.5) * 0.05 + scrollRotationOffset * 0.2;

      // Smooth lerp for container position (pixel values)
      // Use a slightly faster lerp when moving to footer for responsive feel
      const lerpSpeed = isAtFooter ? 0.06 : 0.04;
      currentPos.top += (targetPos.top - currentPos.top) * lerpSpeed;
      currentPos.left += (targetPos.left - currentPos.left) * lerpSpeed;

      container.style.top = currentPos.top + 'px';
      container.style.left = currentPos.left + 'px';

      renderer.render(scene, camera);
    };

    // Initialize position in pixels
    currentPos.top = -6 * window.innerWidth / 100;
    currentPos.left = -6 * window.innerWidth / 100;
    handleScroll();
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
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
