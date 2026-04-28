//const BACKEND_ROOT_URL = 'http://localhost:3001';
const BACKEND_ROOT_URL = 'https://backend-school-web-project.onrender.com';


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

// ===== FETCH VIDEOS FROM BACKEND =====
async function loadVideos() {
    try {
        const response = await fetch(`${BACKEND_ROOT_URL}/api/videos`);
        const videos = await response.json();
        populateVideoGrid(videos);
    } catch (error) {
        console.error('Error fetching videos:', error);
    }
}

function populateVideoGrid(videos) {
    if (!Array.isArray(videos) || videos.length === 0) {
        // No backend video data; keep the static cards already in HTML.
        return;
    }

    const cards = document.querySelectorAll('.video-link');

    cards.forEach((card, index) => {
        const fallbackId = index + 1;
        card.href = `../html/videoPage.html?videoId=${fallbackId}`;

        if (index >= videos.length) {
            // keep the rest of the static cards (with fallback click behavior)
            return;
        }

        const video = videos[index];
        const thumbnailPath = video.thumbnail_file_path;
        let thumbnailUrl = 'assets/video-placeholder.png'; // default
        if (thumbnailPath) {
            const parts = thumbnailPath.replace(/\\/g, '/').split('/');
            const filename = parts[parts.length - 1];
            const folder = parts[parts.length - 2];
            thumbnailUrl = `${BACKEND_ROOT_URL}/${folder}/${filename}`;
        }

        card.href = `../html/videoPage.html?videoId=${video.id}`;
        card.innerHTML = `
            <div class="outline">
                <div class="video-box">
                    <div class="fill">
                        <img class="video-box" src="${thumbnailUrl}" alt="${video.video_title}" >
                    </div>
                </div>
                <div class="title">
                    <i class="fa-solid fa-circle-user" style="margin-bottom: 40px; font-size: 3rem;"></i>
                    <p class="video-title">${video.video_title}<br>
                    <small class="video-creator" style="color: grey; font-size: 1rem;">${video.username}</small>
                    </p>
                </div>
            </div>
        `;
    });
}

// Load videos when page loads
document.addEventListener('DOMContentLoaded', loadVideos);


const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const resultsList = document.getElementById("searchResults");

// test data
const data = [
    "JavaScript tutorial",
    "HTML full course",
    "CSS flexbox",
    "React basics",
    "Node.js guide"
];

searchBtn.addEventListener("click", () => {
    const query = searchInput.value.toLowerCase();

    const filtered = data.filter(item =>
        item.toLowerCase().includes(query)
    );

    showResults(filtered);
});

function showResults(results) {
    resultsList.innerHTML = "";

    if (results.length === 0) {
        resultsList.style.display = "none";
        return;
    }

    results.forEach(item => {
        console.log('item',item)
        const li = document.createElement("li");
        li.textContent = item;

        li.addEventListener("click", () => {
            searchInput.value = item;
            resultsList.style.display = "none";
        });

        resultsList.appendChild(li);
    });

    resultsList.style.display = "block";
}

document.addEventListener("click", (e) => {
    if (!document.querySelector(".search-container").contains(e.target)) {
        resultsList.style.display = "none";
    }
});