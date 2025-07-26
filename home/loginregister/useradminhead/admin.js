const BASE_URL = "http://localhost:3001/api";

window.onload = async function () {
  try {
    const [userRes, clubRes, eventRes] = await Promise.all([
      fetch(`${BASE_URL}/users`),
      fetch(`${BASE_URL}/clubs`),
      fetch(`${BASE_URL}/events`)
    ]);

    const users = await userRes.json();
    const clubs = await clubRes.json();
    const events = await eventRes.json();

    document.getElementById("userCount").textContent = users.length;
    document.getElementById("clubCount").textContent = clubs.length;
    document.getElementById("eventCount").textContent = events.length;
  } catch (err) {
    console.error("Error fetching counts:", err);
  }
};

function logout() {
  localStorage.clear();
  window.location.href = "/home/loginregister/login.html";
}

function showDashboard() {
  document.getElementById("listContainer").innerHTML = "";
}

async function loadData(type) {
  try {
    const res = await fetch(`${BASE_URL}/${type}`);
    const data = await res.json();

    let html = `<h2>${capitalize(type)} List</h2><table><tr>`;

    if (type === "users") {
      html += "<th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>";
      data.forEach(user => {
        html += `<tr>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td><button>Edit</button><button>Delete</button></td>
        </tr>`;
      });
    } else if (type === "clubs") {
      html += "<th>Name</th><th>Description</th><th>Actions</th></tr>";
      data.forEach(club => {
        html += `<tr>
          <td>${club.name}</td>
          <td>${club.description || "-"}</td>
          <td>
            <button onclick="editClub('${club._id}', '${club.name}', \`${club.description || ""}\`)">Edit</button>
            <button onclick="deleteClub('${club._id}')">Delete</button>
          </td>
        </tr>`;
      });
    } else if (type === "events") {
      html += "<th>Title</th><th>Club</th><th>Date</th><th>Actions</th></tr>";
      data.forEach(event => {
        html += `<tr>
          <td>${event.title}</td>
          <td>${event.club?.name || "Unknown"}</td>
          <td>${new Date(event.date).toLocaleDateString()}</td>
          <td><button>Edit</button><button>Delete</button></td>
        </tr>`;
      });
    }

    html += "</table>";
    document.getElementById("listContainer").innerHTML = html;

  } catch (err) {
    console.error("Error loading list:", err);
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function openAddClubModal() {
  document.getElementById("clubModal").style.display = "block";
}

function closeAddClubModal() {
  document.getElementById("clubModal").style.display = "none";
}

document.getElementById("clubForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("clubName").value.trim();
  const description = document.getElementById("clubDescription").value.trim();
  const image = document.getElementById("clubImage").value.trim();
  const headName = document.getElementById("headName").value.trim();
  const headImage = document.getElementById("headImage").value.trim();
  const headPassword = document.getElementById("headPassword").value;

  try {
    const response = await fetch(`${BASE_URL}/clubs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
  name,
  description,
  image,
  head: {
    name: headName,
    image: headImage,
    password: headPassword
  }
})

    });

    const data = await response.json();
    if (response.ok) {
      alert("Club added!");
      document.getElementById("clubForm").reset();
      closeAddClubModal();
      loadData("clubs");
    } else {
      alert(data.message || "Failed to add club.");
    }
  } catch (error) {
    console.error("Error adding club:", error);
    alert("An error occurred.");
  }
});

function editClub(id, name, description) {
  // Show the existing edit form and fill it with current values
  document.getElementById("edit-club-section").style.display = "block";
  document.getElementById("edit-club-name").value = name;
  document.getElementById("edit-club-description").value = description;

  // We'll fetch full head data from backend here
  fetch(`${BASE_URL}/clubs/${id}`)
    .then(res => res.json())
    .then(club => {
      document.getElementById("edit-head-name").value = club.head?.name || "";
      document.getElementById("edit-head-image").value = club.head?.image || "";
      // Do not prefill password for security
      editingClubId = id;
    })
    .catch(err => {
      console.error("Error fetching club:", err);
      alert("Failed to fetch full club data");
    });
}


function deleteClub(id) {
  if (confirm("Are you sure you want to delete this club?")) {
    fetch(`${BASE_URL}/clubs/${id}`, {
      method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
      alert("Club deleted!");
      loadData("clubs");
    })
    .catch(err => {
      console.error("Error deleting club:", err);
      alert("Error deleting club.");
    });
  }
}
let editingClubId = null;

function openEditClubForm(club) {
  document.getElementById('edit-club-section').style.display = "block";
  document.getElementById('edit-club-name').value = club.name;
  document.getElementById('edit-club-description').value = club.description;
  document.getElementById('edit-head-name').value = club.headName;
  document.getElementById('edit-head-image').value = club.headImage;
  editingClubId = club._id;
}

async function submitClubEdit() {
  const name = document.getElementById('edit-club-name').value;
  const description = document.getElementById('edit-club-description').value;
  const headName = document.getElementById('edit-head-name').value;
  const headImage = document.getElementById('edit-head-image').value;
  const headPassword = document.getElementById('edit-head-password').value;

  try {
    const res = await fetch(`${BASE_URL}/clubs/${editingClubId}`, {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        headName,
        headImage,
        headPassword
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Club updated successfully");
      document.getElementById("edit-club-section").style.display = "none";
      loadData("clubs");
    } else {
      alert(data.message || "Failed to update club");
    }
  } catch (err) {
    console.error("Error submitting edit:", err);
    alert("Something went wrong");
  }
}

if (user?.role === "admin") {
  // show edit/delete buttons
} else {
  // hide them
}
