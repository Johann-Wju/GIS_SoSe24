window.onload = function () {
  initTotalChips(); // Initialize local storage
  document.getElementById("reset-highscore").addEventListener("click", resetChips);
  document.getElementById("submit-highscore").addEventListener("click", submitHighscore);
  loadHighscores(); // Load highscores when the page loads
}

// Function to initialize the total amount of chips from local storage
function initTotalChips() {
  const savedChips = localStorage.getItem("totalChips");
  if (savedChips !== null) {
    totalChips = parseInt(savedChips);
    document.getElementById("highscore").innerText = totalChips;
  }
}

// Function to reset your highscore/chips
function resetChips() {
  totalChips = 20000;
  document.getElementById("highscore").innerText = totalChips;
  localStorage.setItem("totalChips", totalChips.toString()); // Save the updated total chips to local storage
}

// Function to submit highscore
async function submitHighscore() {
  const username = document.getElementById("username").value;
  const highscore = localStorage.getItem("totalChips");

  if (username && highscore) {
    try {
      const response = await fetch('http://127.0.0.1:3000/submit-highscore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, highscore })
      });

      const result = await response.json();
      alert(result.message);
      loadHighscores(); // Reload highscores after submission
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit highscore.');
    }
  } else {
    alert('Please enter your name and ensure you have a highscore to submit.');
  }
}

// Function to load highscores
async function loadHighscores() {
  try {
    const response = await fetch('http://127.0.0.1:3000/get-highscores');
    const highscores = await response.json();

    const tableBody = document.querySelector("#table table tbody");
    tableBody.innerHTML = '';

    highscores.forEach((row, index) => {
      const tableRow = document.createElement('tr');
      tableRow.innerHTML = `
        <td>${index + 1}</td>
        <td>${row.name}</td>
        <td>${row.highscore}</td>
      `;
      tableBody.appendChild(tableRow);
    });
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to load highscores.');
  }
}

