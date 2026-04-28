const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const resultsList = document.getElementById("searchResults");

searchBtn.addEventListener("click", () => {
    const query = searchInput.value.toLowerCase();

    if (!query) {
        resultsList.style.display = "none";
        return;
    }
    
    fetchSearchResult(query);
});

searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

async function fetchSearchResult(query){
    try {
        const response = await fetch(`${BACKEND_ROOT_URL}/api/search/${encodeURIComponent(query)}`);
        const data = await response.json();

        showResults(data);
    } catch (error) {
        console.error("Error fetching search results:", error);
    }
}

function showResults(results) {
    resultsList.innerHTML = "";

    results.forEach(video => {
        const li = document.createElement("li");

        li.innerHTML = `
            <img src="${video.thumbnail_file_path}" width="40">
            <span>${video.video_title}</span>
        `;

        li.addEventListener("click", () => {
            window.location.href = `../html/videoPage.html?videoId=${video.id}`;
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