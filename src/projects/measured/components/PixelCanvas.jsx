import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uRipples[8];
  uniform float uRippleTimes[8];
  uniform int uRippleCount;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;
    vec2 pixelCoord = uv * uResolution;

    // Grid parameters
    float gridSpacing = 10.0;
    float dotRadius = 1.8;

    // Snap to grid
    vec2 gridPos = floor(pixelCoord / gridSpacing) * gridSpacing + gridSpacing * 0.5;
    vec2 gridId = floor(pixelCoord / gridSpacing);
    float dist = length(pixelCoord - gridPos);

    // Background gradient: deep blue to slightly lighter blue
    vec3 bgTop = vec3(0.08, 0.12, 0.75);
    vec3 bgBottom = vec3(0.22, 0.28, 0.88);
    vec3 bg = mix(bgTop, bgBottom, uv.y);

    // Base dot visibility with subtle wave animation
    float wave = sin(gridId.x * 0.15 + uTime * 0.8) * cos(gridId.y * 0.12 + uTime * 0.6);
    float baseAlpha = 0.3 + 0.15 * wave;

    // Density variation — create structure like a world map pattern
    float noise = hash(gridId);
    float density = smoothstep(0.25, 0.65, noise + 0.15 * sin(gridId.x * 0.05 + gridId.y * 0.03));
    baseAlpha *= density;

    // Ripple effects
    float rippleEffect = 0.0;
    for (int i = 0; i < 8; i++) {
      if (i >= uRippleCount) break;
      vec2 rippleCenter = uRipples[i] * uResolution;
      float rippleAge = uTime - uRippleTimes[i];
      if (rippleAge < 0.0 || rippleAge > 3.0) continue;

      float rippleDist = length(gridPos - rippleCenter);
      float rippleRadius = rippleAge * 250.0;
      float rippleWidth = 80.0;
      float rippleStrength = smoothstep(rippleWidth, 0.0, abs(rippleDist - rippleRadius));
      rippleStrength *= exp(-rippleAge * 1.2);
      rippleEffect += rippleStrength;
    }

    // Apply ripple to dot size and brightness
    float finalRadius = dotRadius + rippleEffect * 2.0;
    float finalAlpha = baseAlpha + rippleEffect * 0.6;
    finalAlpha = clamp(finalAlpha, 0.0, 1.0);

    // Draw dot
    float dot = 1.0 - smoothstep(finalRadius - 0.8, finalRadius + 0.3, dist);

    // Dot color: white-ish with slight blue tint
    vec3 dotColor = vec3(0.85, 0.88, 1.0);
    vec3 rippleColor = vec3(0.95, 0.97, 1.0);
    vec3 finalDotColor = mix(dotColor, rippleColor, rippleEffect);

    vec3 color = mix(bg, finalDotColor, dot * finalAlpha);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const MAX_RIPPLES = 8;

export default function PixelCanvas() {
  const containerRef = useRef(null);
  const ripplesRef = useRef([]);
  const uniformsRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const ripplePositions = new Float32Array(MAX_RIPPLES * 2).fill(-999);
    const rippleTimes = new Float32Array(MAX_RIPPLES).fill(-999);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(width * renderer.getPixelRatio(), height * renderer.getPixelRatio()) },
      uRipples: { value: ripplePositions },
      uRippleTimes: { value: rippleTimes },
      uRippleCount: { value: 0 },
    };
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let rippleIndex = 0;

    const handleClick = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;

      const idx = rippleIndex % MAX_RIPPLES;
      ripplePositions[idx * 2] = x;
      ripplePositions[idx * 2 + 1] = y;
      rippleTimes[idx] = uniforms.uTime.value;
      uniforms.uRippleCount.value = Math.min(rippleIndex + 1, MAX_RIPPLES);
      rippleIndex++;
    };

    container.addEventListener('click', handleClick);

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
    };

    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      material.dispose();
      geometry.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="pixel-canvas" />;
}
