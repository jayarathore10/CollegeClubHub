document.addEventListener('DOMContentLoaded', () => {
  const teacherClass = localStorage.getItem("teacherClass");
  if (!teacherClass) {
    alert("Unauthorized access");
    window.location.href = "teacher-dashboard.html";
    return;
  }

  // Fill in class name immediately
  document.getElementById('class-name').textContent = teacherClass;

  fetch(`/api/students?class=${encodeURIComponent(teacherClass)}`)
    .then(res => res.json())
    .then(data => {
      // Display total count
      document.getElementById('student-count').textContent = data.length;

      // Render list
      const container = document.getElementById("student-list");
      container.innerHTML = "";
      data.forEach(student => {
        const li = document.createElement('li');
        li.textContent = `${student.name} (Roll: ${student.roll})`;
        container.appendChild(li);
      });
    })
    .catch(err => {
      console.error(err);
      alert("Error loading students");
    });
});
