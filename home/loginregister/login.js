// 🍔 Toggle navbar for mobile view
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// 🔐 Handle login form submission
document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("http://localhost:3001/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
  .then(async (res) => {
    console.log("Fetch response status:", res.status);

    // ⚠️ If response is not OK, try to parse error JSON
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: "Server error" }));
      throw new Error(errorData.message || "Login failed");
    }

    return res.json();
  })
  .then((data) => {
    console.log("Login response:", data);
      console.log("User object:", data.user);

    if (data.success) {
      alert("Login successful!");

      // ✅ Save current user's role and email
      alert("Login successful!");

  localStorage.setItem("role", data.user.role);
localStorage.setItem("email", data.user.email);
localStorage.setItem("currentUser", data.user.email);
  // Store if user is head (for easy checks later)
  if (data.user.role === "head") {
    localStorage.setItem("isHead", "true");
  } else {
    localStorage.setItem("isHead", "false");
  }


// ✅ Fix: Handle club for head users
if (data.user.role === "head") {
  if (data.user.club && data.user.club._id) {
    localStorage.setItem("club", data.user.club._id);
    console.log("Stored club ID from user.club:", data.user.club._id);
  } else if (data.user.clubs && data.user.clubs.length > 0) {
    localStorage.setItem("club", data.user.clubs[0]._id || data.user.clubs[0].id);
    console.log("Stored club ID from user.clubs[0]:", data.user.clubs[0]);
  } else {
    console.warn("No club info found for head.");
    localStorage.removeItem("club");
  }
}


 

      // 🧠 Update global users object
      const users = JSON.parse(localStorage.getItem("users")) || {};

      const formattedClubs = (data.user.clubs || []).map(club => {
        if (typeof club === "string") {
          return { id: club, name: "Unknown" };
        }
        return {
          id: club.id || club._id || club,
          name: club.name || "Unknown"
        };
      });

      users[data.user.email] = {
        name: data.user.name || "Student",
        email: data.user.email,
        role: data.user.role || "Student",
        clubs: formattedClubs,
      };

      localStorage.setItem("users", JSON.stringify(users));

      // 🚀 Redirect to home/dashboard
      window.location.href = "/home/index.html";
    } else {
      alert("Invalid email or password.");
    }
  })
  .catch((err) => {
    console.error("Login Error:", err);
    alert(err.message || "Login failed. Please try again later.");
  });
});
