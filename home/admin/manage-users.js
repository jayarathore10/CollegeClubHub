// user.js
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      sessionStorage.clear();
      alert("Logged out!");
      window.location.href = "../login.html";
    });
  }

  // Optional: you can load the user’s name dynamically if stored in localStorage
  // const user = JSON.parse(localStorage.getItem("user"));
  // if (user && user.name) {
  //   document.querySelector("h1").textContent = `Welcome, ${user.name}!`;
  // }
});
