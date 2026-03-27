function toggleMenu() {
    document.getElementById("dropdown-menu").classList.toggle("show");
}

function openLoginPage() {
    window.location.href='../html/login.html'
}

// Close the menu if the user clicks anywhere else on the screen
window.onclick = function(event) {
  if (!event.target.closest('.create-container')) {
    var dropdowns = document.getElementsByClassName("create-dropdown");
    for (var i = 0; i < dropdowns.length; i++) {
      dropdowns[i].classList.remove('show');
    }
  }
}
// 1. Get the parts from the HTML
var chipsBox = document.getElementById("chipsWrapper");
var leftBtn = document.getElementById("leftBtnContainer");
var rightBtn = document.getElementById("rightBtnContainer");

// 2. Function to move Right
function scrollRightBtn() {
    chipsBox.scrollLeft = chipsBox.scrollLeft + 200;
}

// 3. Function to move Left
function scrollLeftBtn() {
    chipsBox.scrollLeft = chipsBox.scrollLeft - 200;
}

// 4. Watch the scroll to show/hide arrows
chipsBox.onscroll = function() {
    // If we have moved to the right, show the Back arrow
    if (chipsBox.scrollLeft > 20) {
        leftBtn.style.display = "flex";
    } else {
        leftBtn.style.display = "none";
    }

    // Check if we reached the very end to hide the Next arrow
    var maxScroll = chipsBox.scrollWidth - chipsBox.clientWidth;
    if (chipsBox.scrollLeft >= maxScroll - 20) {
        rightBtn.style.display = "none";
    } else {
        rightBtn.style.display = "flex";
    }
};