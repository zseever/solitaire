/*----- constants -----*/
const CARD_DECK = createDeck();

/*----- app's state (variables) -----*/
// -store arrays from main object in variables
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
let count;


/*----- cached element references -----*/


/*----- event listeners -----*/


/*----- functions -----*/
init();

function init() {
    // cardPiles = {
    //     mainDeck: [DECK.cardArr.slice[28]],
    //     drawnDeck: [],
    //     col1: [DECK.cardArr.slice[0]],
    //     col2: [DECK.cardArr.slice[1,3]],
    //     col3: [DECK.cardArr.slice[3,6]],
    //     col4: [DECK.cardArr.slice[6,10]],
    //     col5: [DECK.cardArr.slice[10,15]],
    //     col6: [DECK.cardArr.slice[15,21]],
    //     col7: [DECK.cardArr.slice[21,28]],
    //     heartPile: [],
    //     diamondPile: [],
    //     spadesPile: [],
    //     clubsPile: [],
    // }
    gameStatus = null;
    moveCounter = 0;
    currentPile = null;
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
    }
    return shuffledDeck;
  }

shuffleDeck();


