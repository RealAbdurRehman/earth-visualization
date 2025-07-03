let userInteracted = false;

const backgroundAudio = new Audio("assets/audio/background.mp3");
backgroundAudio.loop = true;

function onUserInteraction() {
  if (userInteracted) return;

  backgroundAudio.play();
  userInteracted = true;
}

window.addEventListener("click", onUserInteraction, { once: true });
window.addEventListener("keydown", onUserInteraction, { once: true });
window.addEventListener("touchstart", onUserInteraction, { once: true });

export default backgroundAudio;
