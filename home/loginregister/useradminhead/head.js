// LOGOUT
console.log("Loaded head.js");
const clubId = localStorage.getItem("club");
console.log("📦 Club ID in localStorage:", clubId);

document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "/home/loginregister/login.html";
});

// Cards
const cardViewMembers = document.getElementById("card-view-members");
const cardAddEvent = document.getElementById("card-add-event");


const sectionMembers = document.getElementById("section-members");
const sectionEvents = document.getElementById("section-events");

const cardRegisteredStudents = document.getElementById("card-registered-students");
const sectionRegistered = document.getElementById("section-registered-students");


// Toggle function
function showSection(section) {
  sectionMembers.classList.add("hidden");
  sectionEvents.classList.add("hidden");
 sectionRegistered.classList.add("hidden"); // ✅ new

  section.classList.remove("hidden");
}

// View Members
// View Members Card click
cardViewMembers.addEventListener("click", () => {
  showSection(sectionMembers);

  const clubId = localStorage.getItem("club");

  if (!clubId) {
    alert("Club ID missing. Please login again.");
    return;
  }

  fetch(`http://localhost:3001/api/members/${clubId}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("members-list");

      if (!data.members || data.members.length === 0) {
        container.innerHTML = "<p>No students have joined your club yet.</p>";
        return;
      }

      container.innerHTML = `
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th></tr>
          </thead>
          <tbody>
  ${data.members.map(m => `
    <tr><td>${m.name || "No name"}</td><td>${m.email}</td></tr>
  `).join("")}
</tbody>

        </table>
      `;
    })
    .catch(err => {
      console.error("Failed to load members", err);
      alert("Could not load member list.");
    });
});


// Add Event
cardAddEvent.addEventListener("click", () => {
  showSection(sectionEvents);
  loadEvents();
});

document.getElementById("addEventBtn").addEventListener("click", () => {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const date = document.getElementById("date").value;
  const image = document.getElementById("image").value;
  const club = localStorage.getItem("club");

  if (!club || club === "null" || club === "undefined") {
  alert("Club ID not found. Please re-login.");
  return;
}

  console.log("Sending club:", club);

  

fetch("http://localhost:3001/api/events", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title, description, date, image, club })
})

    .then(res => res.json())
    .then(() => {
      alert("Event added ✅");
      loadEvents();
    });
});

function loadEvents() {
  const club = localStorage.getItem("club");
  if (!club) {
    alert("Club ID not found. Please re-login.");
    return;
  }

  fetch(`http://localhost:3001/api/events/${club}`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("events-list");
      list.innerHTML = `
        <table>
          <tr><th>Title</th><th>Date</th><th>Action</th></tr>
          ${data.events.map(e => `
            <tr>
              <td>${e.title}</td>
              <td>${e.date}</td>
              <td><button onclick="deleteEvent('${e._id}')">Delete</button></td>
              <button class="edit-btn" data-id="${event._id}" data-title="${event.title}" data-description="${event.description}" data-date="${event.date}" data-image="${event.image}">Edit</button>
   
            </tr>
          `).join("")}
        </table>
      `;
    });
}

function deleteEvent(id) {
  fetch(`http://localhost:3001/api/events/${id}`, {
    method: "DELETE"
  })
    .then(() => {
      alert("Deleted ✅");
      loadEvents();
    });
}


// document.getElementById("edit-club-btn").addEventListener("click", () => {
//   const clubName = document.getElementById("club-name").value;
//   const clubDesc = document.getElementById("club-desc").value;
//   const club = localStorage.getItem("club");

//   if (!club) {
//     alert("Club not found. Please login again.");
//     return;
//   }

//   fetch(`http://localhost:3001/api/clubs/${club}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ name: clubName, description: clubDesc })
//   })
//     .then(res => res.json())
//     .then(() => {
//       alert("Club info updated ✅");
//     });
// });
cardRegisteredStudents.addEventListener("click", () => {
  showSection(sectionRegistered);

  const clubId = localStorage.getItem("club");
  if (!clubId) {
    alert("Club ID missing.");
    return;
  }

  fetch(`http://localhost:3001/api/events/${clubId}/registrations`)
    .then(res => res.json())
    .then(data => {
      console.log("📩 Registrations:", data);
      const container = document.getElementById("registered-list");

      if (!data.registrations || data.registrations.length === 0) {
        container.innerHTML = "<p>No registrations yet.</p>";
        return;
      }

      container.innerHTML = `
        <table>
          <thead>
            <tr><th>Event</th><th>Registered Emails</th></tr>
          </thead>
          <tbody>
            ${data.registrations.map(r => `
              <tr>
                <td>${r.title}</td>
                <td>${r.registered.length ? r.registered.join(", ") : "None"}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
    })
    .catch(err => {
      console.error("Error loading registrations", err);
      alert("Couldn't load registrations.");
    });
});
