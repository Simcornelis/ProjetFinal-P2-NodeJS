window.addEventListener("load", async () => {
  const ppic = document.getElementById("ppic");
  const accountMenu = document.querySelector("div.account");
  const codeInput = document.querySelector("div#code > input");
  const topartyButton = document.getElementById("toparty");

  // open account menu
  ppic.onclick = () => {
    accountMenu.classList.toggle("open");
  };

  // close account menu when focus is lost
  window.onclick = (event) => {
    if (!event.target.matches("#ppic")) accountMenu.classList.remove("open");
  };

  codeInput.addEventListener("keyup", (event) => {
    // on ENTER key pressed
    if (event.keyCode === 13) {
      event.preventDefault();
      toParty();
    }
  });

  topartyButton.onclick = toParty;

  function toParty() {
    if (!codeInput.value)
      alert("Enter a party code given by a friend or a new one.");
    else window.location.href = "/party/" + codeInput.value;
  }
});
