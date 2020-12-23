const img = document.querySelector("img");
const file = document.querySelector("input[type=file]");

const ppicInput = document.querySelector("#actions > input");
const loadButton = document.getElementById("load");
const clearButton = document.getElementById("clear");
const saveButton = document.getElementById("save");
const changeButton = document.getElementById("changeButton");

window.addEventListener("load", async () => {
  ppicInput.onchange = previewFile;

  loadButton.onclick = () => {
    clearButton.classList.remove("clear");
    saveButton.classList.add("hide");
    ppicInput.click();
  };

  clearButton.onclick = () => {
    img.src = "/img/nopic.png";
    file.value = "";
    clearButton.classList.add("clear");
    saveButton.classList.remove("hide");
  };

  saveButton.onclick = () => {
    saveButton.classList.add("hide");
    if (clearButton.classList.contains("clear")) deleteFile();
    else sendFile();
  };

  changeButton.onclick = changePseudo;
});

previewFile(); // first preview on page load

function previewFile() {
  const reader = new FileReader();

  if (!file) return;
  reader.onloadend = (info) => {
    // reader.result is a base64 string
    img.src = reader.result;
    saveButton.classList.remove("hide");
  };

  if (file.files[0]) reader.readAsDataURL(file.files[0]);
}

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

  fetch("/file", { method: "POST", body: form })
    .then((cursor) => cursor.text())
    .then((res) => (window.location.href = "/"))
    .catch((err) => console.error(err));
}

function deleteFile() {
  fetch("/file", { method: "DELETE" })
    .then((cursor) => cursor.text())
    .then(() => (window.location.href = "/"))
    .catch((err) => console.error(err));
}

function changePseudo() {
  let changePseudo = document.getElementById("changePseudo");
  let changeButton = document.getElementById("changeButton");
  if (changePseudo.readOnly) {
    changePseudo.placeholder = changePseudo.value;
    changePseudo.value = "";
    changePseudo.readOnly = false;
    changeButton.innerText = "👌";
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
    changeButton.innerText = "🖊";
  }
}
