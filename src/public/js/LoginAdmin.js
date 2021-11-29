"use strict";
//const jwt = require("jsonwebtoken");

async function loginAdmin() {
  var alert = document.getElementById("errortxt");
  var email = document.getElementById("inpt_email").value;
  var password = document.getElementById("inpt_password").value;
  let response = await loginHandler(urlAPI, {
    email,
    password,
  });

  if (response.status == 401) {
    alert.innerText = `ERROR: ${response.message.error}`;
  } else if (response.status == 400) {
    alert.innerText = `ERROR: ${response.message.error[0].msg}`;
  } else if (response.status == 200) {
    let token = response.message.token;
    localStorage.setItem("token", token);
    var decoded = jwt_decode(token);
    if (decoded.role.includes("admin")) {
      window.location.replace("/adminpanel/media");
    } else {
      window.alert("Invalid role");
    }
  }
}
