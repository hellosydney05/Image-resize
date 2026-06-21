let images = [];
let resizedBlobs = [];

/* Upload images */
document.getElementById("upload").addEventListener("change", function(e) {
  images = [];
  resizedBlobs = [];

  let files = e.target.files;

  for (let file of files) {
    let reader = new FileReader();

    reader.onload = function(event) {
      let img = new Image();
      img.src = event.target.result;
      images.push(img);
    };

    reader.readAsDataURL(file);
  }

  alert(files.length + " images loaded!");
});


/* Resize all images */
function resizeAll() {
  let w = parseInt(document.getElementById("width").value);
  let h = parseInt(document.getElementById("height").value);

  if (!w || !h) {
    alert("Enter width and height");
    return;
  }

  let preview = document.getElementById("preview");
  preview.innerHTML = "";
  resizedBlobs = [];

  images.forEach((img, index) => {

    img.onload = function() {

      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");

      canvas.width = w;
      canvas.height = h;

      ctx.drawImage(img, 0, 0, w, h);

      /* store blob for ZIP */
      canvas.toBlob(blob => {
        resizedBlobs.push({
          name: "image-" + index + ".png",
          blob: blob
        });
      });

      /* UI card */
      let div = document.createElement("div");
      div.className = "item";

      let downloadBtn = document.createElement("button");
      downloadBtn.innerText = "Download";

      downloadBtn.onclick = function () {
        let link = document.createElement("a");
        link.download = "image-" + index + ".png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      };

      div.appendChild(canvas);
      div.appendChild(downloadBtn);

      preview.appendChild(div);
    };

    img.src = img.src;
  });
}


/* Download ZIP */
function downloadZip() {

  if (resizedBlobs.length === 0) {
    alert("Please resize images first!");
    return;
  }

  let zip = new JSZip();

  resizedBlobs.forEach(file => {
    zip.file(file.name, file.blob);
  });

  zip.generateAsync({ type: "blob" }).then(function(content) {

    let link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "resized-images.zip";
    link.click();

  });
}