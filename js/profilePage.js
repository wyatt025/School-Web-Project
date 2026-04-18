const user = JSON.parse(localStorage.getItem("user"));
const userId = localStorage.getItem("userId");

console.log("User from localStorage:", user);
console.log("UserId:", userId);

if (!user || !userId) {
  alert("User not logged in properly");
  window.location.href = "login.html";
}

document.getElementById("name").textContent = user.username;
document.getElementById("email").textContent = user.email;

document.getElementById("gender").textContent = user.gender;
document.getElementById("birthday").textContent = user.birthday;


fetch(`https://backend-school-web-project.onrender.com/profile/${userId}`)
  .then(res => {
    console.log("STATUS:", res.status);

    return res.json();
  })
  .then(data => {
    document.getElementById("gender").textContent =
      data.gender ? data.gender : "Not available";

    document.getElementById("birthday").textContent =
      data.birthday ? data.birthday : "Not available";
  })
  .catch(err => {
    console.error("❌ FETCH ERROR:", err);
  });
  console.log(user)