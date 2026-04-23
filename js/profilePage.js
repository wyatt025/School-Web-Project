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
        document.getElementById("dob").textContent = data.birthday;
        if (userId == user.id) {
            document.getElementById("editProfile").innerHTML = `
            <div class="edit-profile">
                <button id="editBtn">Edit Profile</button>
                <ul id="editMenu" class="hidden">
                    <li><a href="editProfile.html">Edit Details</a></li>
                    <li><a href="changePassword.html">Change Password</a></li>
                </ul>
            </div>
            `;
        }
        document.getElementById("editBtn").addEventListener("click", () => {
            document.getElementById("editMenu").classList.toggle("hidden");
        });
    });
}

  //console.log(user)
  async function EditClick(id){

  }