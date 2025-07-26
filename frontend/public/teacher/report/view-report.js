document.addEventListener("DOMContentLoaded", async () => {
  const className = localStorage.getItem("className");
  const classNameEl = document.getElementById("class-name");
  const tbody = document.getElementById("report-body");
  const backBtn = document.getElementById("backBtn");

  if (!className) {
    alert("No class assigned to this teacher.");
    window.location.href = "teacher-dashboard.html";
    return;
  }

  classNameEl.textContent = className;

  try {
    const res = await fetch(`http://localhost:5000/api/attendance/${className}`);
    const data = await res.json();

    if (!Array.isArray(data)) throw new Error("Invalid report format");

    data.forEach(entry => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${new Date(entry.date).toLocaleDateString()}</td>
        <td>${entry.studentName}</td>
        <td>${entry.status}</td>
      `;
      tbody.appendChild(row);
    });

  } catch (err) {
    console.error("Error loading reports:", err);
    tbody.innerHTML = `<tr><td colspan="3">Failed to load reports</td></tr>`;
  }

  backBtn.addEventListener("click", () => {
    window.location.href = "teacher-dashboard.html";
  });
});
