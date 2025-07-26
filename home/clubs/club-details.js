// ✅ club-details.js (final)

// Move clubId to global scope
const urlParams = new URLSearchParams(window.location.search);
const clubId = urlParams.get("id");

// 📸 Render gallery with delete option for head/admin
function renderGallery(images = []) {
  console.log("Rendering gallery with", images.length, "images");
  const container = document.getElementById("previous-event-gallery");
  container.innerHTML = "";

  const email = localStorage.getItem("email");
  const userData = JSON.parse(localStorage.getItem("users")) || {};
  const currentUser = userData[email] || {};
  const currentRole = currentUser.role;

  if (!images.length) {
    container.innerHTML = "<p>No gallery images uploaded yet.</p>";
    return;
  }

  images.forEach(({ imageUrl, caption }) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("gallery-item");

    const img = document.createElement("img");
    img.src = `http://localhost:3001/uploads/gallery/${imageUrl}`;
    img.alt = caption || "Gallery Image";
    img.classList.add("gallery-thumb");
    img.addEventListener("click", () => openImageModal(img.src));
    wrapper.appendChild(img);

    // Delete button for Admin & Head
    if (currentRole === "admin" || currentRole === "head") {
      const delBtn = document.createElement("button");
      delBtn.textContent = "×"; // Cross icon
      delBtn.classList.add("delete-btn");

      delBtn.addEventListener("click", async (e) => {
        e.stopPropagation(); // prevent modal from opening
        if (!confirm("Are you sure you want to delete this image?")) return;

        try {
          const res = await fetch(`http://localhost:3001/api/clubs/${clubId}/gallery`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageUrl }),
          });
          const data = await res.json();
          if (res.ok) {
            alert("Image deleted");
            renderGallery(data.previousEventGallery);
          } else {
            alert(data.error || "Failed to delete image");
          }
        } catch (err) {
          console.error(err);
          alert("Error deleting image");
        }
      });

      wrapper.appendChild(delBtn);
    }

    container.appendChild(wrapper);
  });
}



// Modal logic
function openImageModal(src) {
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  modalImage.src = src;
  modal.style.display = "block";
}

function closeImageModal() {
  document.getElementById("imageModal").style.display = "none";
}

// Close modal on outside click or ESC
window.addEventListener("click", (e) => {
  if (e.target.id === "imageModal") closeImageModal();
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeImageModal();
});

// Upload modal and form
const galleryModal = document.getElementById("gallery-modal");
const openModalBtn = document.getElementById("open-gallery-modal");
const closeModalBtn = document.getElementById("close-gallery-modal");
const galleryForm = document.getElementById("gallery-form");

openModalBtn.addEventListener("click", () => {
  galleryModal.style.display = "block";
});

closeModalBtn.addEventListener("click", () => {
  galleryModal.style.display = "none";
});

galleryForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("galleryImage");
  const caption = document.getElementById("galleryCaption").value;
  const date = document.getElementById("galleryDate").value;

  const file = fileInput.files[0];
  if (!file) return alert("Please select an image.");

  const formData = new FormData();
  formData.append("image", file);
  formData.append("caption", caption);
  formData.append("date", date);
  formData.append("clubId", clubId);

  try {
    const res = await fetch("http://localhost:3001/api/clubs/gallery", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (res.ok && data.newImage) {
      alert("Image uploaded");
      galleryModal.style.display = "none";
      galleryForm.reset();
      renderGallery(data.previousEventGallery); // re-render updated gallery
    } else {
      alert(data.error || "Upload failed");
    }
  } catch (err) {
    console.error("Upload failed:", err);
    alert("Error uploading image");
  }
});

// DOMContentLoaded for club details, events, about section
document.addEventListener("DOMContentLoaded", () => {
  const email = localStorage.getItem("email");
  const userData = JSON.parse(localStorage.getItem("users")) || {};
  const currentUser = userData[email] || {};
  const currentRole = currentUser.role;

  if (!clubId) {
    alert("Club ID not found in URL");
    return;
  }

  fetch(`http://localhost:3001/api/clubs/${clubId}`)
    .then((res) => res.json())
    .then((club) => {
      document.getElementById("club-name").textContent = club.name;
      document.getElementById("club-tagline").textContent = club.description;
      document.getElementById("club-about").textContent = club.about || "No description available.";
      if (club.image) document.getElementById("club-image").src = club.image;

      if (club.head?.name) {
  document.getElementById("head-name").textContent = club.head.name;
  document.getElementById("head-img").src = club.head.image || "default-head.png";

  const isHead = localStorage.getItem("isHead") === "true";
  const isAdmin = currentRole === "admin";

  // Show "Add Previous Event" button for Head (this club) or Admin
  if (email === club.head.email || isHead || isAdmin) {
    document.getElementById("edit-about-btn").style.display = "inline-block";
    document.getElementById("upload-gallery-section").style.display = "block";  // FIX
    document.getElementById("open-gallery-modal").style.display = "inline-block";
  } else {
    document.getElementById("edit-about-btn").style.display = "none";
    document.getElementById("upload-gallery-section").style.display = "none";
    document.getElementById("open-gallery-modal").style.display = "none";
  }
}


      renderGallery(club.previousEventGallery || []);
    })
    .catch((err) => console.error("Failed to fetch club details:", err));

  // Events fetch
  fetch(`http://localhost:3001/api/events/${clubId}`)
    .then((res) => res.json())
    .then((data) => {
      const upcomingList = document.getElementById("upcoming-events");
      const previousList = document.getElementById("previous-events");
      upcomingList.innerHTML = "";
      previousList.innerHTML = "";

      const now = new Date();

      if (data.success && data.events.length > 0) {
        data.events.forEach((event) => {
          const li = document.createElement("li");
          li.innerHTML = `<strong>${event.title}</strong><br>📅 ${new Date(event.date).toLocaleDateString()} - ${event.description}`;
          if (new Date(event.date) > now) upcomingList.appendChild(li);
          else previousList.appendChild(li);
        });
      } else {
        upcomingList.innerHTML = "<li>No upcoming events.</li>";
        previousList.innerHTML = "<li>No previous events.</li>";
      }
    });

  // Join club
  document.getElementById("join-btn").addEventListener("click", () => {
    if (!email) return alert("Please login to join the club.");

    fetch("http://localhost:3001/api/join-club", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, club: clubId }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || "Joined club!");
        const users = JSON.parse(localStorage.getItem("users")) || {};
        if (!users[email]) users[email] = { clubs: [] };
        if (!users[email].clubs?.some((c) => c.id === clubId)) {
          users[email].clubs.push({ id: clubId, name: document.getElementById("club-name").textContent });
          localStorage.setItem("users", JSON.stringify(users));
        }
      });
  });

  // Edit About section
  const aboutPara = document.getElementById("club-about");
  const aboutEditor = document.getElementById("about-editor");
  const editBtn = document.getElementById("edit-about-btn");
  const saveBtn = document.getElementById("save-about-btn");

  editBtn.addEventListener("click", () => {
    aboutEditor.value = aboutPara.textContent.trim();
    aboutPara.style.display = "none";
    aboutEditor.style.display = "block";
    editBtn.style.display = "none";
    saveBtn.style.display = "inline-block";
  });

  saveBtn.addEventListener("click", () => {
    const updatedAbout = aboutEditor.value.trim();
    if (!updatedAbout) return alert("About section cannot be empty");

    fetch(`http://localhost:3001/api/clubs/${clubId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ about: updatedAbout, role: "head" }),
    })
      .then((res) => res.json())
      .then(() => {
        aboutPara.textContent = updatedAbout;
        aboutPara.style.display = "block";
        aboutEditor.style.display = "none";
        editBtn.style.display = "inline-block";
        saveBtn.style.display = "none";
        alert("About section updated!");
      });
  });
});
