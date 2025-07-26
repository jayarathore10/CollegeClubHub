const tableBody = document.querySelector("#eventsTable tbody");
const events = JSON.parse(localStorage.getItem("events")) || [];

function renderEvents() {
  tableBody.innerHTML = "";
  events.forEach((event, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${event.name}</td>
      <td>${event.date}</td>
      <td>${event.venue}</td>
      <td>${event.club || 'N/A'}</td>
      <td>
        <button onclick="editEvent(${index})">Edit</button>
        <button class="delete" onclick="deleteEvent(${index})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function editEvent(index) {
  const event = events[index];
  alert("Edit event: " + event.name);
  // You can replace this with a modal/edit form
}

function deleteEvent(index) {
  if (confirm("Are you sure you want to delete this event?")) {
    events.splice(index, 1);
    localStorage.setItem("events", JSON.stringify(events));
    renderEvents();
  }
}

// Initial render
renderEvents();
