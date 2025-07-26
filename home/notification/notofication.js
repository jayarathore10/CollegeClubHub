document.addEventListener('DOMContentLoaded', function() {
    const notificationList = document.getElementById('notificationList');

    // Sample notifications (These will be fetched dynamically later)
    const notifications = [
        { title: "Meeting Reminder", message: "Don't forget the club meeting at 5:00 PM today." },
        { title: "Event Registration", message: "Registrations for the Cultural Fest are now open!" },
        { title: "New Club Announcement", message: "We have launched a new Coding Club. Join now!" }
    ];

    // Load notifications with animation
    function loadNotifications() {
        notifications.forEach((notification, index) => {
            setTimeout(() => {
                const notificationItem = document.createElement('div');
                notificationItem.classList.add('notification-item');
                notificationItem.style.opacity = '0';
                notificationItem.style.transform = 'translateY(20px)';

                notificationItem.innerHTML = `
                    <h3>${notification.title}</h3>
                    <p>${notification.message}</p>
                `;

                notificationList.appendChild(notificationItem);

                // Animation effect
                setTimeout(() => {
                    notificationItem.style.opacity = '1';
                    notificationItem.style.transform = 'translateY(0)';
                    notificationItem.style.transition = 'all 0.5s ease';
                }, 100);

            }, index * 200); // Delay for each notification
        });
    }

    // Initialize notifications
    loadNotifications();
    
  // 🟡 Role-based dynamic profile link
  const role = localStorage.getItem("role");
  const profileLink = document.getElementById("profile-link");

  if (profileLink) {
    switch (role) {
      case "admin":
        profileLink.href = "loginregister/useradminhead/admin.html";
        profileLink.textContent = "Admin Profile";
        profileLink.style.display = "inline-block";
        break;
      case "head":
        profileLink.href = "loginregister/useradminhead/head.html";
        profileLink.textContent = "Head Profile";
        profileLink.style.display = "inline-block";
        break;
      case "user":
        profileLink.href = "loginregister/useradminhead/user.html";
        profileLink.textContent = "User Profile";
        profileLink.style.display = "inline-block";
        break;
      default:
        profileLink.style.display = "none";
    }
  }
});
