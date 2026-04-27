function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

function loadUserInfo() {
    const user = getUser();
    
    const userInfo = document.getElementById("userInfo");

    if (userInfo) {
        userInfo.textContent = user ? user.fullname : "John Doe";    }
}

function getMenu() {
    return document.getElementById("profileMenu");
}

function openProfileMenu(event) {
    if (event) event.stopPropagation(); 
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
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    getMenu().style.display = "none";
}

function openProfilePage() {
    if (!getUser()) {
        window.location.href = "../html/login.html";
    } else {
        window.location.href = "../html/profilePage.html";
    }
}   
window.onclick = function(event) {
    const menu = getMenu();
    const btn = document.getElementById("profileIcon");

    // If the menu is open AND the click wasn't on the button or inside the menu
    if (menu && menu.style.display === "block") {
        if (!btn.contains(event.target) && !menu.contains(event.target)) {
            menu.style.display = "none";
        }
    }
}