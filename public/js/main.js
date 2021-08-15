const closeAlert = document.getElementById("close");
if (closeAlert) {
  closeAlert.addEventListener("click", fadeOutEffect(closeAlert));
}

function fadeOutEffect(fadeTarget) {
  // var fadeTarget = document.getElementById("target");
  // var fadeEffect = setInterval(function () {
  //   if (!fadeTarget.style.opacity) {
  //     fadeTarget.style.opacity = 1;
  //   }
  //   if (fadeTarget.style.opacity > 0) {
  //     fadeTarget.style.opacity -= 0.1;
  //   } else {
  //     clearInterval(fadeEffect);
  //   }
  // }, 200);
  console.log("fading error");
}
