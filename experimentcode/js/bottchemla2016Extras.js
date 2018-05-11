var symlist = ["♦", "♣", "✓", "♠", "♥", "■", "★", "●", "♩", "▲"];
var symText = ["diamond", "club", "tick", "spade", "heart", "square", "star", "circle", "note", "triangle"];
var symPre = ["Some of the symbols are", "There are four", "There is a"]

/*
  Specification of how cards look. This is read…
  [sym1, sym2, sym3, total].
  sym1 is the one named in the prompt, sym2 and sym3 are alternatives.
*/
var trialCards = {
  someStrong: [6, 3, 0, 9],
  someWeak: [9, 0, 0, 9],
  someFalse: [0, 9, 0, 9],
  fourStrong: [4, 0, 0, 4],
  fourWeak: [6, 0, 0, 6],
  fourFalse: [2, 0, 0, 2],
  adhocStrong: [1, 0, 0, 1],
  adhocWeak: [1, 1, 0, 2],
  adhocFalse: [0, 1, 1, 2],
  target: [0, 0, 0, 0],
}

/*
  We build a dictionary for each trial, containing all the relevant information.
  This can then be stored, or the info can be read off and stored independently.
*/
let trials = [
  // {symbols: [] prime: [], target: [], strength : [], etc…}
]

/*
  build trials
*/

for (n = 1; n <= 1; n++) { // number of each
  for (t = 0; t < 3; t++) { // target
    for (s = 0; s < 2; s++) { // strength
      for (p = 0; p < 3; p++) { // prime
        dict = {};
        p1Split = _.shuffle([0, 1]);
        p2Split = _.shuffle([0, 1]);
        dict["target"] = t;
        dict["strength"] = s;
        dict["prime"] = p;
        dict["primeOneShuffle"] = p1Split;
        dict["primeTwoShuffle"] = p2Split;
        dict["gudPrimeOneChoice"] = p1Split.indexOf(1);
        dict["gudPrimeTwoChoice"] = p2Split.indexOf(1);
        dict["primeOneSymbols"] = symbolTriple();
        dict["primeTwoSymbols"] = symbolTriple();
        dict["targetSymbols"] = symbolTriple();
        trials.push(dict);
      }
    }
  }
}

console.log('trial length')
console.log(trials.length)

/* We've now got an array of trial dictionaries.
   The next thing to do is shuffle these. This is primarily so that
   there is something that the html can access when creating cards.
*/

/* Can modify this to get right number of trials */
var trialOrder = [],
  b = trials.length;
while (b--) {
  trialOrder[b] = 5 //b
}

/* Uncomment to shuffle, but is it deterministic? */
trialOrder = _.shuffle(trialOrder)
//
console.log('to')
console.log(trialOrder)

/*
  So, we can now go through trialOrder in normal fashion to get something randomised.
  This is all rather ugly, but it's the web…
 */

var currentTrial = 0

// console.log(trialOrder)
// console.log('test')
// console.log(trials)
// console.log(trials[9])


function makeCard(canvasid = 'canvas',
  cardspec,
  symTrip = [0, 1, 2]
) {


  total = cardspec[3]
  sym1 = symTrip[0]
  sym2 = symTrip[1]
  sym3 = symTrip[2]
  // console.log('card symTrip input')
  // console.log(symTrip)
  // console.log('card symbols')
  // console.log(sym1)
  // console.log(sym2)
  // console.log(sym3)


  if (cardspec[0] == 0) {
    sym1 = sym3
  }
  if (cardspec[0] == 9) {
    sym2 = sym1
  }
  // if (cardspec[2] != 0) {
  //   sym1 = sym2
  // }

  var rows = (Math.ceil(total / 3));
  var cols = (total / rows);

  /* console.log([rows, cols]) */

  var canvas = document.getElementById(canvasid);
  ctx = canvas.getContext("2d");
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  var W = 300,
    H = 1.2 * W;
  canvas.width = W, canvas.height = H;


  var drawlist = [];
  var strList = [];
  if (total == 1) {
    drawlist.push(sym1)
  } else {
    for (i = 1; i <= rows * (cols - 1); i++) {
      drawlist.push(sym1)
    }

    for (j = 1; j <= rows; j++) {
      strList.push(sym2)
    }
  }

  // randomise false placement
  if (Math.random() >= 0.5) {
    drawlist = drawlist.concat(strList)
  } else {
    drawlist = strList.concat(drawlist)
  }

  /* console.log(drawlist) */

  var symbol = [];
  var symCount = 0;
  if (rows > 1) {
    [rows, cols] = [cols, rows]
  }
  var Wc = W / cols,
    Hr = H / rows


  for (i = 1; i <= rows; i++) {
    for (j = 1; j <= cols; j++) {
      symbol[i] = {
        y: (Math.floor((i * Hr) - Hr / 2)),
        x: (Math.floor((j * Wc) - Wc / 2)),
        color: "black",
        unisym: drawlist[symCount],
        draw: symbols,
      };
      symCount++;
      var s = symbol[i];
      s.draw(s.x, s.y, s.color, s.unisym);
    }
  }

  function symbols(x, y, color, unisym) {
    ctx.font = "36px sans-serif";
    ctx.fillStyle = color;
    textDimensions = ctx.measureText(unisym);
    x = (x - (textDimensions.width / 2))
    ctx.fillText(unisym, x, y);
  }
}

function symIndexTripleToUnicode(triple) {
  return triple.map(x => symlist[x])
}

function symIndexTripleToText(triple) {
  return triple.map(x => symText[x])
}


function getSymbols(symTrip) {

  let sym1 = symTrip[0]
  let sym2 = symTrip[1]
  let sym3 = symTrip[2]

  exp.sym1 = symlist[sym1];
  exp.sym2i = symlist[sym2];
  exp.sym3 = symlist[sym3];
  exp.sym1t = symText[sym1];
  exp.sym2t = symText[sym2];
  exp.sym3t = symText[sym3];
}



function symbolTriple() {

  let indicies = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  return _.sample(indicies, 3)

  /* A less effective way to do things */

  // let sym1i = Math.floor((Math.random() * 10))
  // let sym2i = Math.floor((Math.random() * 10))
  // let sym3i = Math.floor((Math.random() * 10))
  // while (sym1i == sym2i) {
  //   sym2i = Math.floor((Math.random() * 10))
  // }
  // while (sym1i == sym3i | sym2i == sym3i) {
  //   sym3i = Math.floor((Math.random() * 10))
  // }
  // return [sym1i, sym2i, sym3i]
}

function specifyCards(trialDict) {

  primeCat = trialDict["prime"]
  targetCat = trialDict["target"]
  strength = trialDict["strength"]
  primeOne = trialDict["primeOneShuffle"].slice(0) // deep copy cuz modifying
  primeTwo = trialDict["primeTwoShuffle"].slice(0) // again
  primeOneSymbols = symIndexTripleToUnicode(trialDict["primeOneSymbols"])
  primeTwoSymbols = symIndexTripleToUnicode(trialDict["primeTwoSymbols"])
  targetSymbols = symIndexTripleToUnicode(trialDict["targetSymbols"])
  console.log('prime one symbols')
  console.log(primeOneSymbols)

  someStrong = trialCards["someStrong"];
  someWeak = trialCards["someWeak"];
  someFalse = trialCards["someFalse"];
  fourStrong = trialCards["fourStrong"];
  fourWeak = trialCards["fourWeak"];
  fourFalse = trialCards["fourFalse"];
  adhocStrong = trialCards["adhocStrong"];
  adhocWeak = trialCards["adhocWeak"];
  adhocFalse = trialCards["adhocFalse"];

  if (strength == 0) { // if weak
    if (primeCat == 0) {
      // choice = [someWeak, someFalse]
      primeOne[primeOne.indexOf(0)] = someFalse
      primeOne[primeOne.indexOf(1)] = someWeak
      primeTwo[primeTwo.indexOf(0)] = someFalse
      primeTwo[primeTwo.indexOf(1)] = someWeak
    } else if (primeCat == 1) {
      // choice = [fourWeak, fourFalse]
      primeOne[primeOne.indexOf(0)] = fourFalse
      primeOne[primeOne.indexOf(1)] = fourWeak
      primeTwo[primeTwo.indexOf(0)] = fourFalse
      primeTwo[primeTwo.indexOf(1)] = fourWeak
    } else {
      // choice = [adhocWeak, adhocFalse]
      primeOne[primeOne.indexOf(0)] = adhocFalse
      primeOne[primeOne.indexOf(1)] = adhocWeak
      primeTwo[primeTwo.indexOf(0)] = adhocFalse
      primeTwo[primeTwo.indexOf(1)] = adhocWeak
    }
  } else { // if strong
    if (primeCat == 0) {
      // choice = [someStrong, someWeak]
      primeOne[primeOne.indexOf(0)] = someWeak
      primeOne[primeOne.indexOf(1)] = someStrong
      primeTwo[primeTwo.indexOf(0)] = someWeak
      primeTwo[primeTwo.indexOf(1)] = someStrong
    } else if (primeCat == 1) {
      // choice = [fourStrong, fourWeak]
      primeOne[primeOne.indexOf(0)] = fourWeak
      primeOne[primeOne.indexOf(1)] = fourStrong
      primeTwo[primeTwo.indexOf(0)] = fourWeak
      primeTwo[primeTwo.indexOf(1)] = fourStrong
    } else {
      // choice = [fourStrong, fourWeak]
      primeOne[primeOne.indexOf(0)] = adhocWeak
      primeOne[primeOne.indexOf(1)] = adhocStrong
      primeTwo[primeTwo.indexOf(0)] = adhocWeak
      primeTwo[primeTwo.indexOf(1)] = adhocStrong
    }
  }

  if (targetCat == 0) {
    targetL = someStrong;
  } else if (targetCat == 1) {
    targetL = fourStrong;
  } else {
    targetL = adhocStrong;
  }

  /* … and gen the cards */
  makeCard(canvasid = 'primeOneL', primeOne[0], primeOneSymbols)
  makeCard(canvasid = 'primeOneR', primeOne[1], primeOneSymbols)
  makeCard(canvasid = 'primeTwoL', primeTwo[0], primeTwoSymbols)
  makeCard(canvasid = 'primeTwoR', primeTwo[1], primeTwoSymbols)
  makeCard(canvasid = 'targetL', targetL, targetSymbols)
  makeCard(canvasid = 'targetR', trialCards["target"], targetSymbols)
}


function conditionSentence(condition, symbol) {

  condText = "" + symPre[condition] + " " + symText[symbol]
  if (condition != 2) {
    condText += "s"
  }
  return condText
}

// console.log('current trail')
// console.log(trials[currentTrial])
// console.log('done')