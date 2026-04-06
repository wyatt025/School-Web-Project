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
        const response = await fetch(`${BACKEND_ROOT_URL}/videos/${videoId}`);
        const video = await response.json();
        
        if (video) {
            // Convert Windows paths to web paths
            const videoPath = video.video_file_path.replace(/\\/g, '/').replace(/^(\.\.\/)+/, '');
            const fullPath = `../${videoPath}`;
            
            // Debug logs to verify paths and video data
            console.log('Video ID:', videoId);
            console.log('Original path from DB:', video.video_file_path);
            console.log('Converted path:', videoPath);
            console.log('Full src path:', fullPath);
            
            // Update video source specifically (not just any source tag)
            const sourceElement = document.querySelector('video source');
            if (sourceElement) {
                sourceElement.src = fullPath;
                document.querySelector('video').load();
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

// Check if user is logged in
const profileUser = JSON.parse(localStorage.getItem("user"));

const profileUserIcon = document.getElementById("profileIcon");

if (profileUserIcon) {
    profileUserIcon.addEventListener("click", () => {
        window.location.href = '../html/profilePage.html';
    });
} else {
    profileUserIcon.addEventListener("click", () => {
        window.location.href = '../html/login.html';
    });
}