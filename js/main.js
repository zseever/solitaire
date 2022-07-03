/*----- constants -----*/
const CARD_DECK = createDeck();
const numShuf = 10;

/*----- app's state (variables) -----*/
// -store arrays from main object in variables
let shuffledDeck;
// -Arrays used for: Deck, Drawn cards, Column piles 1-7,  and the 4 ace piles
let cardPiles;
// deck used to distribute cards
let deck;
// -variable for game in progress or game won (I’m not sure how to determine a game is “unwinnable” in solitaire)
let gameStatus;
// -move counter?
let moveCounter;
// -current card/stack selected
let currentPile;
// Timer (extra feature)
//let count;



/*----- cached element references -----*/
const colEls = document.querySelectorAll('.pyr');
const rPileEls = document.querySelectorAll('.right');
const deckEl = document.getElementById('deck');
const drawnEl = document.getElementById('drawn-deck');

/*----- event listeners -----*/


/*----- functions -----*/
init();

function init() {
    shuffledDeck = shuffleDeck(CARD_DECK,numShuf);
    cardPiles = {
        mainDeck: shuffledDeck.slice(28),
        drawnDeck: [],
        col1: shuffledDeck.slice(0,1),
        col2: shuffledDeck.slice(1,3),
        col3: shuffledDeck.slice(3,6),
        col4: shuffledDeck.slice(6,10),
        col5: shuffledDeck.slice(10,15),
        col6: shuffledDeck.slice(15,21),
        col7: shuffledDeck.slice(21,28),
        heartsPile: [],
        diamondsPile: [],
        spadesPile: [],
        clubsPile: [],
    }
    gameStatus = null;
    moveCounter = 0;
    currentPile = null;
    render();
}

function render() {
    renderMainDeck();
    renderDrawnDeck();
    renderCols();
    renderPiles();
}

function renderMainDeck() {
    removeChildren(deckEl);
    if (cardPiles.mainDeck.length) {
        let tempImg = document.createElement('img');
        tempImg.src = `css/card-deck-css/images/backs/blue.svg`;
        tempImg.style.height = '100%';
        tempImg.style.width = '100%';
        deckEl.appendChild(tempImg);
    }
}

function renderDrawnDeck() {
    removeChildren(drawnEl);
    if (cardPiles.drawnDeck.length) {
        let tempSuit = cardPiles.drawnDeck[cardPiles.drawnDeck.length-1].suit;
        let tempValue = cardPiles.drawnDeck[cardPiles.drawnDeck.length-1].value;
        let tempImg = document.createElement('img');
        tempImg.src = `css/card-deck-css/images/${tempSuit}/${tempSuit}-${tempValue}.svg`;
        tempImg.style.height = '100%';
        tempImg.style.width = '100%';
        drawnEl.appendChild(tempImg);
    }
}

function renderCols() {
    colEls.forEach(function(col) {
        removeChildren(col);
        cardPiles[col.id].forEach(function(card, idx) {
            let tempSuit = cardPiles[col.id][idx].suit;
            let tempValue = cardPiles[col.id][idx].value;
            let tempImg = document.createElement('img');

            if (idx !== cardPiles[col.id].length-1) {
                tempImg.src = `css/card-deck-css/images/backs/blue.svg`;
            } else {
                tempImg.src = `css/card-deck-css/images/${tempSuit}/${tempSuit}-${tempValue}.svg`
            }
            col.appendChild(tempImg);
        });
    });
}

function renderPiles() {
    rPileEls.forEach(function(pile) {
        removeChildren(pile)
        let suitPile = pile.id;
        if (cardPiles[suitPile].length) {
            let tempSuit = cardPiles[suitPile][cardPiles[suitPile].length-1].suit;
            let tempValue = cardPiles[suitPile][cardPiles[suitPile].length-1].value;
            let tempImg = document.createElement('img');
            tempImg.src = `css/card-deck-css/images/${tempSuit}/${tempSuit}-${tempValue}.svg`;
            tempImg.style.height = '100%';
            tempImg.style.width = '100%';
            pile.appendChild(tempImg);
        }
    })
}

function removeChildren(el) {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
}

function createDeck() {
    let values = ['A',2,3,4,5,6,7,8,9,10,'J','Q','K'];
    let suits = ['hearts','diamonds','clubs','spades'];
    let deck = [];
    suits.forEach(function(suit) {
      values.forEach(function(value, idx) {
        deck.push({value: value,suit: suit, rank:idx+1});
      });
    });
    return deck;
  }

function shuffleDeck(deck,numShuffles) {
    let tempDeck = deck.map(card => card);
    let shuffledDeck = [];
    while (numShuffles > 0) {       
        while (tempDeck.length > 0) {
            let randomNum = Math.floor(Math.random()*tempDeck.length);
            shuffledDeck.push(tempDeck[randomNum]); 
            tempDeck.splice(randomNum,1);
        };
        numShuffles--
        tempDeck = shuffledDeck.map(card => card);
        shuffledDeck = [];
    }
    return tempDeck;
}



