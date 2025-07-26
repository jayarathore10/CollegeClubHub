// 🍔 Toggle navbar for mobile view
const email = localStorage.getItem("email"); 
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// 🔒 Logout functionality
document.getElementById("logout").addEventListener("click", () => {
  localStorage.clear();
  alert("Logged out successfully!");
  window.location.href = "../login.html";
});

// Cards
const viewClubsCard = document.getElementById("view-clubs-card");
const viewEventsCard = document.getElementById("view-events-card");

const clubsSection = document.getElementById("clubs-section");
const eventsSection = document.getElementById("events-section");

// Toggle
function showSection(section) {
  clubsSection.classList.add("hidden");
  eventsSection.classList.add("hidden");
  section.classList.remove("hidden");
}

// View My Clubs
viewClubsCard.addEventListener("click", () => {
  showSection(clubsSection);
  loadClubs();
});

// View My Events
viewEventsCard.addEventListener("click", () => {
  showSection(eventsSection);
  loadEvents();
});

// // Load clubs from localStorage
// // ✅ Example: user.js
// function loadClubs() {
//   const email = localStorage.getItem("currentUser");
//   const clubContainer = document.getElementById("yourClubs");
//   const users = JSON.parse(localStorage.getItem("users")) || {};

//   if (email && users[email]) {
//     const clubs = users[email].clubs || [];

//     if (clubs.length === 0) {
//       clubContainer.innerHTML = "<p>You have not joined any clubs yet.</p>";
//     } else {
//       clubContainer.innerHTML = clubs
//         .map(
//           club => `
//           <div class="club-card" onclick="goToClub('${club}')">
//             <h3>${club}</h3>
//             <p>Click to view details</p>
//           </div>
//         `
//         )
//         .join("");
//     }
//   } else {
//     clubContainer.innerHTML = "<p>Please login.</p>";
//   }
// }
// // ✅ Ye function open karega respective club page
// function goToClubPage(clubName) {
//   // Example: Cultural → cultural-club.html
//   const pageName = `${clubName.toLowerCase().replace(/\s+/g, '-')}.html`;
//   window.location.href = `/clubs/${pageName}`;
// }

// window.addEventListener("DOMContentLoaded", () => {
//   loadClubs();
// });
function loadClubs() {
  const email = localStorage.getItem("currentUser");
  const users = JSON.parse(localStorage.getItem("users")) || {};
  const clubContainer = document.getElementById("yourClubs");

  if (email && users[email]) {
    const clubs = users[email].clubs || [];

    if (clubs.length === 0) {
      clubContainer.innerHTML = "<p>You have not joined any clubs yet.</p>";
    } else {
      clubContainer.innerHTML = clubs
        .map(
          club => `
            <div class="club-card" onclick="goToClubDetails('${club.id}')">
              <h3>${club.name}</h3>
              <p>Click to view details</p>
            </div>
          `
        )
        .join("");
    }
  } else {
    clubContainer.innerHTML = "<p>Please login.</p>";
  }
}

// ✅ Correct navigation function
function goToClubDetails(clubId) {
  window.location.href = "../../clubs/club-details.html?id=" + clubId;

}






window.addEventListener("DOMContentLoaded", loadClubs);




// Load joined club events
function loadEvents() {
  const email = localStorage.getItem("currentUser");
  const users = JSON.parse(localStorage.getItem("users")) || {};
  const eventsContainer = document.getElementById("yourEvents");

  if (email && users[email]) {
    const clubs = users[email].clubs || [];

    if (clubs.length === 0) {
      eventsContainer.innerHTML = "<p>You have not joined any clubs yet.</p>";
      return;
    }

    eventsContainer.innerHTML = "<p>Loading events...</p>";

    Promise.all(
  clubs
    .filter(club => club.id)
    .map(club =>
      fetch(`http://localhost:3001/api/events/${club.id}`).then(res => res.json())
    )
)
.then(results => {
      let allEvents = [];
      results.forEach(result => {
        if (result.success && Array.isArray(result.events)) {
          allEvents = allEvents.concat(result.events);
        }
      });

      if (allEvents.length === 0) {
        eventsContainer.innerHTML = "<p>No events found for your clubs.</p>";
      } else {
        eventsContainer.innerHTML = allEvents
          .map(event => `
            <div class="event-card">
              <h3>${event.title}</h3>
              <p><strong>Description:</strong> ${event.description}</p>
              <p><strong>Date:</strong> ${event.date}</p>
              <p><strong>Club:</strong> ${event.club?.name || "Unknown"}</p>
              ${event.image ? `<img src="${event.image}" alt="${event.title}" class="event-image" />` : ""}
            </div>
          `)
          .join("");
      }
    });
  } else {
    eventsContainer.innerHTML = "<p>Please login.</p>";
  }
}

