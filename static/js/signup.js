function checkPasswordConfirmation() {
  let password = document.getElementById("pass");
  let confpassword = document.getElementById("cpass");

  if (password.value != confpassword.value) {
    confpassword.style.backgroundColor = "rgba(230, 0, 0, 0.4)";
    confpassword.setCustomValidity(
      "Password's confirmation don't match! Please enter the same password."
    );
  } else {
    confpassword.setCustomValidity("");
    confpassword.style.backgroundColor = "";
  }
}
