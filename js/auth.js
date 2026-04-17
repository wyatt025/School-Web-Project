function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

function loadUserInfo() {
    const user = getUser();
    
    const userInfo = document.getElementById("userInfo");

    if (userInfo) {
        console.log('inside infor')
        userInfo.textContent = user ? user.firstName +" "+ user.lastName : "John Doe";
    }
}

function getMenu() {
    return document.getElementById("profileMenu");
}

function openProfileMenu() {
    console.log('openprofile menuuu')
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