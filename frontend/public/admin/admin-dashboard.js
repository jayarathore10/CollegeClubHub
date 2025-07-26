// Show Admin name if logged in
// For admin-dashboard.html
const user = JSON.parse(localStorage.getItem('user'));
if (!user || user.role !== 'admin') {
  alert('Access denied');
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.name && user.role === 'admin') {
    document.getElementById('admin-name').textContent = user.name;
  } else {
    alert('Unauthorized access');
    window.location.href = 'login.html';
  }
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = '../../loginsignup/login.html';
});
