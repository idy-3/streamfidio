const uploadButton = document.getElementById("upload_btn");
const fileInput = document.getElementById("video");

const progressBar = document.getElementById('progressBar');
const progressBarFill = document.querySelector('#progressBar > .progress-bar-fill');
const progressBarText = document.querySelector('.progress-bar-text');

uploadButton.addEventListener("click", () => {
  fileInput.click();
});

const uploadFile = () => {
  if (fileInput.files.length > 0) {
    progressBar.hidden = false;

    const fidio = new FormData();
    fidio.append("file", fileInput.files[0]);

    const csrfToken = document.getElementById("_csrf").value;
    console.log(fidio)

    // const headers = new Headers({
    //         'X-CSRF-TOKEN': csrfToken
    //   });

    axios.post("/upload/", fidio, {        
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-TOKEN': csrfToken
        },        
        onUploadProgress: (p) => {
          // console.log(p);
           const percent = p.lengthComputable ? (p.loaded / p.total) * 100 : 0;

           progressBarFill.style.width = percent.toFixed(2) + "%";
           progressBarText.textContent = percent.toFixed(2) + "%";
        }
      })
      .then((response) => {
        console.log("UPLOAD");
        console.log(response);
        if (response.statusText === 'OK') {
          fileInput.value = null;
          window.location.href = "/" + response.data.path;
          console.log(response);
          console.log("redirected");
        } else {
          return Promise.reject(response);
        }
      })
      .catch((error) => {
        // Add the error alert banner with error message
        console.log(error)
        // error.json().then((msg) => {
        //   const errorMsg = `<div id="error-close" class="alert ${msg.alertType}">
        //                         <h3>${msg.errorMsg}</h3>        
        //                       <a onclick="errorFade()" id="close">&times;</a>
        //                     </div>`;

        //   const header = document.getElementById("header");
        //   header.insertAdjacentHTML("afterend", errorMsg);
        // });
      });
  }
};
