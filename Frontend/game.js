// Declare variables to store dealer and player sums, ace counts, and chip counts
let dealerSum = 0;
let yourSum = 0;
let dealerAceCount = 0;
let yourAceCount = 0;
let totalChips = 20000; // Starting chips
let currentBet = 0; // Current bet amount
// Declare variables for the hidden card and the deck of cards
let hidden;
let deck;
let canHit = true; // allows the player (you) to draw while yourSum <= 21

// Load everything in as soon as the window opens
window.onload = function () {
    buildDeck();
    shuffleDeck();
    startGame();
    document.getElementById("bet").addEventListener("click", placeBet);
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    document.getElementById("reset").addEventListener("click", reset);
}

// Function to initialize the total amount of chips from local storage
function initTotalChips() {
    const savedChips = localStorage.getItem("totalChips");
    if (savedChips !== null) {
        totalChips = parseInt(savedChips);
        document.getElementById("highscore").innerText = totalChips;
    }
}

// Function to build a deck of cards using an array
function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];
    // Loop through card values and types to create deck
    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]);
        }
    }
}

function shuffleDeck() {
    // Loop through deck and swap each card with a random card using Math.random
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
        // TIPP: Mit einem zweiten Array
    }
    console.log(deck);
}

function startGame() {
    initTotalChips(); // Initialize local storage
    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;
    document.getElementById("reset").disabled = true;
    // Deal cards for the dealer
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
    // Deal cards for the player
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
}
// Function to handle hitting (drawing another card)
function hit() {
    if (!canHit || currentBet === 0) {
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
        stay();
    }

    document.getElementById("your-sum").innerText = reduceAce(yourSum, yourAceCount);
}
// Function to handle staying (ending the player's turn)
function stay() {

    if (currentBet === 0) {
        alert("You need to place a bet!");
        return;
    }

    document.getElementById("reset").disabled = false;

    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    document.getElementById("hidden").src = "./textures/" + hidden + ".png";

    let message = "";
    if (yourSum > 21) {
        message = "You Lose!";
        resolveBet(false);
    } else if (dealerSum > 21) {
        message = "You Win!";
        resolveBet(true);
    } else if (yourSum === dealerSum) {
        message = "Tie!";
        totalChips += currentBet; // refund bet on tie
    } else if (yourSum > dealerSum) {
        message = "You Win!";
        resolveBet(true);
    } else if (yourSum < dealerSum) {
        message = "You Lose!";
        resolveBet(false);
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("win-loose").innerText = message;
    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;
    document.getElementById("bet").disabled = true;
}
// Function to handle placing a bet
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
            document.getElementById("bet").disabled = true;
            document.getElementById("hit").disabled = false;
            document.getElementById("stay").disabled = false;
        }
    } else {
        alert("Please select a bet amount.");
    }
}
// Function to resolve the bet based on the game outcome
function resolveBet(win) {
    if (win) {
        totalChips += currentBet * 2;
    }
    document.getElementById("highscore").innerText = totalChips;
    currentBet = 0; // Reset current bet
    localStorage.setItem("totalChips", totalChips.toString()); // Save the updated total chips to local storage
}
// Function to reset the game
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

    // Re-enable the bet button
    document.getElementById("bet").disabled = false;

    buildDeck();
    shuffleDeck();
    startGame();
}
// Function to get the numerical value of a card
function getValue(card) {
    let data = card.split("-");
    let value = data[0];

    if (isNaN(value)) {
        if (value === "A") {
            return 11; // Ace can be 11 or 1
        }
        return 10; // Card is J, Q or K
    }
    return parseInt(value);
}

// Function to check if a card is an Ace
function checkAce(card) {
    if (card[0] === "A") {
        return 1; // Return 1 if yes
    }
    return 0; // Return 0 if it isn't
}
// Function to reduce the sum by 10 if it exceeds 21 and there are Aces in the hand
function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}