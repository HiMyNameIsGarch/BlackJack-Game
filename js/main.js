var ace = document.getElementById("ace");
var rules = document.getElementById('rules');
var arrowButton = document.getElementById("arrow");
var setValues = document.getElementById("setValues");
var statusPoints = document.getElementById("status");
var playAgain = document.getElementById("playAgain");
var surrenderBtn = document.getElementById("surrBtn");
var middleCard = document.getElementById("middleCard");
var playerCards = document.getElementById("playerCards");
var dealerCards = document.getElementById("dealerCards");
var msgList = ["You Won!", "You Lost!", "You got a BlackJack, and you won!", "Dealer's got a BlackJack and you lost!", "It's a draw!"];
const posibleFinishedGame = ["Won", "Lost", "Draw"];
const posibleStatusGame = ["dealerRound", "inGame"];
var gameRunning = true;
var firstMove = false;
var aceTaken = 0;
var valuesTaken = 0;
const deck = new Deck();
const player = new Player(500, "player");
const dealer = new Player(0, "dealer");
delete dealer.money;
delete dealer.bet;

function changeRulesVizibility() {
    if (rules.style.transform == "scaleY(1)" && rules.style.height == "620px" && arrowButton.style.transform == "rotate(180deg)")
        ChangePropsForRulesSection(0, 0, 0);
    else ChangePropsForRulesSection(180, 620, 1);
}
function ChangePropsForRulesSection(deg, pixels, yValue) {
    arrowButton.style.transform = `rotate(${deg}deg)`;
    rules.style.height = `${pixels}px`;
    rules.style.transform = `scaleY(${yValue})`;
}
function startGame() {
    ChangePropsForRulesSection(0, 0, 0);
    setValues.style.transform = `scaleY(1)`;
    setValues.style.height = "320px";
    document.getElementById("startButton").style.display = "none";
}
function takeValuesSlider(slider, idCard, idBtn) {
    if ((typeof (slider) === "undefined") || (typeof (idCard) === "undefined") || (typeof (idBtn) === "undefined")) return;
    else if (!(idCard.id.includes(slider.name))) return;
    switch (slider.name) {
        case "left":
            idBtn.disabled = true;
            if (slider.value > 0) {
                deck.cutTheDeck(slider.value);
                rotateCard(idCard);
                putCardsOnTable();
                break;
            }
            rotateCard(idCard);
            putCardsOnTable();
            break;
        case "middle":
            if (player.drawnCards.length == 2 && player.drawnCards[0].value == "A" && player.drawnCards[1].value == "A") {
                disableButtons(false, false, (firstMove) ? true : false);
                gameRunning = true;
                aceTaken++;
                player.points += (Number(slider.value < 25) ? 1 : 11);
                if (aceTaken == 2) {
                    aceTaken = 0;
                    rotateCard(middleCard);
                }
                updateStatus(posibleStatusGame[1]);
                break;
            }
            disableButtons(false, false, (firstMove) ? true : false);
            gameRunning = true;
            player.points += (Number(slider.value < 25) ? 1 : 11);
            if (!verifyPlayerPoints()) {
                rotateCard(idCard);
            }
            updateStatus(posibleStatusGame[1]);
            break;
        case "right":
            if (slider.value > 0) {
                idBtn.disabled = true;
                player.placeBet(slider.value);
                updateStatus(posibleStatusGame[0]);
                rotateCard(idCard);
                putCardsOnTable();
                break;
            }
        default:
            break;
    }
}
function rotateCard(card) {
    if (typeof card === undefined) return;
    if (card.style.transform == "rotateY(180deg)") {
        card.style.transform = "rotateY(0deg)";
        return;
    }
    card.style.transform = `rotateY(180deg)`;
}
function putCardsOnTable() {
    valuesTaken++;
    if (valuesTaken === 2) {
        valuesTaken = 0;
        setValues.style.height = "825px";
        setTimeout(() => {
            disableButtons(true, true, true);
            changeLayout("block", "block", "block", "none");
            player.drawAndDisplayCard(deck, playerCards);
            setTimeout(() => {
                dealer.drawAndDisplayCard(deck, dealerCards);
                setTimeout(() => {
                    player.drawAndDisplayCard(deck, playerCards);
                    setTimeout(() => {
                        dealer.drawCard(deck, dealerCards);
                        setTimeout(() => {
                            if (!verifyDealerBlackJack()) {
                                if (!player.contains("A")) {
                                    disableButtons(false, false, false);
                                }
                            }
                        }, 720);
                    }, 720);
                }, 720);
            }, 720);
        }, 720);
    }
}
function updateStatus(statusGame) {
    if (typeof (statusGame) == "undefined") return;
    switch (statusGame) {
        case posibleStatusGame[0]:
            statusPoints.innerHTML = statusText();
            break;
        case posibleStatusGame[1]:
            let dealerLastCard;
            if (dealer.points == 21) {
                dealerLastCard = 21;
                statusPoints.innerHTML = statusText(dealerLastCard);
            }
            else if (dealer.drawnCards.length <= 2) {
                switch (dealer.drawnCards[0].value) {
                    case "A":
                        dealerLastCard = "1 / 11";
                        break;
                    case "K":
                    case "Q":
                    case "J":
                        dealerLastCard = 10;
                        break;
                    default:
                        dealerLastCard = dealer.drawnCards[0].value;
                        break;
                }
                statusPoints.innerHTML = statusText(dealerLastCard);
            }
            break;
        default:
            break;
    }
}
const statusText = (dealerPoints = dealer.points) => {
    return `Your money : ${player.money} <br> Your bet : ${player.bet} <br> Dealer's points : ${dealerPoints} <hr> Your points : ${player.points} `;
}
function surrender(idBtn) {
    if (typeof (idBtn) == "undefined") return;
    if (gameRunning) {
        player.money += (player.bet % 2 == 0) ? player.bet / 2 : (player.bet - 1) / 2;
        player.bet = 0;
        updateStatus(posibleStatusGame[1]);
        resetGame(idBtn);
    }
}
function rotateMiddleCard() {
    if (middleCard.style.transform == "rotateY(180deg)") {
        playAgain.style.display = "block";
        rotateCard(middleCard);
    }
    else {
        ace.style.display = "none";
        middleCard.style.transitionDuration = "0.001s";
        rotateCard(middleCard);
        middleCard.style.transitionDuration = "0.7s";
        setTimeout(() => {
            playAgain.style.display = "block";
            rotateCard(middleCard);
        }, 720);
    }
}
function verifyDealerBlackJack() {
    if (dealer.drawnCards.length == 2 && dealer.points == 21) {
        surrenderBtn.disabled = true;
        rotateCard(dealer.cards[1][0]);
        gameStatus("Lost", msgList[3]);
        return true;
    }
    updateStatus(posibleStatusGame[1]);
    return false;
}
function verifyPlayerPoints() {
    if (player.drawnCards.length == 2 && player.points == 21) {
        gameStatus("Won", msgList[2]);
        return true;
    }
    else if (player.drawnCards.length > 1) {
        if (player.points == 21) {
            setTimeout(() => {
                updateStatus(posibleStatusGame[1]);
                stay();
            }, 720);
            return false;
        }
        else if (player.points > 21) {
            gameStatus("Lost", msgList[1]);
            return true;
        }
        setTimeout(() => {
            updateStatus(posibleStatusGame[1]);
        }, 720);
        return false;
    }
    return true;
}
function swapCards(card1, card2) {
    [deck.cards[card1], deck.cards[card2]] = [deck.cards[card2], deck.cards[card1]];
}
function gameStatus(status, msg) {
    if (typeof (msg) == "undefined") return;
    gameRunning = false;
    document.getElementById("statusGame").innerHTML = msg;
    switch (status) {
        case posibleFinishedGame[0]:
            player.money += player.bet * 2;
            setTimeout(() => {
                updateStatus(posibleFinishedGame[1]);
            }, 720);
            break;
        case posibleFinishedGame[1]:
            updateStatus(posibleStatusGame[(dealer.drawnCards.length == 2) ? 1 : 0]);
            break;
        case posibleFinishedGame[2]:
            player.money += (player.bet % 2 == 0) ? player.bet / 2 : (player.bet - 1) / 2;
            updateStatus(posibleFinishedGame[1]);
            break;
        default:
            break;
    }
    firstMove = false;
    player.bet = 0;
    randIds = [];
    rotateMiddleCard();
}
function stay() {
    if (gameRunning) {
        gameRunning = false;
        disableButtons(true, true, true);
        rotateCard(dealer.cards[1][0]);
        setTimeout(() => {
            updateStatus(posibleStatusGame[0]);
        }, 720);
        if (verifyWinner()) {
            drawUntilLose();
        }
    }
}
function verifyWinner() {
    if (dealer.points < 17) {
        return true;
    }
    else if (dealer.points > 21 || player.points > dealer.points) {
        gameStatus("Won", msgList[0]);
        return false;
    }
    else if (dealer.points == player.points) {
        gameStatus("Draw", msgList[4]);
        return false;
    }
    else if (player.points < dealer.points) {
        gameStatus("Lost", msgList[1]);
        return false;
    }
    return true;
}
function drawUntilLose() {
    setTimeout(() => {
        dealer.drawCard(deck, dealerCards);
        setTimeout(() => {
            rotateCard(dealer.cards[dealer.cards.length - 1][0]);
            setTimeout(() => {
                updateStatus(posibleStatusGame[0]);
            }, 720);
            if (verifyWinner()) {
                drawUntilLose();
            }
        }, 720);
    }, 720)
}
function resetGame(idBtn) {
    if (typeof (idBtn) == "undefined") return;
    idBtn.disabled = true;
    if (player.money == 0) {
        document.getElementById("reminder").innerHTML = "You don't have any money to bet, please refresh the page"
        document.getElementById("cutTheDeck").disabled = true;
        document.getElementById("leftBtn").disabled = true;
        document.getElementById("rightBtn").disabled = true;
        if (middleCard.style.transform != "") rotateCard(middleCard);
        updateInterface();
        updateSlider();
        document.getElementById("refreshBtn").style.display = "block";
        return;
    }
    deck.clearCards();
    player.clearProps();
    dealer.clearProps();
    deck.makeDeck();
    deck.suffleDeck();
    updateSlider();
    ace.style.display = "none";
    if (middleCard.style.transform != "") rotateCard(middleCard);
    setTimeout(() => {
        gameRunning = true;
        updateInterface();
        document.getElementById("leftBtn").disabled = false;
        document.getElementById("rightBtn").disabled = false;
        playAgain.style.display = "none";
        setTimeout(() => {
            if (middleCard.style.transform == "rotateY(180deg)") rotateCard(middleCard);
            setTimeout(() => {
                ace.style.display = "block";
                idBtn.disabled = false;
                if (idBtn != surrenderBtn) surrenderBtn.disabled = false;
            }, 720);
        }, 720);
    }, 720);
}
function changeLayout(dText, pText, btnSection, rem) {
    document.getElementById("dealerText").style.display = dText;
    document.getElementById("playerText").style.display = pText;
    document.getElementById("buttonsSection").style.display = btnSection;
    document.getElementById("reminder").style.display = rem;
}
function updateSlider() {
    placeBet.max = player.money;
    betText.innerHTML = infoText();
    betValue.innerHTML = placeBet.value;
}
function updateInterface() {
    rotateCard(document.getElementById("leftCard"));
    rotateCard(document.getElementById("rightCard"));
    changeLayout("none", "none", "none", "block");
    dealerCards.innerHTML = "";
    playerCards.innerHTML = "";
}
function disableButtons(drawACardBtn, stayBtn, surBtn) {
    document.getElementById("drawCardBtn").disabled = drawACardBtn;
    document.getElementById("stayBtn").disabled = stayBtn;
    surrenderBtn.disabled = surBtn;
}