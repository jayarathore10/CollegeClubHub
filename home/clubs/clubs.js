document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("club-container");

  try {
    const res = await fetch("http://localhost:3001/api/clubs");
    const clubs = await res.json();

    console.log("Fetched clubs:", clubs);

    if (!Array.isArray(clubs) || clubs.length === 0) {
      container.innerHTML = "<p>No clubs found.</p>";
      return;
    }

    clubs.forEach((club) => {
      const card = document.createElement("div");
      card.className = "club-card";

      const folderName = club._id; // unique MongoDB id
card.innerHTML = `
  <a href="/home/clubs/club-details.html?id=${folderName}" class="club-link">
    <img src="${club.image || './images/placeholder.png'}" alt="${club.name}">
    <h3>${club.name}</h3>
    <p>${club.description}</p>
    <button class="follow-btn">Follow</button>
  </a>
`;


      // 🔗 Make entire card clickable to go to club-details
      card.addEventListener("click", () => {
        window.location.href = `../club-details/club-details.html?id=${club._id}`;
      });

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching clubs:", error);
    container.innerHTML = "<p>Failed to load clubs. Please try again later.</p>";
  }
});
