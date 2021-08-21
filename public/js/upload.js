const uploadButton = document.getElementById("upload_btn");
const fileInput = document.getElementById("video");

uploadButton.addEventListener("click", () => {
  fileInput.click();
});

const uploadFile = () => {
  if (fileInput.files.length > 0) {
    const fidio = new FormData();
    fidio.append("file", fileInput.files[0]);

    fetch("/upload/", {
      method: "POST",
      body: fidio,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject(response);
        }
      })
      .then((result) => {
        fileInput.value = null;
        window.location.href = "/" + result.path;
        // console.log(result);
      })
      .catch((error) => {
        // Add the error alert banner with error message
        error.json().then((msg) => {
          const errorMsg = `<div id="error-close" class="alert ${msg.alertType}">
                                <h3>${msg.errorMsg}</h3>        
                              <a onclick="errorFade()" id="close">&times;</a>
                            </div>`;

          const header = document.getElementById("header");
          header.insertAdjacentHTML("afterend", errorMsg);
        });
      });
  }
};
