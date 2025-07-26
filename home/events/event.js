document.addEventListener('DOMContentLoaded', () => {
  const cards = document.getElementById('cards');
  const registerModal = document.getElementById('registerModal');
  const closeModal = document.getElementById('closeModal');
  const registerForm = document.getElementById('registerForm');
  let currentEventId = null;  // store event ID when opening modal

  // Fetch and display events
  fetch('http://localhost:3001/api/events/all')
    .then(res => res.json())
    .then(data => {
      data.events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <img src="${event.image}" alt="${event.title}" />
          <div class="card-content">
            <h3>${event.title}</h3>
            <p>${event.date} - ${event.description}</p>
            <p><strong>Club:</strong> ${event.club?.name || 'Not specified'}</p>
            <button class="register-btn" 
                    data-event-id="${event._id}" 
                    data-event-title="${event.title}">
              Register
            </button>
          </div>`;
        cards.appendChild(card);
      });

      // Add event listeners after cards are created
      document.querySelectorAll('.register-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          currentEventId = e.target.dataset.eventId; // Save event ID
          registerModal.style.display = 'block';
        });
      });
    });

  // Close modal
  closeModal.addEventListener('click', () => {
    registerModal.style.display = 'none';
  });

  // Handle form submission
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    if (!currentEventId) {
      alert("No event selected!");
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/register-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, eventId: currentEventId })
      });
      const data = await res.json();

      alert(data.message || 'Registered Successfully!');
      registerForm.reset();
      registerModal.style.display = 'none';
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Something went wrong. Try again.");
    }
  });
});
const editModal = document.getElementById('editModal');
const closeEditModal = document.getElementById('closeEditModal');
const editForm = document.getElementById('editForm');

let editingEventId = null;

// Create edit buttons after event cards
data.events.forEach(event => {
  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.className = 'edit-btn';
  editBtn.dataset.eventId = event._id;
  editBtn.dataset.title = event.title;
  editBtn.dataset.date = event.date;
  editBtn.dataset.description = event.description;
  editBtn.dataset.club = event.club?.name || '';

  card.querySelector('.card-content').appendChild(editBtn);

  editBtn.addEventListener('click', (e) => {
    editingEventId = e.target.dataset.eventId;
    document.getElementById('editTitle').value = e.target.dataset.title;
    document.getElementById('editDate').value = e.target.dataset.date;
    document.getElementById('editDescription').value = e.target.dataset.description;
    document.getElementById('editClub').value = e.target.dataset.club;
    editModal.style.display = 'block';
  });
});

// Close modal
closeEditModal.addEventListener('click', () => {
  editModal.style.display = 'none';
});

// Submit edit form
editForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const updatedEvent = {
    title: document.getElementById('editTitle').value,
    date: document.getElementById('editDate').value,
    description: document.getElementById('editDescription').value,
    clubName: document.getElementById('editClub').value
  };

  try {
    const res = await fetch(`http://localhost:3001/api/events/${editingEventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEvent)
    });

    const data = await res.json();
    alert(data.message || 'Event updated successfully!');
    editModal.style.display = 'none';
    location.reload(); // Refresh to show updated events
  } catch (err) {
    console.error("Error updating event:", err);
    alert("Failed to update event.");
  }
});
