const BACKEND_ROOT_URL = 'https://backend-school-web-project.onrender.com';

const user = JSON.parse(localStorage.getItem("user"));
const userId = localStorage.getItem("userId");
if (!user || !userId) {
  alert("User not logged in properly");
  window.location.href = "login.html";
}

