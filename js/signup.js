const BACKEND_ROOT_URL = 'https://backend-school-web-project.onrender.com';

function openLoginPage(){
    window.location.href='../html/login.html'
}

document.getElementById("signupForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const data = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        dob: document.getElementById("dob").value,
        gender: document.getElementById("gender").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    try {
        const response = await fetch(`${BACKEND_ROOT_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        alert(result.message);
        openLoginPage()

    } catch (error) {
        console.error("Error connecting to server", error);
    }
});