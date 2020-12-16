function sendPseudo() {
    new Promise((resolve, reject) => {
        if(document.getElementById("sendPseudo").value === "") {
            reject(new Error("Empty pseudo"));
        }
        resolve();
    })
    .then(() => fetch("/profile/pseudo", {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            pseudo: document.getElementById("sendPseudo").value,
        }),
    }))
    .then(async (response) => {
        if(!response.ok) {
            throw new Error(await response.text());
        }
    })
    .then(() => document.location.reload())
    .catch((error) => {
        alert(`Error: ${error.message}\nPlease reload the page`);
    });
}

function sendFile() {
    const form = new FormData();
    form.append("ppic", document.getElementById("browse").files[0]);
    new Promise((resolve, reject) => {
        if(document.getElementById("browse").files.length !== 1) {
            reject(new Error("Please select a file"));
        }
        resolve();
    })
    .then(() => fetch("/profile/ppic", {
        method: "PUT",
        body: form,
        redirect: "follow",
    }))
    .then(async (response) => {
        if(!response.ok) {
            throw new Error(await response.text())
        }
    })
    .then(() => document.location.reload())
    .catch((error) => {
        alert(`Error: ${error.message}\nPlease reload the page`);
    });
}

function previewFile() {
    const fr = new FileReader();
    fr.addEventListener("load", () => {
        document.getElementById("ppic").src = fr.result;
    });
    fr.readAsDataURL(document.getElementById("browse").files[0]);
}


function deleteFile() {
    fetch("/profile/ppic", {
        method: "DELETE",
    })
    .then(async (response) => {
        if(!response.ok) {
            throw new Error(await response.text());
        }
    })
    .then(() => document.location.reload())
    .catch((error) => {
        alert(`Error: ${error.message}\nPlease reload the page`);
    });
}