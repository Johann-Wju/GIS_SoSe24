window.onload = function () {
    initTotalChips();
    document.getElementById("reset-highscore").addEventListener("click", resetChips);
    document.getElementById("highscore-form").addEventListener("submit", submitHighscore);
    fetchHighscores();
}

function initTotalChips() {
    const savedChips = localStorage.getItem("totalChips");
    if (savedChips !== null) {
        totalChips = parseInt(savedChips);
        document.getElementById("highscore").innerText = totalChips;
    }
}

function resetChips() {
    totalChips = 20000;
    document.getElementById("highscore").innerText = totalChips;
    localStorage.setItem("totalChips", totalChips.toString());
}

function fetchHighscores() {
    fetch('http://localhost:5500/highscore')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const table = document.querySelector("#table table");
            const rows = table.getElementsByTagName("tr");
            data.highscores.forEach((user, index) => {
                if (index < 10) {
                    rows[index + 1].cells[1].innerText = user.name;
                    rows[index + 1].cells[2].innerText = user.highscore;
                }
            });
        })
        .catch(error => console.error('Error fetching highscores:', error));
}

function submitHighscore(event) {
    event.preventDefault();
    const name = document.getElementById("username").value;
    const highscore = localStorage.getItem("totalChips");

    fetch('http://localhost:5500/highscore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, highscore })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Highscore submitted:', data);
        fetchHighscores();
    })
    .catch(error => console.error('Error submitting highscore:', error));
}
