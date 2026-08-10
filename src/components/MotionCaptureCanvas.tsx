import { Html, useAnimations, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

interface MotionCaptureCanvasProps {
  mode: 'capture' | 'surface';
  playing: boolean;
  loadingLabel: string;
  interactionLabel: string;
}

const MODEL_PATH = '/models/motion-capture-idle.glb';
const HIT_MODEL_PATH = '/models/motion-capture-hit.glb';

const CAPTURE_JOINTS = new Set([
  'Hips',
  'Spine',
  'Spine1',
  'Spine2',
  'Neck',
  'Neck1',
  'Head',
  'RightShoulder',
  'RightArm',
  'RightForeArm',
  'RightHand',
  'LeftShoulder',
  'LeftArm',
  'LeftForeArm',
  'LeftHand',
  'RightUpLeg',
  'RightLeg',
  'RightFoot',
  'RightToeBase',
  'LeftUpLeg',
  'LeftLeg',
  'LeftFoot',
  'LeftToeBase',
]);

interface CaptureRigProps {
  mode: MotionCaptureCanvasProps['mode'];
  playing: boolean;
  reactionRequest: number;
  requestReaction: () => void;
}

function CaptureRig({ mode, playing, reactionRequest, requestReaction }: CaptureRigProps) {
  const { scene, animations } = useGLTF(MODEL_PATH);
  const { animations: hitAnimations } = useGLTF(HIT_MODEL_PATH);
  const { model, authoredMaterials } = useMemo(() => {
    const clonedModel = clone(scene);
    const materials: Array<{
      material: THREE.Material;
      opacity: number;
      transparent: boolean;
      depthWrite: boolean;
    }> = [];

    clonedModel.traverse((node) => {
      if (!(node instanceof THREE.Mesh)) return;

      const sourceMaterials = Array.isArray(node.material) ? node.material : [node.material];
      const clonedMaterials = sourceMaterials.map((sourceMaterial) => {
        const material = sourceMaterial.clone();
        materials.push({
          material,
          opacity: material.opacity,
          transparent: material.transparent,
          depthWrite: material.depthWrite,
        });
        return material;
      });

      node.material = Array.isArray(node.material) ? clonedMaterials : clonedMaterials[0];
      node.frustumCulled = false;
    });

    return { model: clonedModel, authoredMaterials: materials };
  }, [scene]);
  const rigRef = useRef<THREE.Group>(null);
  const lineGeometryRef = useRef<THREE.BufferGeometry>(null);
  const pointGeometryRef = useRef<THREE.BufferGeometry>(null);
  const tempA = useMemo(() => new THREE.Vector3(), []);
  const tempB = useMemo(() => new THREE.Vector3(), []);
  const bones = useMemo(() => {
    const result: THREE.Bone[] = [];
    model.traverse((node) => {
      if (node instanceof THREE.Bone) result.push(node);
    });
    return result;
  }, [model]);
  const captureBones = useMemo(
    () => bones.filter((bone) => CAPTURE_JOINTS.has(bone.name)),
    [bones],
  );
  const boneLinks = useMemo(
    () =>
      captureBones.flatMap((bone) =>
        bone.parent instanceof THREE.Bone && CAPTURE_JOINTS.has(bone.parent.name)
          ? [[bone.parent, bone] as const]
          : [],
      ),
    [captureBones],
  );
  const linePositions = useMemo(
    () => new Float32Array(boneLinks.length * 2 * 3),
    [boneLinks.length],
  );
  const pointPositions = useMemo(
    () => new Float32Array(captureBones.length * 3),
    [captureBones.length],
  );
  const motionClips = useMemo(() => [...animations, ...hitAnimations], [animations, hitAnimations]);
  const { actions, mixer } = useAnimations(motionClips, model);

  useEffect(() => {
    authoredMaterials.forEach(({ material, opacity, transparent, depthWrite }) => {
      material.opacity = mode === 'capture' ? opacity * 0.34 : opacity;
      material.transparent = mode === 'capture' ? true : transparent;
      material.depthWrite = mode === 'capture' ? false : depthWrite;
      material.needsUpdate = true;
    });
  }, [authoredMaterials, mode]);

  useEffect(
    () => () => {
      authoredMaterials.forEach(({ material }) => material.dispose());
    },
    [authoredMaterials],
  );

  useEffect(() => {
    const action = actions.idle3_processed;
    if (!action) return;

    action.reset().fadeIn(0.45).play();
    return () => {
      action.fadeOut(0.2);
    };
  }, [actions]);

  useEffect(() => {
    const action = actions.idle3_processed;
    action?.setEffectiveTimeScale(playing ? 1 : 0);
  }, [actions, playing]);

  useEffect(() => {
    const idleAction = actions.idle3_processed;
    const hitAction = actions.under_attack_1;
    if (!idleAction || !hitAction || reactionRequest === 0) return;

    idleAction.fadeOut(0.1);
    hitAction.reset().setLoop(THREE.LoopOnce, 1).setEffectiveTimeScale(1).fadeIn(0.1).play();
  }, [actions, reactionRequest]);

  useEffect(() => {
    const idleAction = actions.idle3_processed;
    const hitAction = actions.under_attack_1;
    if (!idleAction || !hitAction) return;

    const handleFinished = (event: { action: THREE.AnimationAction }) => {
      if (event.action !== hitAction) return;
      hitAction.fadeOut(0.16);
      idleAction
        .reset()
        .setEffectiveTimeScale(playing ? 1 : 0)
        .fadeIn(0.22)
        .play();
    };

    mixer.addEventListener('finished', handleFinished);
    return () => mixer.removeEventListener('finished', handleFinished);
  }, [actions, mixer, playing]);

  useFrame((state, delta) => {
    const rig = rigRef.current;
    const lineGeometry = lineGeometryRef.current;
    const pointGeometry = pointGeometryRef.current;
    if (!rig || !lineGeometry || !pointGeometry) return;

    rig.rotation.y = THREE.MathUtils.damp(rig.rotation.y, 0.08 + state.pointer.x * 0.14, 4, delta);
    rig.rotation.x = THREE.MathUtils.damp(rig.rotation.x, state.pointer.y * -0.025, 4, delta);
    rig.updateWorldMatrix(true, true);

    const lineAttribute = lineGeometry.getAttribute('position') as THREE.BufferAttribute;
    boneLinks.forEach(([parent, child], index) => {
      parent.getWorldPosition(tempA);
      child.getWorldPosition(tempB);
      rig.worldToLocal(tempA);
      rig.worldToLocal(tempB);
      lineAttribute.setXYZ(index * 2, tempA.x, tempA.y, tempA.z);
      lineAttribute.setXYZ(index * 2 + 1, tempB.x, tempB.y, tempB.z);
    });
    lineAttribute.needsUpdate = true;

    const pointAttribute = pointGeometry.getAttribute('position') as THREE.BufferAttribute;
    captureBones.forEach((bone, index) => {
      bone.getWorldPosition(tempA);
      rig.worldToLocal(tempA);
      pointAttribute.setXYZ(index, tempA.x, tempA.y, tempA.z);
    });
    pointAttribute.needsUpdate = true;
  });

  const skeletonOpacity = mode === 'capture' ? 0.92 : 0.2;

  return (
    <group
      ref={rigRef}
      position={[0, -0.9, 0]}
      onClick={(event) => {
        event.stopPropagation();
        requestReaction();
      }}
    >
      <primitive object={model} />

      <lineSegments renderOrder={3}>
        <bufferGeometry ref={lineGeometryRef}>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#4bd0e4"
          depthTest={false}
          opacity={skeletonOpacity}
          transparent
        />
      </lineSegments>

      <points renderOrder={4}>
        <bufferGeometry ref={pointGeometryRef}>
          <bufferAttribute attach="attributes-position" args={[pointPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#dffbff"
          depthTest={false}
          opacity={skeletonOpacity}
          size={0.032}
          sizeAttenuation
          transparent
        />
      </points>
    </group>
  );
}

function SceneLoader({ label }: { label: string }) {
  return (
    <Html center>
      <div className="whitespace-nowrap text-xs font-medium text-white/55">{label}</div>
    </Html>
  );
}

export default function MotionCaptureCanvas({
  mode,
  playing,
  loadingLabel,
  interactionLabel,
}: MotionCaptureCanvasProps) {
  const [reactionRequest, setReactionRequest] = useState(0);
  const requestReaction = () => setReactionRequest((current) => current + 1);

  return (
    <Canvas
      aria-label={interactionLabel}
      camera={{ fov: 30, near: 0.1, far: 50, position: [0, 0.05, 3.6] }}
      className="cursor-pointer focus:outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-1px] focus-visible:outline-[#4bd0e4]"
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        requestReaction();
      }}
      role="button"
      tabIndex={0}
    >
      <hemisphereLight color="#ffffff" groundColor="#0a1014" intensity={1.6} />
      <directionalLight color="#fffaf2" intensity={3.6} position={[2.5, 3.5, 3]} />
      <directionalLight color="#4bd0e4" intensity={1.15} position={[-2.5, 1, -2]} />

      <Suspense fallback={<SceneLoader label={loadingLabel} />}>
        <CaptureRig
          mode={mode}
          playing={playing}
          reactionRequest={reactionRequest}
          requestReaction={requestReaction}
        />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(MODEL_PATH);
useGLTF.preload(HIT_MODEL_PATH);
