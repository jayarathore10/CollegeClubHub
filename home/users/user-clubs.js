document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("joinedClubsContainer");
  const users = JSON.parse(localStorage.getItem("users")) || {};
  const email = localStorage.getItem("currentUser");

  // ✅ Check valid logged-in user
  if (!email || !users[email] || !Array.isArray(users[email].clubs)) {
    container.innerHTML = "<p>You have not joined any clubs yet.</p>";
    return;
  }

  const joinedClubs = users[email].clubs;

  if (joinedClubs.length === 0) {
    container.innerHTML = "<p>You have not joined any clubs yet.</p>";
    return;
  }

  // ✅ Club info object
  const clubInfo = {
    "Cultural Club": {
      description: "Dance, music, and drama events.",
      image: "../images/cultural.jpg",
      link: "../../clubs/cultural/index.html"
    },
    "Sports Club": {
      description: "Athletics, games, and sports tournaments.",
      image: "../images/sports.jpg",
      link: "../../clubs/sports/index.html"
    },
    "Technical Club": {
      description: "Coding, robotics, and tech innovations.",
      image: "../images/technical.jpg",
      link: "../../clubs/technical/index.html"
    },
    "Advanced Studies Club": {
      description: "Research and advanced learning.",
      image: "../images/studies.jpg",
      link: "../../clubs/advanced/index.html"
    },
    "Literary Club": {
      description: "Debates, poetry, and writing.",
      image: "../images/literary.jpg",
      link: "../../clubs/literary/index.html"
    },
    "Tech Innovators": {
      description: "Robotics and AI activities.",
      image: "../images/tech.jpg",
      link: "../../clubs/tech-innovators/index.html"
    },
    "Cultural Beats": {
      description: "Dance, music, and drama events.",
      image: "../images/beats.jpg",
      link: "../../clubs/cultural-beats/index.html"
    },
    "Unknown Club": {
      description: "Club description not available.",
      image: "../images/default.jpg",
      link: "#"
    }
  };

  // ✅ Render each club card
  joinedClubs.forEach((clubName) => {
    const { description, image, link } = clubInfo[clubName] || clubInfo["Unknown Club"];

    const card = document.createElement("div");
    card.className = "club-card";
    card.innerHTML = `
      <img src="${image}" alt="${clubName}" />
      <h3>${clubName}</h3>
      <p>${description}</p>
    `;

    card.addEventListener("click", () => {
      if (link !== "#") {
        window.location.href = link;
      }
    });

    container.appendChild(card);
  });
});
