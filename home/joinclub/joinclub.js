document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const clubName = urlParams.get("club")?.trim() || "Unknown Club";
  console.log("Club Name:", clubName);

  const form = document.getElementById("joinForm");

  // ✅ Club name to ID mapping (replace with real MongoDB IDs)
  const clubDataMap = {
    "Cultural Club": { id: "6877605bd3fa6fc2ff2e8006", path: "cultural-club" },
    "Sports Club": { id: "6877605bd3fa6fc2ff2e8008", path: "sports-club" },
    "Technical Club": { id: "64fa88ijkl9012", path: "technical-club" },
    "Advanced Studies Club": { id: "64fa77mnop3456", path: "advanced-studies-club" }
    // ✨ Add other clubs here
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const currentUserEmail = localStorage.getItem("currentUser");
    const role = localStorage.getItem("role") || "Student";
    const users = JSON.parse(localStorage.getItem("users")) || {};

    if (!currentUserEmail) {
      alert("User not logged in!");
      return;
    }

    if (!clubDataMap[clubName]) {
      alert("❌ Club not recognized!");
      return;
    }

    const clubObj = {
      id: clubDataMap[clubName].id,
      name: clubName
    };

    // ✅ Ensure user object exists
    if (!users[currentUserEmail]) {
      users[currentUserEmail] = {
        name: "Student",
        email: currentUserEmail,
        role: role,
        clubs: []
      };
    }

    // ✅ Prevent duplicate
    const alreadyJoined = users[currentUserEmail].clubs.some(
      (c) => c.id === clubObj.id
    );

    if (!alreadyJoined) {
      users[currentUserEmail].clubs.push(clubObj);
    }

    // ✅ Save to localStorage
    localStorage.setItem("users", JSON.stringify(users));

    // ✅ Sync with backend
    try {
      await fetch("http://localhost:3001/api/join-club", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentUserEmail, club: clubObj.id })

      });
    } catch (err) {
      console.error("Server error:", err);
    }

    // ✅ Show celebration
    showCelebrationPopup(clubName);
    form.reset();

    // ✅ Redirect to club page
    const folderName = clubDataMap[clubName].path;
    setTimeout(() => {
      window.location.href = `/home/clubs/${folderName}/${folderName}.html`;
    }, 2500);
  });

  function showCelebrationPopup(clubName) {
    document.getElementById("popupClubName").textContent = clubName;
    const popup = document.getElementById("celebrationPopup");
    popup.classList.remove("hidden");

    setTimeout(() => {
      popup.classList.add("hidden");
    }, 2000);
  }
});
