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

async function historyHandler(url, token, data) {
  const response = await fetch(`${url}/user/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "auth-token": token,
    },
    body: JSON.stringify(data),
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

/**
 * ADMIN
 */
async function mediaHandler(url, data, token) {
  const response = await fetch(`${url}/admin/media`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "auth-token": token,
    },
    body: JSON.stringify(data),
  });
  return { status: response.status, message: await response.json() };
}

async function getmediaHandler(url, token) {
  const response = await fetch(`${url}/admin/media`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "auth-token": token,
    },
  });
  return { status: response.status, message: await response.json() };
}

async function getmediabyidHandler(url, token, id) {
  const response = await fetch(`${url}/admin/media/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "auth-token": token,
    },
  });
  return { status: response.status, message: await response.json() };
}

async function deletemediabyidHandler(url, token, id) {
  const response = await fetch(`${url}/admin/media/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "auth-token": token,
    },
  });
  return { status: response.status, message: await response.json() };
}

async function updatemediabyidHandler(url, token, id, data) {
  const response = await fetch(`${url}/admin/media/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "auth-token": token,
    },
    body: JSON.stringify(data),
  });
  return { status: response.status, message: await response.json() };
}

async function usersHandler(url, token) {
  const response = await fetch(`${url}/user/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "auth-token": token,
    },
  });
  return { status: response.status, message: await response.json() };
}

async function deletuserbyidHandler(url, token, id) {
  const response = await fetch(`${url}/user/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "auth-token": token,
    },
  });
  return { status: response.status, message: await response.json() };
}

/**
 * REVIEWS
 */

async function reviewHandler(url, token, data) {
  const response = await fetch(`${url}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "auth-token": token,
    },
    body: JSON.stringify(data),
  });
  return { status: response.status, message: await response.json() };
}

async function reviewHandler(url, token, id) {
  const response = await fetch(`${url}/review/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "auth-token": token,
    },
  });
  return { status: response.status, message: await response.json() };
}
