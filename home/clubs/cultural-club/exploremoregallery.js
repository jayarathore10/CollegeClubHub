
  function showPopup(imagePath, title, details) {
    document.getElementById('popup-img').src = imagePath;
    document.getElementById('popup-title').innerText = title;
    document.getElementById('popup-details').innerText = details;
    document.getElementById('popup').style.display = 'flex';
  }

  function closePopup() {
    document.getElementById('popup').style.display = 'none';
  }

