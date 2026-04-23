const BACKEND_ROOT_URL = 'https://backend-school-web-project.onrender.com';

const user = JSON.parse(localStorage.getItem("user"));
const userId = localStorage.getItem("userId");

console.log("User from localStorage:", user);
console.log("UserId:", userId);

if (!user || !userId) {
  alert("User not logged in properly");
  window.location.href = "login.html";
}

document.getElementById("username").textContent = user.username;
document.getElementById("name").textContent = user.fullname;
document.getElementById("email").textContent = user.email;
document.getElementById("gender").textContent = user.gender ? user.gender : "Not available";
document.getElementById("birthday").textContent = user.birthday ? user.birthday.split("T")[0]: "Not set";;

  //console.log(user)
  async function EditClick(id){

  }