class Player {
    drawnCards = [];
    cards = [];
    bet = 0;
    points = 0;
    constructor(money, name) {
        this.money = money;
        this.name = name;
    }
    getValueOfAce() {
        let pointsWithoutAce = this.points;
        for (let i = 0; i < this.drawnCards.length; i++) {
            switch (this.drawnCards[i].value) {
                case "K":
                case "Q":
                case "J":
                    pointsWithoutAce -= 10;
                    break;
                case "A":
                    break;
                default:
                    pointsWithoutAce -= Number(this.drawnCards[i].value);
                    break;
            }
        }
        return pointsWithoutAce;
    }
    contains(card) {
        for (let i = 0; i < this.drawnCards.length; i++) {
            if (this.drawnCards[i].value == card) {
                return true;
            }
        }
    }
    clearProps() {
        this.points = 0;
        this.drawnCards = [];
        this.cards = [];
    }
    placeBet(sum) {
        this.bet += Number(sum);
        this.money -= this.bet;
    }
    drawCard(deck, location) {
        this.drawnCards.push(deck.drawCard());
        this.cards.push(CreateTemplateForCards(location));
        let lastCard = this.cards.length - 1;
        switch (this.drawnCards[lastCard].value) {
            case "A":
                if (this.name == "player") {
                    if (this.drawnCards.length == 2) {
                        if (this.drawnCards[0].value == this.drawnCards[1].value) break;
                    }
                    setTimeout(() => {
                        gameRunning = false;
                        rotateCard(middleCard);
                        setTimeout(() => {
                            disableButtons(true, true, true);
                        }, 720);
                    }, 720);
                }
                else {
                    this.points += 11;
                }
                break;
            case "K":
            case "J":
            case "Q":
                this.points += 10;
                break;
            default:
                this.points += Number(this.drawnCards[lastCard].value);
                break;
        }
        if (this.name == "dealer" && this.drawnCards.length >= 2) this.points += modifyAceValue();
        this.cards[lastCard][1].innerHTML = '<img src="images/deck/backCard.png" id="BackCard" alt="backcard"></img>';
        this.cards[lastCard][2].innerHTML = this.drawnCards[lastCard].location;
    }
    drawAndDisplayCard(deck, location) {
        if (gameRunning) {
            gameRunning = false;
            if (player.drawnCards.length >= 2) firstMove = true;
            if (firstMove) surrenderBtn.disabled = true;
            this.drawCard(deck, location);
            setTimeout(() => {
                gameRunning = true;
                rotateCard(this.cards[this.cards.length - 1][0]);
                if (this.name == "player" && this.drawnCards.length > 2) verifyPlayerPoints();
            }, 720);
        }
    }
}
class Deck {
    cards = [];
    popedCards = [];
    suits = ['clubs', 'diamonds', 'hearts', 'spades'];
    values = '2,3,4,5,6,7,8,9,10,J,Q,K,A';
    constructor() {
        this.makeDeck();
        this.suffleDeck();
    }
    clearCards() {
        this.cards = [];
        this.popedCards = [];
    }
    makeDeck() {
        for (let value of this.values.split(',')) {
            for (let suit of this.suits) {
                this.cards.push({ value, suit, location: `<img src="images/deck/${value}${suit}.png" alt="card">` });
            }
        }
    }
    drawCard() {
        let drawnCard = this.cards.pop();
        return drawnCard;
    }
    suffleDeck() {
        for (let i = 0; i < this.cards.length; i++) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    cutTheDeck(positionOfCutting) {
        if (positionOfCutting > (this.cards.length - 15)) return;
        for (let i = 0; i < positionOfCutting; i++) {
            const cardPop = this.cards.pop(i);
            this.popedCards.push(cardPop);
        }
    }
}
var ids = [];
var randIds = [];

function CreateTemplateForCards(startPoint) {
    if (typeof (startPoint) === undefined) return;//if the main id is null, do nothing
    if (startPoint.tagName !== "UL") return;//verify if the parent is an ul;
    let classNames = ["maincontainer", "thecard", "thefront", "theback"];//list with the class names for the blocks
    let cardObj = [];//in that will be stored the actually card with his id's
    let elems = [];
    ids = [];//those are temp lists with ids and elems, every time u run the function they ll be empty
    for (let i = 0; i < 4; i++) {
        let uniqueId = genUniqueId(100);//generate a random id
        verifyUniqueId(uniqueId);//verify if the number generated is repeating(if yes, pick another one till it's unique)
    }
    elems.push(document.createElement("li"));//creates the first element for template(list)
    for (let j = 0; j < 3; j++) {
        elems.push(document.createElement("div"));//creates the rest elements(divs)
    }
    makeElementWithProps(startPoint, elems[0], classNames[0], ids[0]);//make the list where the next div will come
    for (let i = 1; i < 4; i++) {
        makeElementWithProps(document.getElementById(ids[(i === 1) ? 0 : 1]), elems[i], classNames[i], ids[i]);//create the divs for face/back card
    }
    for (let k = 1; k < 4; k++) {
        cardObj.push(document.getElementById(ids[k]));//push the relevant divs in a list
    }
    return cardObj;//and return it
}
function makeElementWithProps(parent, child, className, idName) {
    parent.appendChild(child);
    child.setAttribute("class", className);
    child.setAttribute("id", idName);
}
function verifyUniqueId(id) {
    if (randIds.includes(id)) {
        let tempId = genUniqueId(120);
        verifyUniqueId(tempId);
    }
    else pushIds(id);
}
function pushIds(id) {
    ids.push(id);
    randIds.push(id);
}
const genUniqueId = (maxNum) => {
    return ("id" + Math.floor((Math.random() * maxNum) + 1));
}
function modifyAceValue() {
    if (dealer.contains("A")) {
        if (dealer.getValueOfAce() > 4) {
            if (dealer.points == player.points || dealer.points == 21) {
                return 0;
            }
            else if ((dealer.points >= 17 && dealer.points < player.points) || dealer.points > 21) {
                return -10;
            }
            return 0;
        }
        else if (dealer.getValueOfAce() == 0) {
            return -10;
        }
        return 0;
    }
    return 0;
}