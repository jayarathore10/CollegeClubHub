// Simulate logout
setTimeout(() => {
  // Clear login/session storage (optional)
  // Simulate logout
setTimeout(() => {
  // ✅ Step 1: Save important data before clearing
  const preservedData = {
    users: JSON.parse(localStorage.getItem("users")),
    clubs: JSON.parse(localStorage.getItem("clubs")),
    events: JSON.parse(localStorage.getItem("events"))
  };

  // ✅ Step 2: Clear all
  localStorage.clear();
  sessionStorage.clear();

  // ✅ Step 3: Restore data
  localStorage.setItem("users", JSON.stringify(preservedData.users || {}));
  localStorage.setItem("clubs", JSON.stringify(preservedData.clubs || []));
  localStorage.setItem("events", JSON.stringify(preservedData.events || []));

  // ✅ Step 4: Redirect to login
  window.location.href = "../loginregister/login.html";
}, 2000);


  // Redirect to login page
  window.location.href = "../loginregister/login.html";
}, 2000); // Wait 2 seconds for effect
