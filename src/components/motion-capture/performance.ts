import * as THREE from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

export const MODEL_PATH = '/models/motion-performance.glb';
export type MotionMode = 'in-place' | 'root-motion';

export interface MotionFrame {
  center: THREE.Vector3;
  radius: number;
  halfSize: THREE.Vector3;
}

export function preparePerformance(
  scene: THREE.Group,
  clip: THREE.AnimationClip,
) {
  const model = clone(scene);
  const rootTrack = clip.tracks.find(
    (track) => track.name === 'Armature.position',
  );
  const root = model.getObjectByName('Armature');
  if (!root || !rootTrack) {
    throw new Error('The performance requires an animated Armature root.');
  }

  const origin = new THREE.Vector3().fromArray(rootTrack.values);
  const mixer = new THREE.AnimationMixer(model);
  const action = mixer.clipAction(clip);
  action.play();

  // Sample the skinned geometry, including its animation, for both camera frames.
  const rootBounds = new THREE.Box3();
  const inPlaceBounds = new THREE.Box3();
  const bounds = new THREE.Box3();
  const displacement = new THREE.Vector3();
  for (let sample = 0; sample <= 96; sample += 1) {
    mixer.setTime((sample / 96) * (clip.duration - 0.00001));
    model.updateMatrixWorld(true);
    bounds.setFromObject(model, true);
    rootBounds.union(bounds);
    displacement.copy(root.position).sub(origin).setY(0);
    inPlaceBounds.union(bounds.translate(displacement.negate()));
  }
  mixer.setTime(0);
  model.updateMatrixWorld(true);
  model.traverse((node) => {
    if (node instanceof THREE.Mesh) node.frustumCulled = false;
  });

  const frame = (box: THREE.Box3): MotionFrame => {
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    return {
      center: sphere.center,
      radius: sphere.radius,
      halfSize: box.getSize(new THREE.Vector3()).multiplyScalar(0.5),
    };
  };

  return {
    model,
    root,
    origin,
    mixer,
    frames: {
      'in-place': frame(inPlaceBounds),
      'root-motion': frame(rootBounds),
    },
    floor: Math.min(rootBounds.min.y, inPlaceBounds.min.y),
  };
}

export function cameraDistance(
  frame: MotionFrame,
  aspect: number,
  fov: number,
  direction: THREE.Vector3,
) {
  const verticalTangent = Math.tan(THREE.MathUtils.degToRad(fov / 2));
  const horizontalTangent = verticalTangent * aspect;
  const right = new THREE.Vector3()
    .crossVectors(THREE.Object3D.DEFAULT_UP, direction)
    .normalize();
  const up = new THREE.Vector3().crossVectors(direction, right).normalize();
  const corner = new THREE.Vector3();
  let distance = 0;
  for (const x of [-1, 1]) {
    for (const y of [-1, 1]) {
      for (const z of [-1, 1]) {
        corner.set(
          x * frame.halfSize.x,
          y * frame.halfSize.y,
          z * frame.halfSize.z,
        );
        distance = Math.max(
          distance,
          corner.dot(direction) +
            Math.max(
              Math.abs(corner.dot(right)) / horizontalTangent,
              Math.abs(corner.dot(up)) / verticalTangent,
            ) *
              1.18,
        );
      }
    }
  }
  return distance + frame.radius * 0.08;
}
