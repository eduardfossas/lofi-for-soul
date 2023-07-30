import { Audio } from "./audio.js";
import * as THREE from "three";

const MESHES = [];
const olive = "#808000";
const yellow = "#fcf8d4";
const pink = "#e7aaa9";
const laelia = "#EABCD4";

const pallette = [
  yellow,
  pink,
  olive,
  laelia,
  yellow,
  pink,
  olive,
  laelia,
  yellow,
  pink,
  olive,
  laelia,
  yellow,
  pink,
  olive,
  laelia,
  yellow,
  pink,
  olive,
  laelia,
  yellow,
  pink,
  olive,
  laelia,
  yellow,
  pink,
  olive,
  laelia,
  yellow,
  pink,
  olive,
  laelia,
  yellow,
  pink,
  olive,
  laelia,
  yellow,
  pink,
  olive,
  laelia,
  yellow,
  pink,
  olive,
  laelia,
  yellow,
  pink,
  olive,
  laelia,
  yellow,
  pink,
  olive,
  laelia,
  yellow,
  pink,
  olive,
  laelia,
  yellow,
  pink,
  olive,
  laelia,
  yellow,
  pink,
  olive,
  laelia,
];

class App {
  constructor() {
    this.audio = new Audio("./love.mp3", 60);
    this.button = document.querySelector("[js-start]");

    window.addEventListener("click", () => {
      this.button.style.opacity = 0;
      this.audio.start();
    });

    this.three = {
      scene: new THREE.Scene(),
      camera: new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      ),
      renderer: new THREE.WebGLRenderer({ antialias: true }),
      clock: new THREE.Clock(),
    };

    this.count = 15;
    this.configureScene();
    this.addPrespective();
    this.addResize();
    this.resetPosition();
    this.animate();
  }

  configureScene() {
    this.three.camera.position.z = 1;
    this.three.camera.zoom = 1;
    document.body.appendChild(this.three.renderer.domElement);
  }

  setSize() {
    this.three.camera.aspect = window.innerWidth / window.innerHeight;
    this.three.camera.updateProjectionMatrix();

    this.three.renderer.setSize(window.innerWidth, window.innerHeight);
    this.three.renderer.setClearColor("#FFF");
  }

  addPrespective() {
    for (let i = 0; i < this.count; i++) {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, 1, 4, 1, true),
        new THREE.MeshBasicMaterial({
          color: pallette[i],
          side: THREE.DoubleSide,
          transparent: true,
        })
      );
      mesh.position.set(0, 0, -i);
      mesh.rotation.set(Math.PI / 2, Math.PI / 4, 0);
      mesh.label = pallette[i];
      MESHES.push(mesh);
      this.three.scene.add(mesh);
    }
  }

  resetPosition(drum = 0, bass = 0, voice = 0) {
    for (let i = 0; i < MESHES.length; i++) {
      MESHES[i].position.z += 0.01;
      let pos = Math.round((MESHES[i].position.z + 0.01 * 0.02) * 100) / 100;
      if (pos >= 1) {
        MESHES[i].position.z = -14;
      } else {
        MESHES[i].position.z = pos;
      }

      if (MESHES[i].label === yellow) {
        MESHES[i].scale.y = THREE.MathUtils.lerp(MESHES[i].scale.y, drum, 0.1);
      } else if (MESHES[i].label === pink) {
        MESHES[i].scale.y = THREE.MathUtils.lerp(MESHES[i].scale.y, bass, 0.1);
      } else if (MESHES[i].label === olive) {
        MESHES[i].scale.y = THREE.MathUtils.lerp(MESHES[i].scale.y, drum, 0.1);
      } else {
        MESHES[i].scale.y = THREE.MathUtils.lerp(MESHES[i].scale.y, voice, 0.1);
      }
    }
  }

  addResize() {
    this.setSize();
    window.addEventListener("resize", () => this.setSize());
  }

  animate() {
    this.three.renderer.render(this.three.scene, this.three.camera);

    if (this.audio.ready) {
      this.drumKick = this.audio.addAudioSignal(22, 35);
      this.bass = this.audio.addAudioSignal(115, 130);
      this.voice = this.audio.addAudioSignal(300, 350);
      // this.beat = this.audio.addAudioSignal();
      if (this.drum === 1) {
        this.drum = 0;
      } else {
        this.drum = this.drum;
      }

      if (this.bass === 1) {
        this.bass = 0;
      } else {
        this.bass = this.bass > 0.72 ? this.bass : 0;
      }

      if (this.drumKick === 1) {
        this.drumKick = 0;
      } else {
        this.drumKick = this.drumKick > 0.55 ? this.drumKick : 0;
      }

      if (this.voice === 1) {
        this.voice = 0;
      } else {
        this.voice = this.voice;
      }

      this.resetPosition(this.drumKick, this.bass, this.voice);
    }

    requestAnimationFrame(() => this.animate());
  }
}

new App();
