document.addEventListener("DOMContentLoaded", () => {
  const clubs = JSON.parse(localStorage.getItem("clubs")) || [];
  const tbody = document.querySelector("#clubsTable tbody");

  if (clubs.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="5">No clubs found.</td>`;
    tbody.appendChild(row);
    return;
  }

  clubs.forEach((club, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${club.name}</td>
      <td>${club.category || "N/A"}</td>
      <td>${club.description}</td>
      <td>
        <button onclick="editClub(${index})">Edit</button>
        <button onclick="deleteClub(${index})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
});

// Optional functions (future use)
function editClub(index) {
  alert("Edit functionality coming soon for club #" + (index + 1));
}

function deleteClub(index) {
  const clubs = JSON.parse(localStorage.getItem("clubs")) || [];
  if (confirm(`Are you sure you want to delete "${clubs[index].name}"?`)) {
    clubs.splice(index, 1);
    localStorage.setItem("clubs", JSON.stringify(clubs));
    location.reload(); // refresh to reflect changes
  }
}
