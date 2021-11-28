"use strict";

async function signupUser() {
  var alert = document.getElementById("errortxt");
  alert.innerText = "";
  var name = document.getElementById("inpt_name").value;
  var lastname = document.getElementById("inpt_lastname").value;
  var email = document.getElementById("inpt_email").value;
  var password = document.getElementById("inpt_password").value;
  let response = await signupHandler(urlAPI, {
    name,
    lastname,
    email,
    password,
  });

  if (response.status == 422) {
    alert.innerText = `ERROR: ${response.message.message}`;
  } else if (response.status == 400) {
    let errorsArray = [];
    for (let i = 0; i < response.message.length; i++) {
      errorsArray.push(response.message[i].msg);
    }
    alert.innerText = `ERROR: ${errorsArray}`;
  } else if (response.status == 201) {
    document.getElementById("signupForm").reset();
    window.alert(response.message.message);
  }
}
