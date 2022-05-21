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

const editMedia = (mediaId, mediaName, trending) => {
  // console.log(mediaId, mediaName);
  const modal = document.getElementById("theModal");
  const span = document.getElementsByClassName("close")[0];

  if (modal) {
    modal.querySelector("#mediaNameForm").action = "/update-name/" + mediaId;
    modal.querySelector("#mediaName").value = mediaName;

    const trend = modal.querySelector("#trending")
    trend.checked = (trending === 'true')? true : false;

    const btn = modal.querySelector("button");

    modal.style.display = "block";

    span.onclick = function () {
      modal.style.display = "none";
    };

    btn.onclick = function () {
      modal.style.display = "none";
      // window.location.href = "/dashboard"
    };

    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  }
};

const getReport = (subject, complaint) => {
  // Get the modal
  var modal = document.getElementById("theModal");
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  if (modal) {
    modal.querySelector("#reportSubject").innerHTML = subject;
    modal.querySelector("#reportComplaint").innerHTML = complaint;

    modal.style.display = "block";
    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
      modal.style.display = "none";
    };
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  }
};
