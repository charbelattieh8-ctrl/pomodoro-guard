import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform float uProgress;
  uniform float uMotion;
  uniform vec2 uResolution;
  uniform vec3 uTopColor;
  uniform vec3 uBottomColor;
  uniform vec3 uWaterShallow;
  uniform vec3 uWaterDeep;
  uniform vec3 uHighlightColor;

  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.03;
      amplitude *= 0.5;
    }
    return value;
  }

  float wave(vec2 uv, float speed, float freq, float amp, float phase) {
    float t = uTime * speed * uMotion;
    return sin(uv.x * freq + t + phase) * amp
      + sin(uv.x * (freq * 1.9) - t * 1.2 + phase * 1.7) * amp * 0.45;
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspectUv = uv;
    aspectUv.x *= uResolution.x / max(uResolution.y, 1.0);

    float progress = clamp(uProgress, 0.0, 1.0);
    float baseLevel = mix(0.08, 0.94, progress);
    float waveA = wave(uv, 0.16, 10.0, 0.010, 0.0);
    float waveB = wave(uv, 0.11, 17.0, 0.006, 1.9);
    float waveC = wave(uv, 0.08, 25.0, 0.0035, 4.2);
    float surface = clamp(baseLevel + waveA + waveB + waveC, 0.02, 0.985);
    float waterMask = smoothstep(surface + 0.02, surface - 0.015, uv.y);
    float depth = clamp((surface - uv.y) / max(surface, 0.001), 0.0, 1.0);

    vec3 air = mix(uTopColor, uBottomColor, pow(1.0 - uv.y, 1.6));

    vec2 flowUv = vec2(
      aspectUv.x * 1.8 + fbm(aspectUv * 1.1 + vec2(0.0, uTime * 0.03)) * 0.12,
      uv.y * 2.6 - uTime * 0.05
    );
    vec2 refraction = vec2(
      fbm(flowUv + vec2(0.0, uTime * 0.04)) - 0.5,
      fbm(flowUv * 1.3 - vec2(uTime * 0.03, 0.0)) - 0.5
    ) * 0.026 * waterMask;
    vec2 distortedUv = uv + refraction;

    float depthMix = smoothstep(0.0, 1.0, depth * 1.1 + (1.0 - progress) * 0.08);
    vec3 water = mix(uWaterShallow, uWaterDeep, depthMix);

    float causticField = fbm(vec2(aspectUv.x * 9.0, distortedUv.y * 16.0 - uTime * 0.18));
    float causticBands = sin((aspectUv.x + causticField * 0.18) * 32.0 - uTime * 0.9)
      * sin((distortedUv.y * 18.0 - uTime * 0.65) + causticField * 5.0);
    float caustics = pow(smoothstep(0.62, 0.98, causticBands * 0.5 + 0.5), 2.2)
      * 0.16
      * waterMask
      * (0.35 + (1.0 - depth) * 0.7);

    float surfaceBand = exp(-abs(uv.y - surface) * 150.0);
    float surfaceHighlight = surfaceBand * (0.18 + 0.12 * sin(uTime * 0.5 + uv.x * 8.0) * uMotion);
    float crest = exp(-abs(uv.y - (surface + 0.006)) * 240.0) * 0.28;

    float reflection = smoothstep(0.1, 0.95, 1.0 - distance(uv, vec2(0.78, 0.12)));
    reflection *= 0.18 + 0.05 * sin(uTime * 0.18) * uMotion;

    float vignette = smoothstep(1.15, 0.2, distance(uv, vec2(0.5, 0.46)));

    float bubbles = 0.0;
    for (int i = 0; i < 10; i++) {
      float fi = float(i);
      float seed = fi * 12.13;
      float x = fract(hash(seed + 1.0) + fi * 0.097);
      float speed = mix(0.04, 0.095, hash(seed + 2.0));
      float phase = fract(hash(seed + 3.0) + uTime * speed * (0.35 + uMotion * 0.65));
      float y = mix(-0.12, surface + 0.12, phase);
      float drift = (hash(seed + 4.0) - 0.5) * 0.045 * sin(uTime * (0.2 + fi * 0.03) + fi);
      float radius = mix(0.003, 0.012, hash(seed + 5.0));
      float bubble = smoothstep(radius, radius * 0.18, distance(uv, vec2(x + drift, y)));
      bubbles += bubble * waterMask * 0.06;
    }

    vec3 color = air;
    color = mix(color, water, waterMask * 0.98);
    color += uHighlightColor * caustics;
    color += vec3(0.72, 0.9, 1.0) * surfaceHighlight * waterMask;
    color += vec3(0.9, 0.97, 1.0) * crest * waterMask;
    color += vec3(0.85, 0.94, 1.0) * bubbles;
    color += vec3(0.75, 0.9, 1.0) * reflection * (0.42 + progress * 0.18);
    color *= vignette;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function WaterPlane({ progress, reduceMotion }) {
  const materialRef = useRef(null);
  const progressRef = useRef(progress);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: progress },
      uMotion: { value: reduceMotion ? 0 : 1 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uTopColor: { value: new THREE.Color("#031019") },
      uBottomColor: { value: new THREE.Color("#0b1f31") },
      uWaterShallow: { value: new THREE.Color("#63d9ff") },
      uWaterDeep: { value: new THREE.Color("#0b5f92") },
      uHighlightColor: { value: new THREE.Color("#d7f7ff") },
    }),
    [progress, reduceMotion]
  );

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uMotion.value = reduceMotion ? 0 : 1;
  }, [reduceMotion]);

  useFrame((state, delta) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = reduceMotion ? 0 : state.clock.getElapsedTime();
    materialRef.current.uniforms.uResolution.value.set(state.size.width, state.size.height);
    materialRef.current.uniforms.uProgress.value = THREE.MathUtils.damp(
      materialRef.current.uniforms.uProgress.value,
      progressRef.current,
      4.5,
      delta
    );
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export default function WaterTimerBackground({ progress, reduceMotion }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.75]}
      >
        <WaterPlane progress={progress} reduceMotion={reduceMotion} />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(194,242,255,0.14),transparent_36%),linear-gradient(180deg,rgba(3,10,18,0.1),rgba(3,10,18,0.32)_48%,rgba(2,8,14,0.68))]" />
    </div>
  );
}
