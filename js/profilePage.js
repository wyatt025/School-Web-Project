// Get user from localStorage
const user = JSON.parse(localStorage.getItem("user"));
const userId = localStorage.getItem("userId");

console.log("User from localStorage:", user);
console.log("UserId:", userId);

// If no user → redirect
if (!user || !userId) {
  alert("User not logged in properly");
  window.location.href = "login.html";
}

// ✅ STEP 1: Show basic data immediately (always works)
document.getElementById("name").textContent = user.username;
document.getElementById("email").textContent = user.email;

// Default values (in case backend fails)
document.getElementById("gender").textContent = user.gender;
document.getElementById("birthday").textContent = user.birthday;


// ✅ STEP 2: Try fetching extra data from backend (optional)
fetch(`https://backend-school-web-project.onrender.com/profile/${userId}`)
  .then(res => {
    if (!res.ok) throw new Error("Backend fetch failed");
    return res.json();
  })
  .then(data => {
    console.log("Profile data from backend:", data);

    // Only update if data exists
    if (data.gender) {
      document.getElementById("gender").textContent = data.gender;
    }

    if (data.birthday) {
      document.getElementById("birthday").textContent = data.birthday;
    }
  })
  .catch(err => {
    console.warn("Backend not working, using local data only:", err);
  });