const urlAPI = "http://localhost:3000";

function logout() {
  localStorage.removeItem("token");
  window.location.replace("/");
}
