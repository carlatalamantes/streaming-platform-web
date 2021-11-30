const urlAPI = "https://streaming-platform-web.herokuapp.com";
//const urlAPI = "http://localhost:3000";

function logout() {
  localStorage.removeItem("token");
  window.location.replace("/");
}
