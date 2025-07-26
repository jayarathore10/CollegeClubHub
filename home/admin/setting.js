const form = document.getElementById("settingsForm");
const message = document.getElementById("message");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // You can later send this data to a server using fetch()
  console.log("Updated Info:", { name, email, password });

  message.textContent = "Changes saved successfully!";
  message.style.color = "green";

  // Clear password field
  document.getElementById("password").value = "";
});
