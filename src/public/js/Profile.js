"use strict";

document.addEventListener("DOMContentLoaded", async function () {
  let response = await profileHandler(urlAPI, localStorage.getItem("token"));
  if (response.status == 200) {
    document.getElementById(
      "userName"
    ).innerHTML = `${response.message.name} ${response.message.lastname}`;
    document.getElementById("userEmail").innerHTML = response.message.email;
  }
});

async function deleteProfile() {
  let response = await deleteprofileHandler(
    urlAPI,
    localStorage.getItem("token")
  );
  if (response.status == 200) {
    window.alert(response.message.message);
    logout();
  } else {
    window.alert(response.message.error);
  }
}

async function changePassword() {
  let password = document.getElementById("inpt_password").value;

  let response = await changepasswordHandler(
    urlAPI,
    { password },
    localStorage.getItem("token")
  );

  if (response.status == 200) {
    window.alert(response.message.message);
  } else {
    window.alert(response.message.error);
  }
}
