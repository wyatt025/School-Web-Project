const BACKEND_ROOT_URL = process.env.BACKEND_URL;

const user = JSON.parse(localStorage.getItem("user"));
const userId = localStorage.getItem("userId");

console.log("User from localStorage:", user);
console.log("UserId:", userId);

if (!user || !userId) {
  alert("User not logged in properly");
  window.location.href = "login.html";
}

document.getElementById("name").textContent = user.fullname;
document.getElementById("email").textContent = user.email;

document.getElementById("gender").textContent = user.gender;
document.getElementById("birthday").textContent = user.birthday;


fetch(`${BACKEND_ROOT_URL}/profile/${userId}`)
  .then(res => {
    console.log("STATUS:", res.status);

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
  console.log(user)