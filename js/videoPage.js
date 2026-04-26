async function loadVideo() {
    // Get videoId from URL
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('videoId');

    if (!videoId) {
        console.error('No video ID provided');
        document.querySelector('.video-title').textContent = 'No video selected';
        document.querySelector('.video-user').textContent = 'Please go back and select a video';
        return;
    }
    
    try {
        // Fetch video details from backend
        const response = await fetch(`${BACKEND_ROOT_URL}/api/videos/${videoId}`);
        const video = await response.json();

        if (video && video.video_file_path) {
            // Extract filename and folder from path
            const parts = video.video_file_path.replace(/\\/g, '/').split('/');
            //const parts = videoPath.split('/');
            const filename = parts[parts.length - 1];
            //const folder = parts[parts.length - 2];
            const fullPath = `${BACKEND_ROOT_URL}/videos/${filename}`;
            
            // Debug logs to verify paths and video data
            console.log('Video ID:', videoId);
           // console.log(folder, filename);
            console.log('Original path from DB:', video.video_file_path);
            console.log('Full src path:', fullPath);
            
            // Update video source specifically (not just any source tag)
            const sourceElement = document.querySelector('video source');
            const videoElement = document.querySelector('video');
            if (sourceElement && videoElement) {
                sourceElement.src = fullPath;
                videoElement.load();
                console.log('Video source updated to:', fullPath);
            } else {
                console.error('Source element not found in DOM');
            }
            
            // Update video title and metadata
            document.querySelector('.video-title').textContent = video.video_title;
            document.querySelector('.video-user').textContent = `${video.username}`;
            
            // Update description
            const descElement = document.querySelector('.p-3.rounded p');
            if (descElement) {
                descElement.textContent = video.description || 'No description available';
            }
        } else {
            console.error('Video not found');
            document.querySelector('.video-title').textContent = 'Video not found';

        }
    } catch (error) {
        console.error('Error loading video:', error);
        document.querySelector('.video-title').textContent = 'Error loading video';
    }
}

// Load video when page loads
document.addEventListener('DOMContentLoaded', loadVideo);
const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.get("videoId");
// Load comments when page loads
window.onload = () => {
    loadComments();
};

async function loadComments() {
    const res = await fetch(`${BACKEND_ROOT_URL}/api/comments/${videoId}`);
    const data = await res.json();

    const container = document.getElementById("commentsList");
    container.innerHTML = "";
    const username = localStorage.getItem("userName");

     data.forEach(c => {
        loadReactions(c.id, username);

        container.innerHTML += `
        
        <div class="d-flex justify-content-between align-items-start py-2" id="comment-${c.id}">

            <!-- LEFT: comment text -->
            <div>
                <b>${c.user_name}</b><br>
                <span id="text-${c.id}">${c.content}</span>

                <div class="d-flex align-items-center gap-3">
                    <i class="bi bi-hand-thumbs-up" id="likeBtn-${c.id}" onclick="react(${c.id}, 1)"></i>
                    <span id="like-count-${c.id}">0</span>
                    <i class="bi bi-hand-thumbs-down" id="dislikeBtn-${c.id}" onclick="react(${c.id}, 0)"></i>
                    <span id="dislike-count-${c.id}">0</span>
                </div>
                
            </div>

            <!-- RIGHT: three dots -->
            ${username == c.user_name ? `
            <div class="position-relative">
                <button class="btn btn-sm btn-dark border-0" onclick="openCommentMenu(this)">
                    <i class="bi bi-three-dots-vertical"></i>
                </button>

                <ul class="dropdown-menu dropdown-menu-end comment-dropdown">
                    <li><a class="dropdown-item" onclick="onEditClick(${c.id})">Edit</a></li>
                    <li><a class="dropdown-item" onclick="onDeleteClick(${c.id})">Delete</a></li>
                </ul>
            </div>
            ` : ''}
            </div>
        `;
    });
}


async function addComment() {
    const input = document.getElementById("commentInput");
    const username = localStorage.getItem("userName");

    if (!input.value) return;

   const poster = await fetch(`${BACKEND_ROOT_URL}/api/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            video_id: videoId,
            user_name: username, 
            content: input.value
        })
    });
    if (!poster.ok) {
        const errorData = await poster.json();
        alert(errorData.alert || "Please log in or sign up to add a comment");
        return;
    }
    input.value = "";
    loadComments(); // refreshing comments
}

async function onDeleteClick(comment_id) {
    try {
        closeMenus();
        const response = await fetch(`${BACKEND_ROOT_URL}/api/comments`,{
            method: "DELETE",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                commentId:comment_id
            })
        });

        alert("Comment deleted!");
        loadComments(); // refreshing comments

    } catch (error) {
        console.error("Error:", error);
    }
}


function onEditClick(id){
     closeMenus();

    const textSpan = document.getElementById(`text-${id}`);
    const oldText = textSpan.innerText;

    textSpan.innerHTML = `
        <input type="text"  
        class="bg-transparent text-light border-0 shadow-none px-0 d-inline"
        style="
            border-bottom: 2px solid #ccc !important;
            outline: none;
            width: auto;
        "
        id="edit-input-${id}" value="${oldText}" />
        <button class="btn btn-primary btn-sm rounded-pill" onclick="onSaveClick(${id})">Save</button>
    `;
}

async function onSaveClick(id){
    try {
        const newText = document.getElementById(`edit-input-${id}`).value;

        const response = await fetch(`${BACKEND_ROOT_URL}/api/comments`,{
            method: "PATCH",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                commentId:id,
                newContent:newText
            })
        });

        alert("Comment Edited!");
        loadComments(); // refreshing comments

    } catch (error) {
        console.error("Error:", error);
    }

}

function openCommentMenu(btn) {
    const menu = btn.nextElementSibling;
    menu.classList.toggle("show");
}

function closeMenus() {
    document.querySelectorAll(".comment-dropdown").forEach(m => {
        m.classList.remove("show");
    });
}
const likeBtn = document.getElementById("likeBtn");
const dislikeBtn = document.getElementById("dislikeBtn");

let liked = false;
let disliked = false;

likeBtn.addEventListener("click", () => {
    liked = !liked;
    disliked = false;

    if (liked) {
        likeBtn.classList.remove("bi-hand-thumbs-up");
        likeBtn.classList.add("bi-hand-thumbs-up-fill");
        likeBtn.style.color = "blue";

        dislikeBtn.classList.remove("bi-hand-thumbs-down-fill");
        dislikeBtn.classList.add("bi-hand-thumbs-down");
        dislikeBtn.style.color = "white";
    } else {
        likeBtn.classList.remove("bi-hand-thumbs-up-fill");
        likeBtn.classList.add("bi-hand-thumbs-up");
        likeBtn.style.color = "white";
    }
});

dislikeBtn.addEventListener("click", () => {
    disliked = !disliked;
    liked = false;

    if (disliked) {
        dislikeBtn.classList.remove("bi-hand-thumbs-down");
        dislikeBtn.classList.add("bi-hand-thumbs-down-fill");
        dislikeBtn.style.color = "red";

        likeBtn.classList.remove("bi-hand-thumbs-up-fill");
        likeBtn.classList.add("bi-hand-thumbs-up");
        likeBtn.style.color = "white";
    } else {
        dislikeBtn.classList.remove("bi-hand-thumbs-down-fill");
        dislikeBtn.classList.add("bi-hand-thumbs-down");
        dislikeBtn.style.color = "white";
    }
});

const emojiBtn = document.getElementById("emojiBtn");
const emojiPicker = document.getElementById("emojiPicker");
const selectedEmoji = document.getElementById("selectedEmoji");

emojiBtn.addEventListener("click", (e) => {
    e.stopPropagation(); 
    emojiPicker.style.display =
        emojiPicker.style.display === "block" ? "none" : "block";
});

document.querySelectorAll("#emojiPicker .emoji").forEach(e => {
    e.addEventListener("click", (event) => {
        event.stopPropagation(); 
        selectedEmoji.textContent = e.textContent;
        emojiPicker.style.display = "none";
    });
});
document.querySelectorAll("#emojiPicker .emoji").forEach(e => {
    e.addEventListener("click", () => {
        console.log("EMOJI CLICKED:", e.textContent);
    });
});

document.addEventListener("click", () => {
    emojiPicker.style.display = "none";
});

async function react(commentId, reaction) {
    const username = localStorage.getItem("userName");

    if(!username) {
        alert("Please log in or sign up to add reaction");
        return;
    }

    const poster = await fetch(`${BACKEND_ROOT_URL}/api/reactions`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
        },
            body: JSON.stringify({
            commentId: commentId,
            userName: username,
            reaction: reaction,
        }),
    });

    loadReactions(commentId, username);
}

async function loadReactions(commentId, username) {
    const res = await fetch(`${BACKEND_ROOT_URL}/api/reactions/${commentId}?userName=${username}`);
    const data = await res.json();

    document.getElementById(`like-count-${commentId}`).innerText =
        data.likes || 0;

    document.getElementById(`dislike-count-${commentId}`).innerText =
        data.dislikes || 0;

    setActiveReaction(commentId, data.userreaction);
}

function setActiveReaction(commentId, userReaction) {
  const commentLikeBtn = document.getElementById(`likeBtn-${commentId}`);
  const commentDislikeBtn = document.getElementById(`dislikeBtn-${commentId}`);

  commentLikeBtn.classList.remove("bi-hand-thumbs-up-fill");
  commentLikeBtn.classList.add("bi-hand-thumbs-up");
  commentLikeBtn.style.color = "";

  commentDislikeBtn.classList.remove("bi-hand-thumbs-down-fill");
  commentDislikeBtn.classList.add("bi-hand-thumbs-down");
  commentDislikeBtn.style.color = "";

  if (userReaction === 1) {
    commentLikeBtn.classList.remove("bi-hand-thumbs-up");
    commentLikeBtn.classList.add("bi-hand-thumbs-up-fill");
    commentLikeBtn.style.color = "white";

    commentDislikeBtn.classList.remove("bi-hand-thumbs-down-fill");
    commentDislikeBtn.classList.add("bi-hand-thumbs-down");
    return;
  }

  if (userReaction === 0) {
    commentDislikeBtn.classList.remove("bi-hand-thumbs-down");
    commentDislikeBtn.classList.add("bi-hand-thumbs-down-fill");
    commentDislikeBtn.style.color = "white";

    commentLikeBtn.classList.remove("bi-hand-thumbs-up-fill");
    commentLikeBtn.classList.add("bi-hand-thumbs-up");
    return;
  }

}