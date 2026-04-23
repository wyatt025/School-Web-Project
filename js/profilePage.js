const BACKEND_ROOT_URL = 'https://backend-school-web-project.onrender.com';

const user = JSON.parse(localStorage.getItem("user"));
const userId = localStorage.getItem("userId");

//console.log("User from localStorage:", user);
//console.log("UserId:", userId);

if (!user || !userId) {
  alert("User not logged in properly");
  window.location.href = "login.html";
}

document.getElementById("username").textContent = user.username;
document.getElementById("name").textContent = user.fullname;
document.getElementById("email").textContent = user.email;
document.getElementById("gender").textContent = user.gender ? user.gender : "Not available";
document.getElementById("birthday").textContent = user.birthday ? user.birthday.split("T")[0]: "Not set";;

forEach(document.querySelectorAll(".edit-btn"), btn => {
    btn.addEventListener("click", () => {
        const field = btn.dataset.field;
        const currentValue = document.getElementById(field).textContent;
        const newValue = prompt(`Enter new value for ${field}:`, currentValue);
        if (newValue !== null) {
            document.getElementById(field).textContent = newValue;
            updateProfile(field, newValue);
        }
    });
});

async function updateProfile(field, value) {
    const updateData = {
        firstName: document.getElementById("name").textContent.split(" ")[0],
        lastName: document.getElementById("name").textContent.split(" ")[1] || "",
        email: document.getElementById("email").textContent,
        gender: document.getElementById("gender").textContent,
        birthday: document.getElementById("birthday").textContent
    };

    try {
        const response = await fetch(`${BACKEND_ROOT_URL}/profile/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Profile updated successfully:", result);
    } catch (error) {
        console.error("❌ UPDATE ERROR:", error);
    }
}