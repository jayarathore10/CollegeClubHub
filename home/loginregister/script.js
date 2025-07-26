// Simulating a logged-in user role
const currentUser = {
  role: "admin" // Change this to "head" or "user" to test
};

window.addEventListener("DOMContentLoaded", () => {
  // Hide all links initially
  document.getElementById("adminLink").style.display = "none";
  document.getElementById("headLink").style.display = "none";
  document.getElementById("userProfileLink").style.display = "none";

  // Show link based on role
  if (currentUser.role === "admin") {
    document.getElementById("adminLink").style.display = "inline-block";
  } else if (currentUser.role === "head") {
    document.getElementById("headLink").style.display = "inline-block";
  } else if (currentUser.role === "user") {
    document.getElementById("userProfileLink").style.display = "inline-block";
  }
});
// 🟢 Toggle navbar on mobile
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// 🟣 Image slider with text
const images = [
  "camp2.jpg",    // image2
  "clutural-clubmain.jpg", // image1
  "clutural-club.jpg"         // image3
];

const texts = [
  "Welcome to Medicaps Campus",
  "Explore Our Cultural Club",
  "Capture Moments with Photo Club"
];

let index = 0;

setInterval(() => {
  document.getElementById("slide").src = images[index];
  document.getElementById("slider-text").textContent = texts[index];
  index = (index + 1) % images.length;
}, 3000);
//about college
  const gallery = document.getElementById("gallery");

  setInterval(() => {
    if (gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth) {
      gallery.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      gallery.scrollBy({ left: 300, behavior: "smooth" });
    }
  }, 3000);

  //clubs
  document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".club-card");
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateX(0)";
      }, 200 * index); // delay each card
    });
  });//animation on scroller
  document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector(".clubs"); // Club section
    const revealCards = document.querySelectorAll(".reveal-left");
  
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          revealCards.forEach((card, i) => {
            card.style.transitionDelay = `${i * 200}ms`;
            card.classList.add("active");
          });
  
          observer.unobserve(section); // trigger only once
        }
      });
    }, {
      threshold: 0.3,
    });
  
    observer.observe(section);
  });
  //role based
  window.addEventListener("DOMContentLoaded", () => {
    const role = localStorage.getItem("role");
  
    // Hide all links first
    document.getElementById("adminLink").style.display = "none";
    document.getElementById("headLink").style.display = "none";
    document.getElementById("userProfileLink").style.display = "none";
  
    // Show based on saved role
    if (role === "admin") {
      document.getElementById("adminLink").style.display = "inline-block";
    } else if (role === "head") {
      document.getElementById("headLink").style.display = "inline-block";
    } else if (role === "user") {
      document.getElementById("userProfileLink").style.display = "inline-block";
    }
  });
  //based on login profile

  window.addEventListener("DOMContentLoaded", () => {
    const role = localStorage.getItem("role");
    const profileLink = document.getElementById("profile-link");
  
    if (profileLink) {
      if (role === "admin") {
        profileLink.href = "useradminhead/admin.html";
        profileLink.textContent = "Admin Profile";
      } else if (role === "head") {
        profileLink.href = "useradminhead/head.html";
        profileLink.textContent = "Head Profile";
      } else if (role === "user") {
        profileLink.href = "useradminhead/user.html";
        profileLink.textContent = "User Profile";
      } else {
        profileLink.style.display = "none";
      }
    }
  });
  
  
  
  
  