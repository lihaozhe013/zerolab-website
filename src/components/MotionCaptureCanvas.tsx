import { Grid, Html, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, type ComponentRef } from 'react';
import * as THREE from 'three';
import {
  cameraDistance,
  MODEL_PATH,
  preparePerformance,
  type MotionMode,
} from './motion-capture/performance';

interface MotionCaptureCanvasProps {
  mode: MotionMode;
  cameraReset: number;
  playing: boolean;
  reducedMotion: boolean;
  loadingLabel: string;
  interactionLabel: string;
}

const TRANSITION_DURATION = 1.2;
const VIEW_DIRECTION = new THREE.Vector3(1, 0.45, 1.7).normalize();

function Performance({
  mode,
  cameraReset,
  playing,
  reducedMotion,
}: Pick<
  MotionCaptureCanvasProps,
  'mode' | 'cameraReset' | 'playing' | 'reducedMotion'
>) {
  const { scene, animations } = useGLTF(MODEL_PATH);
  const performance = useMemo(() => {
    if (!animations[0]) throw new Error('The performance has no animation.');
    return preparePerformance(scene, animations[0]);
  }, [scene, animations]);
  const { camera, size } = useThree();
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);
  const displacementGroup = useRef<THREE.Group>(null);
  const blend = useRef(mode === 'root-motion' ? 1 : 0);
  const initialized = useRef(false);
  const transition = useRef<{
    elapsed: number;
    fromBlend: number;
    toBlend: number;
    fromPosition: THREE.Vector3;
    toPosition: THREE.Vector3;
    fromTarget: THREE.Vector3;
    toTarget: THREE.Vector3;
  } | null>(null);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls || !(camera instanceof THREE.PerspectiveCamera)) return;
    const frame = performance.frames[mode];
    const direction = VIEW_DIRECTION;
    const destination = frame.center
      .clone()
      .addScaledVector(
        direction,
        cameraDistance(frame, size.width / size.height, camera.fov, direction),
      );
    const toBlend = mode === 'root-motion' ? 1 : 0;

    if (!initialized.current || reducedMotion) {
      camera.position.copy(destination);
      controls.target.copy(frame.center);
      blend.current = toBlend;
      transition.current = null;
      controls.enabled = true;
      controls.update();
      initialized.current = true;
      return;
    }

    transition.current = {
      elapsed: 0,
      fromBlend: blend.current,
      toBlend,
      fromPosition: camera.position.clone(),
      toPosition: destination,
      fromTarget: controls.target.clone(),
      toTarget: frame.center.clone(),
    };
    controls.enabled = false;
  }, [
    camera,
    mode,
    cameraReset,
    performance,
    reducedMotion,
    size.width,
    size.height,
  ]);

  useEffect(() => {
    performance.mixer.clipAction(animations[0]).play();
    return () => {
      performance.mixer.stopAllAction();
      performance.mixer.uncacheRoot(performance.model);
    };
  }, [performance, animations]);

  useFrame((_, delta) => {
    // Clamp background-tab gaps so resuming does not skip the performance.
    if (playing) performance.mixer.update(Math.min(delta, 0.05));
    const current = transition.current;
    const controls = controlsRef.current;
    if (current && controls) {
      current.elapsed = Math.min(current.elapsed + delta, TRANSITION_DURATION);
      const progress = current.elapsed / TRANSITION_DURATION;
      const eased = progress * progress * (3 - 2 * progress);
      blend.current = THREE.MathUtils.lerp(
        current.fromBlend,
        current.toBlend,
        eased,
      );
      camera.position.lerpVectors(
        current.fromPosition,
        current.toPosition,
        eased,
      );
      controls.target.lerpVectors(current.fromTarget, current.toTarget, eased);
      controls.update();
      if (progress === 1) {
        transition.current = null;
        controls.enabled = true;
      }
    }
    if (displacementGroup.current) {
      const { root, origin } = performance;
      // Cancel only horizontal travel; preserve vertical bounce and every joint track.
      displacementGroup.current.position.set(
        -(root.position.x - origin.x) * (1 - blend.current),
        0,
        -(root.position.z - origin.z) * (1 - blend.current),
      );
    }
  });

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.07}
        enablePan={false}
        enableZoom
        minDistance={0.5}
        maxDistance={60}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI / 2 - 0.03}
        rotateSpeed={0.65}
      />
      <group ref={displacementGroup}>
        <primitive object={performance.model} dispose={null} />
      </group>
      <Grid
        position={[0, performance.floor - 0.015, 0]}
        args={[40, 40]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#273b44"
        sectionSize={2}
        sectionThickness={0.8}
        sectionColor="#416570"
        fadeDistance={24}
        fadeStrength={1.5}
        infiniteGrid
      />
    </>
  );
}

function SceneLoader({ label }: { label: string }) {
  return (
    <Html center>
      <div className="whitespace-nowrap text-xs font-medium text-white/55">
        {label}
      </div>
    </Html>
  );
}

export default function MotionCaptureCanvas({
  mode,
  cameraReset,
  playing,
  reducedMotion,
  loadingLabel,
  interactionLabel,
}: MotionCaptureCanvasProps) {
  return (
    <Canvas
      aria-label={interactionLabel}
      camera={{ fov: 38, near: 0.05, far: 150, position: [3, 2, 5] }}
      className="touch-none cursor-grab active:cursor-grabbing"
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      role="img"
    >
      <hemisphereLight color="#ffffff" groundColor="#18212b" intensity={2} />
      <directionalLight color="#fffaf2" intensity={3.6} position={[3, 6, 5]} />
      <directionalLight color="#4bd0e4" intensity={2} position={[-3, 3, -4]} />
      <Suspense fallback={<SceneLoader label={loadingLabel} />}>
        <Performance
          mode={mode}
          cameraReset={cameraReset}
          playing={playing}
          reducedMotion={reducedMotion}
        />
      </Suspense>
    </Canvas>
  );
}
