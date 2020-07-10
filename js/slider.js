var aceSlider = document.getElementById("aceSlider");
var aceValue = document.getElementById("aceValue");
aceSlider.value = 0;
aceValue.innerHTML = 1;
aceSlider.oninput = function () { (this.value < 25) ? aceValue.innerHTML = "1" : aceValue.innerHTML = "11" }

var placeBet = document.getElementById("betPlace");
var betText = document.getElementById("betText");
var betValue = document.getElementById("betValue");
const infoText = () => {
    return `You have ${player.money} money <br> How much do you want to bet?`
};
var warnText = "You can't bet 0 money";
placeBet.value = 50;
betValue.innerHTML = placeBet.value;
placeBet.max = player.money;
betText.innerHTML = infoText();
placeBet.oninput = function () {
    if (player.money == 0) {
        betText.innerHTML = "You have no money to bet!";
    }
    (this.value == 0) ? betText.innerHTML = warnText : betText.innerHTML = infoText();
    betValue.innerHTML = this.value;
}

var cutSlider = document.getElementById("cutTheDeck");
var valueSlider = document.getElementById("valueCut");
cutSlider.value = 0;
cutSlider.max = deck.cards.length - 15;
valueSlider.innerHTML = cutSlider.value;
cutSlider.oninput = function () {
    valueSlider.innerHTML = this.value;
}