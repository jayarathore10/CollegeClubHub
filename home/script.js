// 🟠 Toggle navbar on mobile
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

// 🟡 Role-based dynamic profile link
window.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");
  const profileLink = document.getElementById("profile-link");

  if (profileLink) {
    if (role === "admin") {
      profileLink.href = "loginregister/useradminhead/admin.html";
      profileLink.textContent = "Admin Profile";
      profileLink.style.display = "inline-block";
    } else if (role === "head") {
      profileLink.href = "loginregister/useradminhead/head.html";
      profileLink.textContent = "Head Profile";
      profileLink.style.display = "inline-block";
    } else if (role === "user") {
      profileLink.href = "loginregister/useradminhead/user.html";
      profileLink.textContent = "User Profile";
      profileLink.style.display = "inline-block";
    } else {
      profileLink.style.display = "none";
    }
  }
  
  

  // 🔵 Club Cards Animation
  const cards = document.querySelectorAll(".club-card");
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "translateX(0)";
    }, 200 * index);
  });

  // 🟢 Scroll Animation for Club Cards
  const section = document.querySelector(".clubs");
  const revealCards = document.querySelectorAll(".reveal-left");

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        revealCards.forEach((card, i) => {
          card.style.transitionDelay = `${i * 200}ms`;
          card.classList.add("active");
        });
        observer.unobserve(section);
      }
    });
  }, { threshold: 0.3 });

  if (section) {
    observer.observe(section);
  }

  // 🟣 About College Gallery Scroll
  const gallery = document.getElementById("gallery");
  if (gallery) {
    setInterval(() => {
      if (gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth) {
        gallery.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        gallery.scrollBy({ left: 300, behavior: "smooth" });
      }
    }, 3000);
  }

  // 🔴 Image Slider with Text
  const images = [
    "images/clutural-clubmain.jpg",
    "images/photo-club.jpg",
    "images/clutural-club.jpg"
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
});
