const urlAPI = "https://streaming-platform-web.herokuapp.com";

function logout() {
  localStorage.removeItem("token");
  window.location.replace("/");
}
