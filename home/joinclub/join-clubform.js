document.addEventListener("DOMContentLoaded", function () {
  const userEmail = localStorage.getItem("email");
  const modal = document.getElementById("joinFormModal");
  const openBtn = document.getElementById("openFormBtn");
  const closeBtn = document.getElementById("closeModalBtn");
  const form = document.getElementById("joinForm");
  const mainContent = document.querySelector(".main-content");

  // Show modal
  openBtn.addEventListener("click", () => {
    if (!userEmail) {
      alert("Please login to join the club.");
      return;
    }
    modal.classList.remove("hidden");
    mainContent.classList.add("hidden");
  });

  // Hide modal
  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    mainContent.classList.remove("hidden");
  });

  // Close when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
      mainContent.classList.remove("hidden");
    }
  });

  // Submit form
  form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const userData = {};
  formData.forEach((value, key) => (userData[key] = value));

  const clubId = "YOUR_CLUB_ID_HERE"; // 🛑 Replace this with actual club ID (e.g., from DB or page context)
  const clubName = "Cultural Club";   // ✅ Human-readable name

  try {
    const res = await fetch("http://localhost:3001/api/join-club", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...userData,
        email: userEmail,
        club: clubId, // ✅ Send club ID to backend
      }),
    });

    const result = await res.json();

    if (res.ok) {
      alert(result.message || "Joined successfully!");

      // ✅ Update localStorage for persistence
      const email = userEmail;

      const users = JSON.parse(localStorage.getItem("users")) || {};

      if (email) {
        if (!users[email]) {
          users[email] = { clubs: [] };
        }

        const joinedClub = { id: clubId, name: clubName };

        const alreadyJoined = users[email].clubs.some(
          (c) => c.id === clubId
        );

        if (!alreadyJoined) {
          users[email].clubs.push(joinedClub);
          localStorage.setItem("users", JSON.stringify(users));
        }
      }

      modal.classList.add("hidden");
      form.reset();
      mainContent.classList.remove("hidden");

      setTimeout(() => {
        window.location.href = `/home/clubs/${clubName.toLowerCase().replace(/\s+/g, '-')}/${clubName.toLowerCase().replace(/\s+/g, '-')}.html`;
      }, 500);
    } else {
      alert(result.message || "Failed to join club.");
    }

  } catch (err) {
    console.error(err);
    alert("Server error. Please try again later.");
  }
});

});
