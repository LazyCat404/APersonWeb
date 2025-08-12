<template>
  <div ref="factoryWrapperRef" class="factory-wrapper"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, shallowRef } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 使用 shallowRef 替代 ref，避免深度代理
const factoryWrapperRef = ref<HTMLElement | null>(null);
const scene = shallowRef<THREE.Scene | null>(null);
const camera = shallowRef<THREE.PerspectiveCamera | null>(null);
const renderer = shallowRef<THREE.WebGLRenderer | null>(null);
const cube = shallowRef<THREE.Mesh | null>(null);
const controls = shallowRef<OrbitControls | null>(null);
const animationId = ref<number | null>(null);

// 初始化场景
const initScene = () => {
  if (!factoryWrapperRef.value) return;

  // 创建场景
  const sceneInstance = new THREE.Scene();
  sceneInstance.background = new THREE.Color(0x1a1a1a);
  sceneInstance.fog = new THREE.Fog(0x1a1a1a, 10, 50);
  scene.value = sceneInstance;

  // 创建相机
  const cameraInstance = new THREE.PerspectiveCamera(
    75,
    factoryWrapperRef.value.clientWidth / factoryWrapperRef.value.clientHeight,
    0.1,
    1000
  );
  cameraInstance.position.set(5, 5, 5);
  cameraInstance.lookAt(0, 0, 0);
  camera.value = cameraInstance;

  // 创建渲染器
  const rendererInstance = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  rendererInstance.setSize(factoryWrapperRef.value.clientWidth, factoryWrapperRef.value.clientHeight);
  rendererInstance.shadowMap.enabled = true;
  rendererInstance.shadowMap.type = THREE.PCFSoftShadowMap;
  factoryWrapperRef.value.appendChild(rendererInstance.domElement);
  renderer.value = rendererInstance;

  // 添加轨道控制器
  const controlsInstance = new OrbitControls(cameraInstance, rendererInstance.domElement);
  controlsInstance.enableDamping = true;
  controlsInstance.dampingFactor = 0.05;
  controlsInstance.maxDistance = 20;
  controlsInstance.minDistance = 2;
  controls.value = controlsInstance;

  // 创建立方体
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshPhongMaterial({
    color: 0x00ff88,
    emissive: 0x002211,
    shininess: 100,
    specular: 0x00ff00
  });
  const cubeInstance = new THREE.Mesh(geometry, material);
  cubeInstance.castShadow = true;
  cubeInstance.receiveShadow = true;
  sceneInstance.add(cubeInstance);
  cube.value = cubeInstance;

  // 添加光源
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  sceneInstance.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.near = 0.1;
  directionalLight.shadow.camera.far = 50;
  directionalLight.shadow.camera.left = -10;
  directionalLight.shadow.camera.right = 10;
  directionalLight.shadow.camera.top = 10;
  directionalLight.shadow.camera.bottom = -10;
  sceneInstance.add(directionalLight);

  // 添加点光源
  const pointLight = new THREE.PointLight(0x00ff88, 1, 100);
  pointLight.position.set(5, 5, 5);
  pointLight.castShadow = true;
  sceneInstance.add(pointLight);

  // 添加网格地面
  const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
  sceneInstance.add(gridHelper);

  // 添加坐标轴辅助
  const axesHelper = new THREE.AxesHelper(5);
  sceneInstance.add(axesHelper);

  // 添加窗口大小变化监听
  window.addEventListener('resize', onWindowResize);
};

// 窗口大小变化处理
const onWindowResize = () => {
  if (!factoryWrapperRef.value || !camera.value || !renderer.value) return;

  camera.value.aspect = factoryWrapperRef.value.clientWidth / factoryWrapperRef.value.clientHeight;
  camera.value.updateProjectionMatrix();
  renderer.value.setSize(factoryWrapperRef.value.clientWidth, factoryWrapperRef.value.clientHeight);
};

// 动画循环
const animate = () => {
  animationId.value = requestAnimationFrame(animate);

  // 直接使用实例而不是通过 ref 访问
  if (cube.value) {
    cube.value.rotation.x += 0.005;
    cube.value.rotation.y += 0.005;
  }

  controls.value?.update();

  if (scene.value && camera.value && renderer.value) {
    renderer.value.render(scene.value, camera.value);
  }
};

// 组件挂载时初始化
onMounted(() => {
  initScene();
  animate();
});

// 组件卸载时清理
onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize);

  if (animationId.value) {
    cancelAnimationFrame(animationId.value);
  }

  if (renderer.value) {
    renderer.value.dispose();
  }

  if (controls.value) {
    controls.value.dispose();
  }
});
</script>
<style scoped lang="scss">
.factory-wrapper {
  width: 100%;
  height: 100%;
  background-color: #333;
}
</style>
