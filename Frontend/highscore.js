const sqlite3 = require('sqlite3')
const sqlite = require('sqlite');

const dbFilePath = 'Backend\highscore_list.db';
const db = await sqlite.open({
  filename: highscore_list.db,
  driver: sqlite3.Database,
});
// Load everything in as soon as the window opens
window.onload = function () {
    initTotalChips(); // Initialize local storage
    document.getElementById("reset-highscore").addEventListener("click", resetChips);
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