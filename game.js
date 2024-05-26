let dealerSum = 0;
let yourSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0;

let totalChips = 20000; // Initial chips
let currentBet = 0; // Current bet amount

let hidden;
let deck;

let canHit = true; //allows the player (you) to draw while yourSum <= 21

window.onload = function () {
    buildDeck();
    shuffleDeck();
    startGame();
    document.getElementById("bet").addEventListener("click", placeBet);
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]);
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}

function startGame() {

    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./textures/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }
    document.getElementById("dealer-sum").innerText = dealerSum - getValue(hidden);
    console.log(dealerSum);

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./textures/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }
    document.getElementById("your-sum").innerText = yourSum;
    console.log(yourSum);

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    document.getElementById("reset").addEventListener("click", reset);

}

function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./textures/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if (reduceAce(yourSum, yourAceCount) >= 21) {
        canHit = false;
    }

    document.getElementById("your-sum").innerText = reduceAce(yourSum, yourAceCount);

}

function stay() {
    if (currentBet === 0) {
        alert("You need to place a bet!")
        return;
    }

    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    document.getElementById("hidden").src = "./textures/" + hidden + ".png";

    let message = "";
    if (yourSum > 21) {
        message = "You Lose!";
        resolveBet(false);
    }
    else if (dealerSum > 21) {
        message = "You win!";
        resolveBet(true);
    }
    //both you and dealer <= 21
    else if (yourSum == dealerSum) {
        message = "Tie!";
        totalChips += currentBet; //refund bet on tie
    }
    else if (yourSum > dealerSum) {
        message = "You Win!";
        resolveBet(true);
    }
    else if (yourSum < dealerSum) {
        message = "You Lose!";
        resolveBet(false);
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("win-loose").innerText = message;
}

function placeBet() {
    const selectedBet = document.querySelector('input[name="chips"]:checked');
    if (selectedBet) {
        currentBet = parseInt(selectedBet.value);
        if (currentBet > totalChips) {
            alert("You don't have enough chips to place this bet.");
            currentBet = 0;
        } else {
            totalChips -= currentBet;
            document.getElementById("highscore").innerText = totalChips;
            console.log(`Bet placed: ${currentBet}`);
        }
    } else {
        alert("Please select a bet amount.");
    }
}

function resolveBet(win) {
    if (win) {
        totalChips += currentBet * 2;
    }
    document.getElementById("highscore").innerText = totalChips;
    currentBet = 0; // Reset current bet
}

function reset() {
    // Reset all variables to their initial values
    dealerSum = 0;
    yourSum = 0;
    dealerAceCount = 0;
    yourAceCount = 0;
    hidden = null;
    canHit = true;
    currentBet = 0;

    // Clear the dealer's and player's cards
    document.getElementById("dealer-cards").innerHTML = '<img id="hidden" src="./textures/BACK.png">';
    document.getElementById("your-cards").innerHTML = "";

    // Clear messages
    document.getElementById("win-loose").innerText = "";

    buildDeck();
    shuffleDeck();
    startGame();
}

function getValue(card) {
    let data = card.split("-");
    let value = data[0];

    if (isNaN(value)) {
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

// The following two fuctions check for an Ace which can be 11 or 1, depending on the player sum
function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}