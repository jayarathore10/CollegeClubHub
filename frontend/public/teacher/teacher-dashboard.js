// Validate and load teacher info
document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));

  // Check if logged-in user is a teacher
  if (!user || user.role !== 'teacher') {
    alert('Access denied');
    window.location.href = 'login.html';
    return;
  }

  // Display teacher name
  document.getElementById('teacher-name').textContent = user.name;
});

// Logout functionality
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = '../../loginsignup/login.html';
});

// Redirect to attendance page
document.querySelector(".start-btn").addEventListener("click", () => {
  window.location.href = "take-attendence/take-attendance.html";
});

// Redirect to class details page (with class info)
// Redirect to class details page (with class info)
document.querySelector(".manage-btn").addEventListener("click", () => {
  const className = localStorage.getItem("className"); // get saved class from login

  if (!className) {
    alert("Class info not found for teacher");
    return;
  }

  // Save teacherClass (used by class-details page)
  localStorage.setItem("teacherClass", className);

  window.location.href = "class details/class-details.html";
});
document.querySelector(".view-reports").addEventListener("click", () => {
  window.location.href = "report/view-report.html";
});