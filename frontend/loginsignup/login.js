document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const roleSelect = document.getElementById("role");
  const classSelect = document.getElementById("class-select");
  const classPasswordInput = document.getElementById("class-password");

  // Load classes when teacher role is selected
  roleSelect.addEventListener("change", async function () {
    if (roleSelect.value === "teacher") {
      classSelect.style.display = "block";

      try {
        const res = await fetch("http://localhost:5000/api/classes");
        const classes = await res.json();

        classSelect.innerHTML = '<option value="">Select Class</option>';
        classes.forEach(cls => {
          const option = document.createElement("option");
          option.value = cls.className;
          option.textContent = cls.className;
          classSelect.appendChild(option);
        });
      } catch (err) {
        console.error("Failed to load classes", err);
      }
    } else {
      classSelect.style.display = "none";
      classPasswordInput.style.display = "none";
      classSelect.innerHTML = "";
    }
  });

  // Show class password field after selecting class
  classSelect.addEventListener("change", function () {
    classPasswordInput.style.display = classSelect.value ? "block" : "none";
  });

  // Login form submission
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = roleSelect.value;
    const selectedClass = classSelect.value;
    const classPassword = classPasswordInput.value.trim();

    if (!email || !password || !role) {
      alert("Please fill all required fields");
      return;
    }

    // Validate class password if teacher
    if (role === "teacher") {
      if (!selectedClass || !classPassword) {
        alert("Please select a class and enter its password");
        return;
      }

      try {
        const validateRes = await fetch('http://localhost:5000/api/classes/validate-password', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ className: selectedClass, classPassword })
        });

        const validateData = await validateRes.json();

        if (!validateRes.ok) {
          alert(validateData.error || "Invalid class password");
          return;
        }
      } catch (err) {
        console.error("Class password validation failed", err);
        alert("Something went wrong");
        return;
      }
    }

    // Main login
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Login successful!");

        // Save teacher's class if applicable
        if (role === "teacher") {
          localStorage.setItem("className", selectedClass);
        }

        // Save user details
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect based on role
        if (data.user.role === "teacher") {
          window.location.href = '../public/teacher/teacher-dashboard.html';
        } else if (data.user.role === "admin") {
          window.location.href = '../public/admin/admin-dashboard.html';
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error", err);
      alert("Something went wrong");
    }
  });
});
