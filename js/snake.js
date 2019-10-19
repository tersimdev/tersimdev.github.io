//pure javascript :) 

//hammer.js for touch control
try {
    var options = {dragLockToAxis: true, 
                   dragBlockHorizontal: true, 
                  preventDefault: true,
                  inputClass: Hammer.TouchInput}
   var hammertap = new Hammer(document.getElementById('grid'));
   var hammertime = new Hammer(document, options);
   hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL , velocity: 0.1, threshold: 1});
} catch(e) {
    alert('Hammer.js not found, meaning no mouse/touch inputs sorry :(');
}
    
//defining grid (canvas)
var grid = document.getElementById('grid');
//setting context
var ctx =  grid.getContext('2d');
//score element
var scoreCount = document.getElementById('score');
//highscore elements
var hScore = document.getElementById('hscore');

//variable variables
var w = h = 500;
var maxX, maxY;
var tileSize = 25;
var borderSize = 5;
var framerate = 1000/10;
var defaultLength = 3;
var resetScore = false;
//snek arrays
var snakeLength;
var snake = [];
var snakeHead = [];
//int coords
const initX = 0;
const initY = 0;
var dirX = 1;
var dirY = 0;
var appleX, appleY;
var appleXPrev, appleYPrev;
//int to store ids
var play, col, score;
//collision bools
var borderColl, appleColl, appleOnSnake;
//score tracker
var currentScore = 0;
var highScore = 0;
try {
    highScore = localStorage.getItem("HighScore");
    if (localStorage.getItem("HighScore") == null)
    {
        highScore = 0;
    }
} catch(e) {
    alert("LocalStorage seems to be not supported, meaning highscore won't be saved :(");
    highScore = 0;
}

//setting up elements
//js media query?
if (window.innerWidth < w + tileSize)
{
    w = h = (w - tileSize - (Math.round((w + tileSize - window.innerWidth) / tileSize) * tileSize)); 
}
while (w > document.getElementsByClassName('nav')[0].clientWidth)
{
    w = h = (w - tileSize);
}
grid.width = w;
grid.height = h;
maxX = w / tileSize - 1;
maxY = h / tileSize - 1;
hScore.innerHTML = "HIGHSCORE: " + highScore;

//start play
Start();

//initialize
function Start()
{
    //reset grid
    ctx.fillStyle = '#000000';
    ctx.fillRect (0,0,grid.width,grid.height);
    //reset score display
    scoreCount.innerHTML = "--PRESS ANY KEY TO START--";
    scoreCount.style.animationName = "score_fade";
    scoreCount.style.animationDuration = "1s";
    //update highscore
    hScoreUpdate();
    //reset snake
    snake.length = 0;
    snakeLength = defaultLength;
    //intializing snake
    for (var i = 0; i < snakeLength; i++)
    {
        DrawSnakeOne(initX + i, initY);
    }
    //spawns an apple (duh)
    SpawnApple();
    //reseting directions
    dirX = 1;
    dirY = 0;
    //removing controls event
    document.removeEventListener ('keydown', Control);
    //adding play event
    document.addEventListener ('keydown', Play);
    //hammer.js
    try {
    //tap starts game
    hammertap.on('tap', function(){Play(-999);});
    //turn off swipe events
    hammertime.off('swipeup swipedown swipeleft swiperight');
    } catch(e) {}
}

function Reset()
{
    //calls Start to reinitialize important variables
    setTimeout(Start, 1000)
    //stops functions
    clearInterval(play);
    clearInterval(col);
    clearInterval(score);
}

function Play(e)
{
    //ignore certain keys - shift, ctrl and alt
    //e = -999 is for hammer.js, because hammer doesnt have keycode
    if (e == -999 || e.keyCode < 16 || e.keyCode > 18)
    {
        //prevent scrollbar from scrolling
        if (e != -999 && e.keyCode >= 37 && e.keyCode <= 40)
        {
            e.preventDefault();
        }
        //starting intervals for key functions
        play = setInterval('MoveSnake(dirX, dirY)', framerate);
        col = setInterval(CheckColl, framerate);
        score = setInterval(ScoreDisplay, framerate * 2);
        //removing play event
        document.removeEventListener ('keydown', Play);
        //adding controls event
        document.addEventListener('keydown', Control);
        //stopping scorecounter animation
        scoreCount.style.animationName = "none";
        scoreCount.style.animationDuration = "0s";
        //removing highscore animation
        hScore.innerHTML = "HIGHSCORE: " + highScore;
        //hammer.js
        try {
        //turn off tap event
        hammertap.off('tap');
        //changes direction for each swipe event
        hammertime.on('swipeup swipedown swipeleft swiperight', function(ev){TouchControl(ev);});
        } catch(e) {}
    }
}

function Control(event)
{
    switch(event.keyCode)
    {
        case 65: //a
        case 37: //left
            dirX = -1;
            dirY = 0;
            event.preventDefault();
            break;
        case 87: //w
        case 38: //up
            dirX = 0;
            dirY = -1;
            event.preventDefault();
            break;
        case 68: //d
        case 39: //right
            dirX = 1;
            dirY = 0;
            event.preventDefault();
            break;
        case 83: //s
        case 40: //down
            dirX = 0;
            dirY = 1;
            event.preventDefault();
            break;
     }
}
//for hammer.js
function TouchControl(ev)
{
    switch(ev.type)
    {
        case "swipeleft":
            dirX = -1;
            dirY = 0;
            break;
        case "swipeup":
            dirX = 0;
            dirY = -1;
            break;
        case "swiperight":
            dirX = 1;
            dirY = 0;
            break;
        case "swipedown":
            dirX = 0;
            dirY = 1;
            break;
    }
}

//drawing of snake tiles
function DrawSnakeOne(x, y)
{
    ctx.fillStyle = '#33CC33';
    ctx.fillRect
    (
        (x * tileSize),
        (y * tileSize), 
        tileSize, tileSize
    );
    //border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = borderSize;
    ctx.strokeRect
    (
        (x * tileSize),
        (y * tileSize), 
        tileSize, tileSize
    );
    
    snake.push([x, y]);
    snakeHead = snake[snakeLength - 1];
}

function DelSnakeOne()
{
    ctx.fillStyle = '#000000';
    ctx.fillRect
    (
        (snake[0][0] * tileSize),
        (snake[0][1] * tileSize),
        tileSize, tileSize
    )
    snake.shift();
}

//spawning of apple
function SpawnApple()
{
    //randomizing coords
    appleX = Math.round(Math.random() * maxX);
    appleY = Math.round(Math.random() * maxY);
    //checking if apple is on snake or apple on eaten apple
    for (var i = 0; i < snake.length; i++)
    {
        if (appleX == snake[i][0] && appleY == snake[i][1] || appleX == appleXPrev && appleY == appleYPrev)
        {
            appleOnSnake = true;
            return SpawnApple();
        }
        else
        {
            appleOnSnake = false
        }
    }
    //draw apple only after being checked and altered
    if (!appleOnSnake)
    {
        //update prev apple coords
        appleXPrev = appleX;
        appleYPrev = appleY;
        
        ctx.fillStyle = '#CC3333';
        ctx.fillRect
        (
            (appleX * tileSize),
            (appleY * tileSize), 
            tileSize, tileSize
        );
        //border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = borderSize;
        ctx.strokeRect
        (
            (appleX * tileSize),
            (appleY * tileSize), 
            tileSize, tileSize
        );
    }
}

//repeatedly-called functions
function MoveSnake(x, y)
{
    //check if snake is going into itself
    if (snakeHead[0] + x 
        == snake[snakeLength - 2][0] 
        && snakeHead[1] + y 
        == snake[snakeLength - 2][1])
    {
        x *= -1;
        y *= -1;
    }
    CheckColl(x, y);
    if (!borderColl)
    {
        if (!appleColl) // only del when no apple eaten
        {
            DelSnakeOne();
        }
        else // update length of snake, because of dependencies
        {
            snakeLength++;
        }
        DrawSnakeOne(snakeHead[0] + x, snakeHead[1] + y);
    }
}

function CheckColl(x, y)
{
    //check if snake collides with itself
    for (var i = 0; i < snake.length - 1; i++)
    {
        if (snakeHead[0] + x == snake[i][0] && snakeHead[1] + y == snake[i][1])
        {
            Reset();
        }
    }
    //check if snake collide with border
    if (snakeHead[0] + x < 0 ||
        snakeHead[0] + x > maxX||
        snakeHead[1] + y < 0 || 
        snakeHead[1] + y > maxY)
    {
        Reset();
        borderColl = true;
    }
    else
    {
        borderColl = false;
    }
    //check if snake ate apple
    if (snakeHead[0] + x == appleX && snakeHead[1] + y == appleY)
    {
        appleColl = true;
        SpawnApple(); 
    }
    else
    {
        appleColl = false;
    }
}

function ScoreDisplay() //displays current score
{
    currentScore = snakeLength - defaultLength;
    scoreCount.innerHTML = currentScore;
}

function hScoreUpdate() //checks if highscore is beaten
{
    //reset highscore for debug
    if (resetScore)
    {
        localStorage.setItem("HighScore", 0);
    }
    //update highscore if it is beaten
    if (currentScore > highScore)
    {
        highScore = currentScore;
        try
        {
        localStorage.setItem("HighScore", highScore);
        } catch(e) {}
        animateHScore("NEW HIGHSCORE: " + highScore);
    }
}

function animateHScore(string)
{
    //only run this if a highscore has been set
     //empties the html
    hScore.innerHTML = "";
    for (var i = 0; i < string.length; i++)
    {
        //fill it up while injecting span
        hScore.innerHTML += "<span id = \"temp"+ i +"\">"+ string[i] +"</span>";
        //animating the span
        var letter = document.getElementById("temp" + i);
        letter.style.animationName = "new_highscore";
        letter.style.animationDuration = "1s";
        letter.style.animationDelay = i * (1 / 25) + "s";
        letter.style.animationIterationCount = "infinite";
    }
}
