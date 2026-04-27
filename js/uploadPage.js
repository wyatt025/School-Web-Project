const BACKEND_ROOT_URL = 'https://backend-school-web-project.onrender.com';

const user = JSON.parse(localStorage.getItem("user"));
const userId = localStorage.getItem("userId");
if (!user || !userId) {
  alert("User not logged in properly");
  window.location.href = "login.html";
}

const upload_btn = document.getElementById("upload-btn");

upload_btn.hidden= true; // Hide the button until we verify all fields are filled

const form =document.getElementById("upload-form");
const requiredFields = ["video-title-input", "video-description-input", "video-file-input", "thumbnail-input"];

form.addEventListener("input", () => {
  const allFilled = requiredFields.every(field => {
        const element = document.getElementById(field);// Safety check: ensure the element exists
        if (!element) return false; // Safety check: if element is missing, field is not filled

        if (element.type === "file") {
            return element.files && element.files.length > 0;
        } else {
            // Trim and check if the value is not empty
            return element.value.trim() !== "";
        }
    });
    upload_btn.hidden = !allFilled;
});

upload_btn.addEventListener("click", function(event) {
  event.preventDefault();
  const form =document.getElementById("upload-form");
  const formData = new FormData(form);
  formData.append("userId", userId);
  fetch(`${BACKEND_ROOT_URL}/api/upload`, {
    method: "POST",
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log("Upload successful:", data);
    alert("Video uploaded successfully!");
    window.location.href = "dashboard.html";
  })
  .catch(error => {
    console.error("Upload failed:", error);
    alert("Failed to upload video.");
  });
});