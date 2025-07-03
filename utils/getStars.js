import * as THREE from "three";

function getRandDistance({ min, max }) {
  const randNumInRange = Math.random() * (max - min) + min;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);

  const x = randNumInRange * Math.sin(phi) * Math.cos(theta);
  const y = randNumInRange * Math.sin(phi) * Math.sin(theta);
  const z = randNumInRange * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

export default function getStars(
  scene = null,
  amount = 500,
  distanceLimit = { min: 125, max: 250 }
) {
  if (!scene) return;
  const starMat = new THREE.MeshStandardMaterial({
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 10,
  });

  for (let i = 0; i < amount; i++) {
    const size = Math.random() * 0.25 + 0.5;
    const distance = getRandDistance(distanceLimit);

    const starGeo = new THREE.SphereGeometry(size);
    const starMesh = new THREE.Mesh(starGeo, starMat);
    starMesh.position.copy(distance);
    scene.add(starMesh);
  }
}
