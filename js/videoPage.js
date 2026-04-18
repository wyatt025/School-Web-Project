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

    data.forEach(c => {
        container.innerHTML += `
            <p><b>${c.user_name}</b>: ${c.content}</p>
        `;
    });
}

async function addComment() {
    const input = document.getElementById("commentInput");

    if (!input.value) return;

    await fetch(`${BACKEND_ROOT_URL}/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            video_id: videoId,
            user_name: "User", 
            content: input.value
        })
    });

    input.value = "";
    loadComments(); // refreshing comments
}