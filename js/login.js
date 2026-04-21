//const BACKEND_ROOT_URL = 'http://localhost:3001';
//const BACKEND_ROOT_URL = 'https://backend-school-web-project.onrender.com';
const BACKEND_ROOT_URL = process.env.BACKEND_URL;

document.getElementById("loginBtn").addEventListener("click", loginUser);

async function loginUser() {
    console.log("LOGIN BUTTON CLICKED");
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

            localStorage.clear();

            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("userId", data.user.id);
            localStorage.setItem("userName", data.user.username);


            window.location.href = "mainPage.html";
        } else {
            alert(data.message || "Login failed");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Server error");
    }
}