window.addEventListener("load", async () => {
  // show ppic only if it's content is a valid URL
  const pv = document.querySelector("img");
  console.log(pv);
  if (pv.src != "//:0") pv.hidden = false;
  previewFile();
});

/**
 * Display a preview of the selected picture.
 */
function previewFile() {
  const preview = document.querySelector("img");
  console.log(preview);
  const file = document.querySelector("input[type=file]");
  const reader = new FileReader();

  if (!file) return;
  // reader.result is a base64 string
  reader.onloadend = (err) => {
    preview.src = reader.result;
    // preview.hidden = false;
  };

  if (file.files[0]) reader.readAsDataURL(file.files[0]);
}
/**
 * Send a picture file to the server.
 */
function sendFile() {
  const file = document.querySelector("input[type=file]").files[0];
  if (!file) return alert("No file loaded!");

  const size = (file.size / (1024 * 1024)).toFixed(2);
  if (size > 15)
    return alert(
      "The file should be smaller than 15 MB but it is " + size + " MB."
    );

  const form = new FormData();
  form.append("file", file);

  const url = window.location.origin + "/file";
  const params = { method: "POST", body: form };
  fetch(url, params)
    .then(alert("Profile picture updated!"))
    .then((window.location.href = "/"))
    .then((document.getElementById("browse").value = null))
    .catch((err) => console.error(err));
}

function deleteFile() {
  fetch("/file", {
    method: "DELETE",
  })
    .then(async (res) => {
      if (!res.ok) throw new Error(await res.text());
    })
    .then(() => document.location.reload())
    .catch((err) => {
      alert(`Error: ${err.message}\nPlease reload the page`);
    });
}

function changePseudo() {
  let changePseudo = document.getElementById("changePseudo");
  let changeButton = document.getElementById("changeButton");
  if (changePseudo.readOnly) {
    changePseudo.placeholder = changePseudo.value;
    changePseudo.value = "";
    changePseudo.readOnly = false;
    changeButton.innerText = "done";
  } else {
    let newPseudo = changePseudo.value;
    if (newPseudo !== "") {
      fetch("/profile/changepseudo?query_pseudo=" + newPseudo, {
        method: "PUT",
      })
        .then(async (res) => {
          if (!res.ok) throw new Error(await res.text());
        })
        .then(() => document.location.reload())
        .catch((err) => {
          alert(`Error: ${err.message}\nPlease reload the page`);
        });
    } else {
      changePseudo.value = changePseudo.placeholder;
    }
    changePseudo.placeholder = null;
    changePseudo.readOnly = true;
    changeButton.innerText = "create";
  }
}
