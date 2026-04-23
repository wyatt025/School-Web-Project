const BACKEND_ROOT_URL = 'https://backend-school-web-project.onrender.com';

const user = JSON.parse(localStorage.getItem("user"));
const userId = localStorage.getItem("userId");

console.log("User from localStorage:", user);
//console.log("UserId:", userId);

if (!user || !userId) {
  alert("User not logged in properly");
  window.location.href = "login.html";
}

async function loadProfileDetails() {
    fetch(`${BACKEND_ROOT_URL}/profile/${userId}`)
    .then(res => res.json())
    .then(data => {
        document.getElementById("username").textContent = data.username;
        document.getElementById("name").textContent = data.fullname;
        document.getElementById("email").textContent = data.email;
        document.getElementById("gender").textContent = data.gender;
        
    });
}
document.getElementById("birthday").textContent = user.birthday;

fetch(`${BACKEND_ROOT_URL}/profile/${userId}`)
  .then(res => {
    //console.log("STATUS:", res.status);

    return res.json();
  })
  .then(data => {
    document.getElementById("gender").textContent =
      data.gender ? data.gender : "Not available";

    const formattedDate = data.birthday
  ? data.birthday.split("T")[0]
  : "Not set";

document.getElementById("birthday").textContent = formattedDate;
  })
  .catch(err => {
    console.error("❌ FETCH ERROR:", err);
  });
  //console.log(user)
  async function EditClick(id){

  }