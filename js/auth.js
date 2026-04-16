function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

function loadUserInfo() {
    const user = getUser();
    const userEmail = document.getElementById("userEmail");

    if (userEmail) {
        userEmail.textContent = user && user.email ? user.email : "Guest";
    }
}

function getMenu() {
    return document.getElementById("profileMenu");
}

function openProfileMenu() {
    const menu = getMenu();

    if (!getUser()) {
        window.location.href = "../html/login.html";
        return;
    }

    if (menu) {
        menu.style.display =
            menu.style.display === "block" ? "none" : "block";
    }
}

function signout() {
    localStorage.removeItem("user");
    getMenu().style.display = "none";
}

function openProfilePage() {
    if (!getUser()) {
        window.location.href = "../html/login.html";
    } else {
        window.location.href = "../html/profilePage.html";
    }
}