document.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.getElementById("teacher-tbody");

  try {
    const res = await fetch("http://localhost:5000/api/teachers");
    const teachers = await res.json();

    teachers.forEach(teacher => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        
        <td>${teacher.name}</td>
        <td>${teacher.className}</td>
        <td>${teacher.email}</td>
        <td>${teacher.lastLogin || "Never"}</td>
      `;

      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Failed to fetch teachers:", err);
  }
});
