const studentListContainer = document.getElementById("student-list");
const classNameHeader = document.getElementById("class-name");

// ✅ Extract string from URL
const urlParams = new URLSearchParams(window.location.search);
const className = urlParams.get("class"); // This should be like "1A"

classNameHeader.textContent = `Class: ${className}`;

async function loadStudents() {
  try {
    const response = await fetch(`http://localhost:5000/api/class/${className}/students`);
    
    if (!response.ok) throw new Error("Failed to fetch students");

    const students = await response.json();

    if (students.length === 0) {
      studentListContainer.innerHTML = "<p>No students found in this class.</p>";
      return;
    }

    students.forEach(student => {
      const card = document.createElement("div");
      card.classList.add("student-card");

      card.innerHTML = `
        <img src="http://localhost:5000/uploads/students/${student.photo || 'default.png'}" />
        <h3>${student.name}</h3>
        <p>Email: ${student.email}</p>
        <p>Phone: ${student.phone}</p>
      `;

      studentListContainer.appendChild(card);
    });
  } catch (err) {
    studentListContainer.innerHTML = `<p>Error loading students.</p>`;
    console.error(err);
  }
}

loadStudents();
