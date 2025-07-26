document.addEventListener("DOMContentLoaded", () => {
  const options = {
    threshold: 0.3
  };
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-up");
        entry.target.classList.add("animate-right");
        entry.target.classList.add("animate-left");
      }
    });
  }, options);

  document.querySelectorAll(".text-block, .img-block").forEach(el => {
    reveal.observe(el);
  });
  
  // 🟡 Role-based dynamic profile link
  const role = localStorage.getItem("role");
  const profileLink = document.getElementById("profile-link");

  if (profileLink) {
    switch (role) {
      case "admin":
        profileLink.href = "loginregister/useradminhead/admin.html";
        profileLink.textContent = "Admin Profile";
        profileLink.style.display = "inline-block";
        break;
      case "head":
        profileLink.href = "loginregister/useradminhead/head.html";
        profileLink.textContent = "Head Profile";
        profileLink.style.display = "inline-block";
        break;
      case "user":
        profileLink.href = "loginregister/useradminhead/user.html";
        profileLink.textContent = "User Profile";
        profileLink.style.display = "inline-block";
        break;
      default:
        profileLink.style.display = "none";
    }
  }
});
