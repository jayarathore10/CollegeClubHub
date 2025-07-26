document.getElementById('signup-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  if (!name || !email || !password || !role) {
    alert("Please fill all fields.");
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });

    const data = await res.json();

    if (res.ok) {
      alert('Signup successful! You can now log in.');
      window.location.href = 'login.html';
    } else {
      alert(data.message || 'Signup failed.');
    }

  } catch (error) {
    console.error(error);
    alert('Error during signup. Please try again.');
  }
});
