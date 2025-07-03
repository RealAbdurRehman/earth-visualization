import * as THREE from "three";

const loadingScreen = document.querySelector(".loading-screen");
const loadingText = document.querySelector(".loading-text");
const loadedText = document.querySelector(".loaded-text");

const controls = document.querySelector(".controls");

const loadingManager = new THREE.LoadingManager();
loadingManager.onProgress = function (url, loadedItems, totelItems) {
  loadingText.innerText = `Currently Loading: ${url}, ${loadedItems} / ${totelItems}`;
};

loadingManager.onLoad = function () {
  loadingScreen.style.opacity = 0;
  loadingScreen.style.visibility = "hidden";

  loadedText.style.visibility = "visible";
  loadedText.style.opacity = 1;

  setTimeout(() => {
    loadedText.style.opacity = 0;
    loadedText.style.visibility = "hidden";

    controls.style.opacity = 1;
  }, 2000);
};

export default loadingManager;
