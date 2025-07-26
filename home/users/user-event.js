const registeredEvents = [
  { name: "AI Workshop", date: "2025-07-15", venue: "Auditorium" },
  { name: "Cultural Night", date: "2025-08-05", venue: "Main Stage" },
  { name: "Sports Day", date: "2025-09-10", venue: "Playground" }
];

const container = document.getElementById("event-list");

if (registeredEvents.length > 0) {
  registeredEvents.forEach(event => {
    const card = document.createElement("div");
    card.className = "event-card";
    card.innerHTML = `
      <h3>${event.name}</h3>
      <p><strong>Date:</strong> ${event.date}</p>
      <p><strong>Venue:</strong> ${event.venue}</p>
    `;
    container.appendChild(card);
  });
} else {
  container.innerHTML = "<p>You are not registered for any events yet.</p>";
}
