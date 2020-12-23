const password = document.getElementById("pass");
const confpassword = document.getElementById("cpass");

function checkPasswordConfirmation() {
  if (password.value !== confpassword.value)
    confpassword.setCustomValidity(
      "Passwords don't match! Please enter the same password."
    );
  else confpassword.setCustomValidity("");
}
