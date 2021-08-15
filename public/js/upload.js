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
      .then((response) => response.json())
      .then((result) => {
        fileInput.value = null;
        window.location.href = "/" + result.path;
      })
      .catch((error) => {
        //TODO: Dynamically add the error alert banner with error message
        console.error("Error:", error);
      });
  }
};
