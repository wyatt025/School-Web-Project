//const BACKEND_ROOT_URL = 'https://localhost:3001';
const BACKEND_ROOT_URL = 'https://backend-school-web-project.onrender.com';

document.getElementById("loginBtn").addEventListener("click", loginUser);

async function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please fill in all fields");
        return;
    }

    try {
        const response = await fetch(`${BACKEND_ROOT_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login successful!");

            //Save user in localStorage for session
            localStorage.setItem("user", JSON.stringify(data.user));

            window.location.href = "mainPage.html";
        } else {
            alert(data.message || "Login failed");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Server error");
    }
}