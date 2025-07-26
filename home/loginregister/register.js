// 📌 Fetch all clubs from the server to populate the dropdown
window.addEventListener("DOMContentLoaded", async () => {
  const clubDropdown = document.getElementById("head-club-dropdown");

  try {
    const res = await fetch("http://localhost:3001/api/clubs");
    const clubs = await res.json();

    clubs.forEach((club) => {
      const option = document.createElement("option");
      option.value = club._id;
      option.textContent = club.name;
      clubDropdown.appendChild(option);
    });
  } catch (err) {
    console.error("Failed to load clubs:", err);
  }
});

// 📌 Show/Hide Head fields based on selected role
document.getElementById("role").addEventListener("change", (e) => {
  const role = e.target.value;
  const headSection = document.getElementById("head-club-section");

  if (role === "head") {
    headSection.style.display = "block";
  } else {
    headSection.style.display = "none";
  }
});

// 📌 Handle Registration Submission
document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  let userData = {
    name,
    email,
    password,
    role,
  };

  if (role === "head") {
  const clubId = document.getElementById("head-club-dropdown").value;
  const enteredHeadPassword = document.getElementById("head-club-password").value.trim();

  // ✅ Validate required fields
  if (!clubId || !enteredHeadPassword) {
    alert("Please select a club and enter the head password.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:3001/api/clubs/${clubId}`);
    const club = await res.json();

    // ✅ Validate head password
    if (!club?.head?.password || club.head.password !== enteredHeadPassword) {
      alert("Incorrect head password for this club.");
      return;
    }

    userData.club = clubId;
    userData.headPassword = enteredHeadPassword; // ✅ ADD THIS
  } catch (err) {
    console.error("Error verifying head password:", err);
    alert("Failed to verify head password.");
    return;
  }
}


  // 📤 Send user data to backend
  try {
    const res = await fetch("http://localhost:3001/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registration successful!");
      window.location.href = "login.html";
    } else {
      alert(data.message || "Registration failed.");
    }
  } catch (err) {
    console.error("Registration error:", err);
    alert("Something went wrong during registration.");
  }
});
