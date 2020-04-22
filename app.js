
/*
* Main canvas gaming space
*/
var context;
/*
* Pacman position
*/
var pacmanPosition = new Object();
/*
* Board for Pacman, food and special food - all have a single interaction between them
*/
var pacmanBoard;
/*
* Board for the non-playable characters - interact only with pacman (do not interact withe the food and with each other)
*/
var npcBoard;

/*
* game score
*/
var score;
var pac_color;
var start_time;
var time_elapsed;
var moveInterval;

var isMouthOpen = true;

var lastKeyPressed = 39;


const cellType = { BLANK: "blank", WALL: "wall", FOOD: "food:", PACMAN: "pacman", ENEMY: "enemy" };
Object.freeze(cellType);


var cellSize = 60;

//Definitions
var upKeyCode = 38;
var downKeyCode = 40;
var leftKeyCode = 37;
var rightKeyCode = 39;
var foodAmount = 50;
var lowColor = "#ff0000";
var medColor = "#E9FF00";
var highColor = "#00FF1B";
var timeLimit = 60;
var enemiesAmount = 2;


$(document).ready(function () {
    //context = canvas.getContext("2d");
    //Start();
    startDefs();
});

function startDefs() {
    $("#chooseKeysDiv>:button").click(function (e) { keySelection(this.id); });
    $("#randomButton").click(function (e) { randomizeDefs(); });
    $("#startButton").click(function (e) { startGame(); });
}



function startGame() {
    context = canvas.getContext("2d");
    initGameEnvironment();
      
    startBoard();
    //updating the user postion - also impacts player's speed
    moveInterval = setInterval(UpdatePosition, 140);

    //switchDevs
    $("#defsForm").hide();
    $("#game").show();
}

function initGameEnvironment() {
    keysDown = {};
    //The keydown event is fired when a key is pressed. Unlike the keypress event, the keydown event is fired for all keys, regardless of whether they produce a character value
    addEventListener("keydown", function(e) { keysDown[e.keyCode] = true; }, false);
    //The keyup event occurs when the user releases a key
    addEventListener("keyup", function (e) { keysDown[e.keyCode] = false; }, false);
    //update values
    foodAmount = $("#foodQuantity").val();
    medColor = $("#medScoreColor").val();
    lowColor = $("#lowScoreColor").val();
    highColor = $("#highScoreColor").val();
    timeLimit = $("#timeLimitNum").val();
    enemiesAmount = $("#enemiesQuantity").val();
}

/*
 * Handels the key selection keys being pressed. 
 * Captures a single key stroke and updates the relevent key code.
 */
function keySelection(buttonID) {
    var button = $("#" + buttonID);
    button.keydown(function (event) {
        button.prop("value", event.key);
        switch (buttonID) {
            case "upKeybutton":
                upKeyCode = event.keyCode;
                break;
            case "downKeybutton":
                downKeyCode = event.keyCode;
                break;
            case "leftKeybutton":
                downKeyCode = event.keyCode;
                break;
            case "rightKeybutton":
                downKeyCode = event.keyCode;
                break;
        }
        button.off("keydown");
    });
}

/*
 * Randomize values for the game definitions.
 */ 
function randomizeDefs() {
    //food quantity
    foodAmount = getRandomInt(50, 90);
    //colors
    lowColor = getRandomColor();
    medColor = getRandomColor();
    highColor = getRandomColor();
    //time limit
    timeLimit = getRandomInt(60, 360);
    //enemies
    enemiesAmount = getRandomInt(1, 4);

    //update DOM
    $("#foodQuantity").prop("value", foodAmount);
    $("#lowScoreColor").prop("value", lowColor);
    $("#medScoreColor").prop("value", medColor);
    $("#highScoreColor").prop("value", highColor);
    $("#timeLimitNum").prop("value", timeLimit);
    $("#enemiesQuantity").prop("value", enemiesAmount);

}

function initBoards() {

}

function startBoard() {
    board = new Array(); //new game board
    score = 0;
    pac_color = "yellow";
    var cnt = 100;
    var food_remain = foodAmount;
    var pacman_remain = 1;
    start_time = new Date();
    for (var i = 0; i < 10; i++) {
        board[i] = new Array();
        //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
        for (var j = 0; j < 10; j++) {
            if ((i == 3 && j == 3) ||
                (i == 3 && j == 4) ||
                (i == 3 && j == 5) ||
                (i == 6 && j == 1) ||
                (i == 6 && j == 2)) {
                board[i][j] = cellType.WALL; //Wall=4
            }
            else {
                var randomNum = Math.random();
                if (randomNum <= (1.0 * food_remain) / cnt) {
                    food_remain--;
                    board[i][j] = cellType.FOOD; //food = 1
                }
                else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
                    pacmanPosition.i = i;
                    pacmanPosition.j = j;
                    pacman_remain--;
                    board[i][j] = cellType.PACMAN; //pacman = 2
                }
                else {
                    board[i][j] = cellType.BLANK; //blank = 0
                }
                cnt--;
            }
        }
    }
    while (food_remain > 0) {
        var emptyCell = findRandomEmptyCell(board);
        board[emptyCell[0]][emptyCell[1]] = cellType.FOOD; //food = 1
        food_remain--;
    }
}

function findRandomEmptyCell(board) {
    var i = Math.floor(Math.random() * 9 + 1);
    var j = Math.floor(Math.random() * 9 + 1);
    while (board[i][j] != cellType.BLANK) {
        i = Math.floor(Math.random() * 9 + 1);
        j = Math.floor(Math.random() * 9 + 1);
    }
    return [i, j];
}


function Draw() {
    canvas.width = canvas.width; //clean board
    lblScore.value = score;
    lblTime.value = time_elapsed;
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            //position 
            let center = new Object();
            center.x = i * cellSize + 30;
            center.y = j * cellSize + 30;
            if (board[i][j] == cellType.PACMAN) {
                drawPacman(center);
            } else if (board[i][j] == cellType.FOOD) {
                context.beginPath();
                context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
                context.fillStyle = "Black"; //color
                context.fill();
            } else if (board[i][j] == cellType.WALL) {
                context.beginPath();
                context.rect(center.x - 30, center.y - 30, cellSize, cellSize);
                context.fillStyle = "grey"; //color
                context.fill();
            }
        }
    }
}

function getAngle() {
    switch (lastKeyPressed) {
        case upKeyCode:
            return (-0.5 * Math.PI);
            break;
        case downKeyCode:
            return (0.5 * Math.PI);
            break;
        case leftKeyCode:
            return Math.PI;
            break;
        case rightKeyCode:
            return 0;
        default:
            return 0;
    }
}

function drawPacman(center) {
        //body - half circle
    context.beginPath();
    let angle = getAngle();
    if (!isMouthOpen) {
        context.arc(center.x, center.y, 30, 0.15 * Math.PI + angle, 1.85 * Math.PI + angle);
        isMouthOpen = true;
    }
    else {
        context.arc(center.x, center.y, 30, angle, 1.97 * Math.PI + angle);
        isMouthOpen = false;
    }
    context.lineTo(center.x, center.y);
    context.fillStyle = pac_color; //color
    context.fill();
    //eye
    context.beginPath();
    if (lastKeyPressed == upKeyCode) {
        context.arc(center.x - 15, center.y + 5, 5, angle, 2 * Math.PI + angle); // circle
    } else if (lastKeyPressed == downKeyCode) {
        context.arc(center.x - 15, center.y + 5, 5, angle, 2 * Math.PI + angle); // circle
    } else if (lastKeyPressed == leftKeyCode) {
        context.arc(center.x - 5, center.y - 15, 5, angle, 2 * Math.PI + angle); // !
    } else {
        context.arc(center.x + 5, center.y - 15, 5, angle, 2 * Math.PI + angle); 
    }
    context.fillStyle = "black"; //color
    context.fill();
}

function UpdatePosition() {
    //removing previous location
    board[pacmanPosition.i][pacmanPosition.j] = cellType.BLANK;


    //updating packman location
    movePacman();
    if (board[pacmanPosition.i][pacmanPosition.j] == cellType.FOOD) {
        score++;
    }
    board[pacmanPosition.i][pacmanPosition.j] = cellType.PACMAN;
    
    //updating time
    var currentTime = new Date();
    time_elapsed = (currentTime - start_time) / 1000;

    //Game logic
    if (score >= 20 && time_elapsed <= 10) {
        pac_color = "lime";
    }
    if (score == foodAmount) { //problem?
        window.clearInterval(moveInterval);
        window.alert("Game completed");
    } else {
        Draw();
    }

    function movePacman() {
        if (keysDown[upKeyCode]) {
            if (pacmanPosition.j > 0 && board[pacmanPosition.i][pacmanPosition.j - 1] != cellType.WALL) {
                pacmanPosition.j--;
                lastKeyPressed = upKeyCode;
            }
        }
        if (keysDown[downKeyCode]) {
            if (pacmanPosition.j < 9 && board[pacmanPosition.i][pacmanPosition.j + 1] != cellType.WALL) {
                pacmanPosition.j++;
                lastKeyPressed = downKeyCode;
            }
        }
        if (keysDown[leftKeyCode]) {
            if (pacmanPosition.i > 0 && board[pacmanPosition.i - 1][pacmanPosition.j] != cellType.WALL) {
                pacmanPosition.i--;
                lastKeyPressed = leftKeyCode;
            }
        }
        if (keysDown[rightKeyCode]) {
            if (pacmanPosition.i < 9 && board[pacmanPosition.i + 1][pacmanPosition.j] != cellType.WALL) {
                pacmanPosition.i++;
                lastKeyPressed = rightKeyCode;
            }
        }
    }
}



/*
 * Returns a random integer between min(inclusive) and max(inclusive).
 * from: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
*/
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * Returns a random integer.
 * from: https://stackoverflow.com/questions/1484506/random-color-generator
 * */
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
