const classListContainer = document.getElementById("class-list");
const studentSection = document.getElementById("student-section");
const studentList = document.getElementById("student-list");
const classTitle = document.getElementById("class-title");

// Fetch all classes
async function loadClasses() {
  try {
    const res = await fetch("http://localhost:5000/api/classes");  // Fixed URL
    if (!res.ok) throw new Error("Failed to load classes");

    const classes = await res.json();

    classes.forEach(cls => {
      const card = document.createElement("div");
      card.className = "class-card";
      card.textContent = `${cls.className}`;
      card.addEventListener("click", () => loadStudents(cls.className));
      classListContainer.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading classes:", err);
    alert("Could not load class list.");
  }
}

// Load students by class
async function loadStudents(className) {
  try {
    studentSection.classList.remove("hidden");
    classTitle.textContent = `📚 Students in ${className}`;
    studentList.innerHTML = "";

    const res = await fetch(`http://localhost:5000/api/classes/${className}/students`);  // Fixed URL
    if (!res.ok) throw new Error("Failed to load students");

    const students = await res.json();

    if (students.length === 0) {
      studentList.innerHTML = "<p>No students found in this class.</p>";
      return;
    }

    students.forEach(student => {
      const card = document.createElement("div");
      card.className = "student-card";

      card.innerHTML = `
        <img src="http://localhost:5000/uploads/students/${student.photo}" alt="Student Photo" />
        <div class="student-info">
          <strong>${student.name}</strong><br>
          Email: ${student.email}<br>
          Phone: ${student.phone || 'N/A'}
        </div>
        <div class="actions">
          <button onclick="editStudent('${student._id}')">✏️ Edit</button>
          <button onclick="deleteStudent('${student._id}', '${className}')">🗑 Delete</button>
        </div>
      `;
      studentList.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading students:", err);
    studentList.innerHTML = "<p>Failed to load student data.</p>";
  }
}

function editStudent(studentId) {
  alert("Edit functionality coming soon for student ID: " + studentId);
}

async function deleteStudent(studentId, className) {
  if (confirm("Are you sure you want to delete this student?")) {
    const res = await fetch(`http://localhost:5000/api/students/${studentId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      loadStudents(className);
    } else {
      alert("Error deleting student.");
    }
  }
}

loadClasses();
