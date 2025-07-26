const addClassBtn = document.getElementById("addClassBtn");
const classModal = document.getElementById("classModal");
const cancelBtn = document.getElementById("cancelBtn");
const addClassForm = document.getElementById("addClassForm");
const classCards = document.getElementById("classCards");

addClassBtn.addEventListener("click", () => classModal.classList.remove("hidden"));
cancelBtn.addEventListener("click", () => classModal.classList.add("hidden"));

// ✅ Save new class
addClassForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const className = document.getElementById("className").value.trim();
  const classPassword = document.getElementById("classPassword").value.trim();
  const teacherEmail = document.getElementById("teacherEmail").value.trim();

  if (!className || !classPassword) {
    alert("Please enter class name and password.");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/classes/add-class", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ className, classPassword, teacherEmail }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Class added successfully!");
      classModal.classList.add("hidden");
      addClassForm.reset();
      loadClasses();
    } else {
      alert(data.error || "❌ Failed to add class.");
    }
  } catch (err) {
    console.error("Add class error:", err);
    alert("❌ Server error.");
  }
});

// ✅ Load all classes
async function loadClasses() {
  try {
    const res = await fetch("http://localhost:5000/api/classes");
    const classes = await res.json();

    classCards.innerHTML = "";

    classes.forEach(cls => {
      const div = document.createElement("div");
      div.className = "class-card";
      div.innerHTML = `
        <h3>Class ${cls.className}</h3>
        <p><strong>Password:</strong> ${cls.classPassword}</p>
        <button class="add-student-btn" data-id="${cls._id}" data-name="${cls.className}">👨‍🎓 Add Student</button>
        <button class="delete-btn" data-id="${cls._id}">🗑️ Delete</button>
      `;

      // Handle Delete
      div.querySelector(".delete-btn").addEventListener("click", async () => {
        if (confirm(`Are you sure you want to delete Class ${cls.className}?`)) {
          try {
            const res = await fetch(`http://localhost:5000/api/classes/${cls._id}`, {
              method: "DELETE",
            });
            if (res.ok) {
              alert("Class deleted");
              loadClasses();
            } else {
              alert("Error deleting class");
            }
          } catch (err) {
            console.error("Delete error:", err);
            alert("Server error");
          }
        }
      });

      // Handle Add Student button
      div.querySelector(".add-student-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        document.getElementById("studentClassName").value = cls.className;
        studentModal.classList.remove("hidden");
      });

      // Click card to view students
      div.onclick = () => {
        window.location.href = `../students/student-list/student-list.html?class=${encodeURIComponent(cls.className)}`;
      };

      classCards.appendChild(div);
    });

  } catch (err) {
    console.error("Error loading classes:", err);
    classCards.innerHTML = "<p>Error loading classes.</p>";
  }
}

loadClasses();

// Student modal handlers
const studentModal = document.getElementById("studentModal");
const cancelStudentBtn = document.getElementById("cancelStudentBtn");
const addStudentForm = document.getElementById("addStudentForm");

cancelStudentBtn.addEventListener("click", () => studentModal.classList.add("hidden"));

// Handle Add Student form (FIXED with rollNumber)
addStudentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("studentName").value.trim();
  const photo = document.getElementById("studentPhoto").files[0];
  const className = document.getElementById("studentClassName").value;
  const email = document.getElementById("studentEmail").value.trim();
  const rollNumber = document.querySelector('[name="rollNumber"]').value.trim(); // ✅ Added

  if (!name || !photo || !className || !rollNumber) {
    alert("Please fill all fields including Roll Number.");
    return;
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("photo", photo);
  formData.append("className", className);
  formData.append("email", email);
  formData.append("rollNumber", rollNumber); // ✅ Now included

  try {
    const res = await fetch("http://localhost:5000/api/students/add", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (res.ok) {
      alert("✅ Student added successfully!");
      addStudentForm.reset();
      studentModal.classList.add("hidden");
    } else {
      alert(result.error || "❌ Failed to add student.");
    }
  } catch (err) {
    console.error("Add student error:", err);
    alert("❌ Server error.");
  }
});
