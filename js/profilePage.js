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
document.getElementById("birthday").textContent = user.birthday ? user.birthday.split("T")[0].split("-").reverse().join("-"): "Not set";

const fields = ["username", "name", "email", "gender", "birthday"];

const editBtn = document.getElementById("edit-btn");
const btnContainer = document.getElementById("button-container");
let isEditing = false;

editBtn.addEventListener("click", async () => {
    // Wrap this in a check to ensure the element exists
    const passwordContainer = document.getElementById("password-container");

    if (!isEditing) {
        isEditing = true;
        editBtn.textContent = "Save Changes";

        const cancelBtn = document.createElement("button");
        cancelBtn.id = "cancel-btn";
        cancelBtn.textContent = "Cancel";
        cancelBtn.style.marginLeft = "10px";
        cancelBtn.onclick = () => location.reload();
        btnContainer.appendChild(cancelBtn);

        fields.forEach(id => {
          const displayDiv = document.getElementById(id);
          if (displayDiv) {
            const currentVal = displayDiv.textContent.trim();
            if (id === "gender") {
              // Create a dropdown for gender
              displayDiv.innerHTML = `
                <select id="input-gender">
                    <option class="option-select" value="Male" ${currentVal === 'Male' ? 'selected' : ''}>Male</option>
                    <option class="option-select" value="Female" ${currentVal === 'Female' ? 'selected' : ''}>Female</option>
                    <option class="option-select" value="Prefer not to say" ${currentVal === 'Prefer not to say' || currentVal === 'Not available' ? 'selected' : ''}>Rather not say</option>
                </select>`;
            } else if (id === "birthday") {
              // Use a proper date picker for birthday
              displayDiv.innerHTML = `<input type="date" id="input-birthday" value="${currentVal === 'Not set' ? '' : currentVal}">`;
            } else {
              // Standard text input for everything else
              displayDiv.innerHTML = `<input type="text" class="form-input" id="input-${id}" value="${currentVal === 'Not available' ? '' : currentVal}">`;
            }
        } 
    });
        if (passwordContainer) {
            passwordContainer.innerHTML = `<input type="password" class="form-input" id="input-password" placeholder="New password (optional)">`;
        }

    } else {
        // Grab the elements
        const getUserName = document.getElementById("input-username");
        const getName = document.getElementById("input-name");
        const getEmail = document.getElementById("input-email");
        const getGender = document.getElementById("input-gender");
        const getDob = document.getElementById("input-birthday");
        const getPass = document.getElementById("input-password");

        // Safety check: make sure elements exist
        if (!getUserName || !getName || !getEmail || !getGender || !getDob) {
            console.error("One or more input fields were not found in the DOM.");
            return;
        }

        // split the name
        const userName = getUserName.value.trim();
        const fullName = getName.value.trim();
        const email = getEmail.value.trim();
        const gender = getGender.value.trim();
        const dob = getDob.value.trim();
        const passwordInput = getPass ? getPass.value.trim() : "";

        // SPLIT NAME LOGIC
        const nameParts = fullName.split(" ");
        const firstName = nameParts[0]; // First word
        const lastName = nameParts.slice(1).join(" "); // Everything else

        // Validation
        if (!userName || !fullName || !email || !gender || !dob) {
            alert("All fields (except password) are required.");
            return;
        }

        // Build data object to send to backend
        const updatedData = {
            userName: userName,
            firstName: firstName,
            lastName: lastName || "", // Send empty string if no last name
            dob: dob,
            gender: gender,
            email: email
          };
        if (passwordInput !== "") {
            updatedData.password = passwordInput;
          }
        try {
            const response = await fetch(`${BACKEND_ROOT_URL}/edit/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                const currentUser = JSON.parse(localStorage.getItem("user"));
                localStorage.setItem("user", JSON.stringify({ 
                    ...currentUser, 
                    username: userName, 
                    fullname: fullName, 
                    email: email, 
                    gender: gender, 
                    birthday: dob 
                }));
                alert("Profile updated!");
                location.reload();
            } else {
                alert("Update failed.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
});