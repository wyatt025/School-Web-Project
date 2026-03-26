function toggleMenu() {
    document.getElementById("dropdown-menu").classList.toggle("show");
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
