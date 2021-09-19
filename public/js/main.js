window.onload = () => {
  const copyLink = document.getElementById("copy-link");
  if (copyLink) {
    copyLink.value = window.location.href;
  }
  // window.location.href
};

const getLink = () => {
  const copyLink = document.getElementById("copy-link");
  copyLink.focus();
  copyLink.select();
  copyLink.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyLink.value).then(() => {
    const copyComfirm = document.getElementById("copied-tooltip");
    copyComfirm.style.visibility = "visible";
    setTimeout(() => {
      copyComfirm.style.visibility = "hidden";
    }, 500);
  });
};

const errorFade = () => {
  let fadeTarget = document.getElementById("error-close");
  let fadeEffect = setInterval(function () {
    if (!fadeTarget.style.opacity) {
      fadeTarget.style.opacity = 1;
    }
    if (fadeTarget.style.opacity > 0) {
      fadeTarget.style.opacity -= 0.1;
    } else {
      clearInterval(fadeEffect);
      fadeTarget.remove();
    }
  }, 200);
};
