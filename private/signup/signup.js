function checkPasswordConfirmation() {
  const password = document.getElementById("pass");
  const confpassword = document.getElementById("cpass");

  if (password.value != confpassword.value) {
    confpassword.style.backgroundColor = "rgba(230, 0, 0, 0.4)";
    confpassword.setCustomValidity(
      "Passwords don't match! Please enter the same password."
    );
  }
}
