/*----- constants -----*/
const ICON_LOOKUP = {
    clubsPile: 'css/images/clubs.png',
    spadesPile: 'css/images/spade.png',
    heartsPile: 'css/images/heart.png',
    diamondsPile: 'css/images/diamond.png'
}

const SOUND_LOOKUP = {
    shuffle: 'https://cdn.freesound.org/previews/538/538525_11412454-lq.mp3',
    card: 'https://cdn.freesound.org/previews/240/240777_4107740-lq.mp3',
}

const numShuf = 10;

/*----- app's state (variables) -----*/
let cardDeck;
let shuffledDeck;
let cardPiles;
let gameStatus;
let moveCounter;
let currentPile;
let targetPile;

/*----- cached element references -----*/
const colEls = document.querySelectorAll('.pyr');
const rPileEls = document.querySelectorAll('.right');
const deckEl = document.getElementById('deck');
const drawnEl = document.getElementById('drawnDeck');
const gameContainer = document.querySelector('.game-container');
const headerEl = document.querySelector('#heading');
const buttonEl = document.querySelector('#button');
const cardAudioEl = new Audio();
const movePEl = document.querySelector('#move-counter');
const rulesButtonEl = document.getElementById('rules-button');
const rulesEl = document.getElementById('rules');

/*----- event listeners -----*/
gameContainer.addEventListener('click',handleClick);
buttonEl.addEventListener('click', init);
rulesButtonEl.addEventListener('click', renderRules);

/*----- functions -----*/
function init() {
    cardDeck = createDeck();
    shuffledDeck = shuffleDeck(cardDeck,numShuf);
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
    targetPile = null;
    rules = null;
    render();
}

function render() {
    renderMainDeck();
    renderDrawnDeck();
    renderCols();
    renderPiles();
    renderSelection();
    renderMessages();
}

function renderSelection() {
    for (let pile in cardPiles) {
        cardPiles[pile].forEach(function(card, idx) {
            if (card.selected) {
                if (['heartsPile','diamondsPile','clubsPile','spadesPile','drawnDeck'].includes(pile)) {
                    document.querySelector(`#${pile} :first-child`).classList.add("selected")
                } else {
                    document.querySelectorAll(`#${pile} :nth-child(n+${idx+1})`).forEach(function(el) {
                        el.classList.add("selected");
                    })
                }
            }
        })
    }
}


function renderMainDeck() {
    removeChildren(deckEl);
    if (cardPiles.mainDeck.length) {
        generateImg(deckEl,'back','mainDeck')
    }
}

function renderDrawnDeck() {
    removeChildren(drawnEl);
    if (cardPiles.drawnDeck.length) {
        generateImg(drawnEl,'front','drawnDeck')
    }
}

function renderCols() {
    colEls.forEach(function(col) {
        removeChildren(col);
        cardPiles[col.id].forEach(function(card, idx) {
            let tempSuit = cardPiles[col.id][idx].suit;
            let tempValue = cardPiles[col.id][idx].value;
            let tempImg = document.createElement('img');
            if (idx !== cardPiles[col.id].length-1 && !cardPiles[col.id][idx].show) {
                tempImg.src = `css/card-deck-css/images/backs/blue.svg`;
            } else {
                tempImg.src = `css/card-deck-css/images/${tempSuit}/${tempSuit}-${tempValue}.svg`
                cardPiles[col.id][idx].show = true;
            }
            tempImg.classList.add(`${idx}`);
            col.appendChild(tempImg);
        });
    });
}

function renderPiles() {
    rPileEls.forEach(function(pile) {
        removeChildren(pile)
        if (cardPiles[pile.id].length) {
            generateImg(pile,'front',pile.id);
        } else {
            generateImg(pile,'icon',pile.id);
        }
    })
}

function renderMessages() {
    (gameStatus) ? headerEl.textContent = 'WINNER!' : 'Solitaire';
    if (gameStatus) {
        headerEl.textContent = 'WINNER!';
        buttonEl.textContent = 'Play Again?';
    } else {
        buttonEl.textContent = 'Restart';
    }
    movePEl.innerHTML = `Moves: ${moveCounter}`;
}

function renderRules() {
    let visibilitySet = rulesEl.style.visibility;
    visibilitySet = (visibilitySet === 'hidden') ? 'visible' : 'hidden';
    rulesEl.style.visibility = visibilitySet;
}

function generateImg(ele,face,pile) {
    let tempImg = document.createElement('img');
    if (face === 'front') {
        let tempSuit = cardPiles[pile][cardPiles[pile].length-1].suit;
        let tempValue = cardPiles[pile][cardPiles[pile].length-1].value;
        cardPiles[pile][cardPiles[pile].length-1].show = true;
        tempImg.src = `css/card-deck-css/images/${tempSuit}/${tempSuit}-${tempValue}.svg`;
        tempImg.style.height = '100%';
        tempImg.style.width = '100%';
    } else if (face === 'icon') {
        tempImg.src = ICON_LOOKUP[pile];
        tempImg.style.border = 'none';
        tempImg.style.backgroundColor = '#177D26';
    } else {
        tempImg.src = `css/card-deck-css/images/backs/blue.svg`;
        tempImg.style.height = '100%';
        tempImg.style.width = '100%';
    } 
    tempImg.className = `${cardPiles[pile].length-1}`
    ele.appendChild(tempImg);    
}

function handleClick(evt) {
    let elmnt = evt.target;
    if (gameStatus) return;
    if (elmnt.parentElement.id === 'deck'|| elmnt.id === 'deck') {
        drawCard();
        currentPile = null;
        targetPile = null;
        clearSelected();
    } else if ((elmnt.tagName === 'IMG' && !elmnt.src.includes('blue.svg')) 
                || elmnt.classList.contains('piles')
                || (elmnt.classList.contains('pyr') && currentPile)) {
        setMoves(evt);
        if (currentPile && targetPile) {
            if (isValidMove(currentPile, targetPile)) {
                moveCard();
                clearSelected();
            } else {
                targetPile = null;
                currentPile = null;
                clearSelected();
            }
        }
    } else {
        render();
        return
    }
    if (gameStatusCheck()) {
        gameStatus = gameStatusCheck();

    }
    render();
}


function drawCard() {
    if (cardPiles.mainDeck.length === 0) {
        cardPiles.mainDeck = shuffleDeck(cardPiles.drawnDeck,numShuf);
        cardPiles.drawnDeck = [];
        cardAudioEl.src = SOUND_LOOKUP.shuffle;
        cardAudioEl.playbackRate = 1.5;
        cardAudioEl.play();
    } else {
        cardPiles.drawnDeck.push(cardPiles.mainDeck.pop());
    }
    moveCounter++
}

function setMoves(evt) {
    let tempIdx = evt.target.className;
    let tempCol = evt.target.parentElement.id;
    if (currentPile && targetPile) {
        currentPile = null;
        targetPile = null;
    }
    if (!currentPile && evt.target.tagName !== 'IMG') return;
    if (currentPile) {
        targetPile = evt.target.tagName === 'IMG' ? evt.target.parentElement : evt.target;
    } else {
        currentPile = {index: tempIdx, col: tempCol};
    }
    clearSelected();
    cardPiles[currentPile.col][currentPile.index].selected = true;
}

function clearSelected() {
    for (let pile in cardPiles) {
        cardPiles[pile].forEach(function(card) {
            card.selected = false;
        });
    }
}

function isValidMove(cPile, tPile) {
    let tCol = targetPile.id ? targetPile.id : targetPile.parentElement.id;
    let cCol = currentPile.col; 
    let cIdx = currentPile.index;
    let cTarget = cardPiles[cCol][cIdx];
    let tTarget = cardPiles[tCol];
    if (targetPile.id === 'drawnDeck') {
        return false;
    } else if (suitPilesValid('heartsPile',tCol,cCol,cIdx,'hearts')) {
        return true;
    } else if (suitPilesValid('diamondsPile',tCol,cCol,cIdx,'diamonds')) {
        return true;
    } else if (suitPilesValid('clubsPile',tCol,cCol,cIdx,'clubs')) {
        return true;
    } else if (suitPilesValid('spadesPile',tCol,cCol,cIdx,'spades')) {
        return true;
    } else if (!['heartsPile','diamondsPile','clubsPile','spadesPile'].includes(tCol)
               && cTarget.rank === 13
               && cardPiles[tCol].length === 0) {
        return true;
    } else if (!['heartsPile','diamondsPile','clubsPile','spadesPile'].includes(tCol)
                && (cTarget.suit === 'hearts' || cTarget.suit === 'diamonds')
                && (tTarget[tTarget.length-1].suit === 'clubs' || tTarget[tTarget.length-1].suit === 'spades')
                && (cTarget.rank === tTarget[tTarget.length-1].rank - 1)) {
        return true;
    } else if (!['heartsPile','diamondsPile','clubsPile','spadesPile'].includes(tCol)
                && (cTarget.suit === 'clubs' || cTarget.suit === 'spades')
                && (tTarget[tTarget.length-1].suit === 'hearts' || tTarget[tTarget.length-1].suit === 'diamonds')
                && (cTarget.rank === tTarget[tTarget.length-1].rank - 1)) {
        return true;
    } else {
        return false;
    }
}

function suitPilesValid(pile,tarCol,curCol,curIdx,suit) {
    if (tarCol === pile) {
        if (cardPiles[tarCol].length === 0 
            && cardPiles[curCol][curIdx].suit === suit 
            && cardPiles[curCol][curIdx].rank === 1) {
            return true;
        } else if (cardPiles[curCol][curIdx].suit === suit
                    && cardPiles[curCol][curIdx].rank === cardPiles[pile][cardPiles[pile].length-1].rank +1) {
            return true;                
        } else {
            return false;
        }    
    }
}

function moveCard(evt) {
    cardPiles[targetPile.id] = cardPiles[targetPile.id].concat(cardPiles[currentPile.col].slice(currentPile.index));
    cardPiles[currentPile.col].splice(currentPile.index,cardPiles[currentPile.col].length-currentPile.index);
    cardAudioEl.src = SOUND_LOOKUP.card;
    cardAudioEl.playbackRate = 2.0;
    cardAudioEl.play();
    moveCounter++;
}

function removeChildren(el) {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
}

function gameStatusCheck() {
    let hrtValue = (cardPiles.heartsPile.length) ? cardPiles.heartsPile[cardPiles.heartsPile.length-1].rank : null;
    let dmndValue = (cardPiles.diamondsPile.length) ? cardPiles.diamondsPile[cardPiles.diamondsPile.length-1].rank : null;
    let clubValue = (cardPiles.clubsPile.length) ? cardPiles.clubsPile[cardPiles.clubsPile.length-1].rank : null;
    let spdeValue = (cardPiles.spadesPile.length) ? cardPiles.spadesPile[cardPiles.spadesPile.length-1].rank : null;
    return (hrtValue + dmndValue + clubValue + spdeValue === 52)
}

function createDeck() {
    let values = ['A',2,3,4,5,6,7,8,9,10,'J','Q','K'];
    let suits = ['hearts','diamonds','clubs','spades'];
    let deck = [];
    suits.forEach(function(suit) {
      values.forEach(function(value, idx) {
        deck.push({value: value,suit: suit, rank:idx+1, show: false, selected:false});
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



