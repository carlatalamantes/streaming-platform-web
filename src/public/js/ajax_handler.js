if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}

async function signupHandler(url, data) {
  const response = await fetch(`${url}/user/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return { status: response.status, message: await response.json() };
}

async function loginHandler(url, data) {
  const response = await fetch(`${url}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return { status: response.status, message: await response.json() };
}

async function profileHandler(url, token) {
  const response = await fetch(`${url}/user/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "auth-token": token,
    },
  });
  return { status: response.status, message: await response.json() };
}

async function deleteprofileHandler(url, token) {
  const response = await fetch(`${url}/user/profile`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "auth-token": token,
    },
  });
  return { status: response.status, message: await response.json() };
}

async function changepasswordHandler(url, password, token) {
  const response = await fetch(`${url}/user/password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "auth-token": token,
    },
    body: JSON.stringify(password),
  });
  return { status: response.status, message: await response.json() };
}
