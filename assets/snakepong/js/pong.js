//javascript made easier with jQuery :)

//vars of html objects
var grid = document.getElementById('grid');
var puck1 = document.getElementById('puck1');
var puck2 = document.getElementById('puck2');
var ball = document.getElementById('ball');
var score1 = document.getElementById('score1');
var score2 = document.getElementById('score2');
var winMsg = document.getElementById('winMsg');
    //buttons for touch
var up1 = document.getElementById('up1');
var up2 = document.getElementById('up2');
var down1 = document.getElementById('down1');
var down2 = document.getElementById('down2');
//variable variables
var w = h = 500;
var margin = 15;
var puckLength = 50;
var puckThicc = 5;
var ballDia = 10;
var framerate = 1000 / 10;
var moveDist = 50;
var bolaSpeed = 70;
var yWeight = 10, xWeight = 20; //setting weight
var winScore = winScoreC = 3, winScoreP = 7;
var cpuDelay = 100;
//variables i'm setting later
var yDir = xDir = 0;
var touchY = touchX = 0;
var p1Score = p2Score = 0;
var cpuMoveDist = 0;
    //width from inspecting
    //changes with width of child elements and padding of main
var desiredWidth = 560;
//int to store ids
var control, coll;
//bools
var keyState = [];
var ballStarted = false;
var cpuMode = true;
var touch = false;

//js media query?
if (window.innerWidth < desiredWidth)
{
    w = h = w + window.innerWidth - desiredWidth;
    if (w < 400)
    {
        //reduce ball and movespeed for small screens
        bolaSpeed *= 0.75;
        moveDist *= 0.75;
    }
}

//on load
$(document).ready(function(){
    //setting up elements, basically css with calculations
        //grid
    grid.style.position = "relative";
    grid.style.width = w + "px";
    grid.style.height = h + "px";
    grid.style.backgroundColor = "#000000";
        //pucks and ball
    puck1.style.width = puckThicc + 1 + "px";
    puck1.style.height = puckLength + "px";
    puck2.style.width = puckThicc + 1 + "px";
    puck2.style.height = puckLength + "px";
    ball.style.width = ballDia + 1 + "px";
    ball.style.height = ballDia + 1 + "px";
        //misc
    $('#line').height((h - 10) + 'px');
    $('#line').css('left', (w - $('#line').width() - 10) * 0.5 + 'px');
    score1.style.left = '30%';
    score2.style.right = '30%';
    winMsg.style.top = (h - winMsg.offsetHeight) * 0.5 + 5 + 'px';
    $('#winMsg').hide();
    $('.option').hide();
        //mobile buttons
    up1.style.left = '5%';
    down1.style.left = '5%';
    up2.style.right =  '5%';
    down2.style.right = '5%';
    up1.style.bottom = '15%';
    down1.style.bottom = '5%';
    up2.style.bottom = '15%';
    down2.style.bottom = '5%';
        //current mode
    if (!cpuMode)
    {
        $('#btnP').html("PvP&#10004;");
        $('#btnC').html("PvC");
        winScore = winScoreP;
    }

    //tracking keystate
    $(document).on('keydown', function(e){
        keyState[e.keyCode] = true;
        if (e.keyCode >= 37 && e.keyCode <= 40 || e.keyCode == 32)
        {
            e.preventDefault();
        }
    });
    $(document).on('keyup', function(e){
        keyState[e.keyCode] = false;
        if (e.keyCode == 32 && !ballStarted) BallInit();
    });

    //touch input
        //checks if device has touch
    $(document).on('touchstart', function(){
        touch = true;
        //turn off this touchstart
        $(document).off('touchstart');
        //display arrows
        up1.style.display = 'block';
        down1.style.display = 'block';
        if (!cpuMode)
        {
            up2.style.display = 'block';
            down2.style.display = 'block';
        }
        //to start ball
        $('#grid').on('touchstart', function(){
            if (!ballStarted) BallInit();
        });
        AddTouchEvents();
    });

    //event listener for mode
    $('.modeMenu').on('click', function(e){
        $('.option').slideDown("fast");
    });
    $('#btnP').on('click', function(){
        cpuMode = false;
        ScoreReset();
        ResetPos();
        winScore = winScoreP;
        //to indicate selction
        $('#btnP').html("PvP&#10004;");
        $('#btnC').html("PvC");
        //displaying touch controls for p2
        if (touch)
        {
            up2.style.display = 'block';
            down2.style.display = 'block';
        }
        //closing mode menu
        setTimeout(function(){
            $('.option').slideUp("fast");
        }, 100);
    });
    $('#btnC').on('click', function(){
        cpuMode = true;
        ScoreReset();
        ResetPos();
        winScore = winScoreC;
        //to indicate selction
        $('#btnP').html("PvP");
        $('#btnC').html("PvC&#10004;");
        //hiding touch controls for p2
        if (touch)
        {
            up2.style.display = 'none';
            down2.style.display = 'none';
        }
        //closing mode menu
        setTimeout(function(){
            $('.option').slideUp("fast");
        }, 100);
    });
    

    /********START GAME LOOPS HERE********/
    ResetPos();
    RuntimeLoops();

    function ResetPos()
    {
        //stopping puck and ball animations
        $('#puck1').stop();
        $('#puck2').stop();
        $('#ball').stop();
        //(re)setting up pucks and ball
        ballStarted = false;
        puck1.style.left = margin + "px";
        puck1.style.top = (h - puckLength - 2) * 0.5  + "px";
        puck2.style.left = (w - puckThicc + 1 - margin - 1) + "px"; // -1 from border
        puck2.style.top = (h - puckLength - 2) * 0.5  + "px";
        ball.style.left = (w - ballDia - 3) * 0.5 + "px"; //-2 from border
        ball.style.top = (h - ballDia - 3) * 0.5 + "px"; //-2 from border
        //remove animation
        winMsg.innerHTML = "";
    }
    
    //game loop
    function RuntimeLoops()
    {
        control = setInterval(Control, framerate * 0.5);
        coll = setInterval(CollCheck, framerate * 0.25);
    }

    //player controls
    function Control()
    {
        //player1
        if (keyState[87]) //w
            Move1(-1);
        else if (keyState[83]) //s
            Move1(1);
        //player2
        if (!cpuMode)
        {
            if (keyState[38]) //up
                Move2(-1);
            else if (keyState[40]) //down
                Move2(1);
        }
        //cpu
        else if (ballStarted)
        {
            MoveCPU(); 
        }
    }

    //animating the pucks
    function Move1(dir)
    {
        $('#puck1').stop().animate({top: '+=' + (dir * moveDist) + 'px'}, framerate, 'linear');
    }
    function Move2(dir)
    {
        $('#puck2').stop().animate({top: '+=' + (dir * moveDist) + 'px'}, framerate, 'linear');
    }
    function MoveCPU()
    {
        //it has input lagg
        //move distance determined by differnece of 
        //distance between y coordiate of ball and y coordinate of puck
        setTimeout(function(){
            cpuMoveDist = ($('#ball').position().top + (ballDia * 0.5)) - ($('#puck2').position().top + (puckLength * 0.5));
        }, cpuDelay);
        $('#puck2').stop().animate({top: '+=' + cpuMoveDist + 'px'}, framerate, 'linear');
    }

    //checking for collisions
    function CollCheck()
    {
        //border and puck1
        if ($('#puck1').position().top < 0)
        {
            $('#puck1').stop();
            $('#puck1').animate({top: (margin * 0.5) + "px"}, framerate * 0.25);
        }
        else if ($('#puck1').position().top > h - puckLength)
        {
            $('#puck1').stop();
            $('#puck1').animate({top: (h - puckLength - (margin * 0.5) - 2) + "px"}, framerate * 0.25);
        }

        //border and puck2
        if ($('#puck2').position().top < 0)
        {
            $('#puck2').stop();
            $('#puck2').animate({top: (margin * 0.5) + "px"}, framerate * 0.25);
        }
        else if ($('#puck2').position().top > h - puckLength)
        {
            $('#puck2').stop();
            $('#puck2').animate({top: (h - puckLength - (margin * 0.5) - 2) + "px"}, framerate * 0.25);
        }

        //ball and pucks
        if ($('#ball').position().left <= $('#puck1').position().left + puckThicc && $('#ball').position().left >= (margin * 0.5))
        {
            if ($('#ball').position().top + ballDia * 0.5 >= $('#puck1').position().top && $('#ball').position().top + ballDia * 0.5 <= $('#puck1').position().top + puckLength)
            {
                $('#puck1').stop();
                $('#ball').stop();
                xDir = 1
                BallMove(yNonce, xNonce, yDir, xDir);
            }
        }
        else if ($('#ball').position().left + ballDia >= $('#puck2').position().left && $('#ball').position().left + ballDia <= w - (margin * 0.5))
        {
            if ($('#ball').position().top + ballDia * 0.5 >= $('#puck2').position().top && $('#ball').position().top + ballDia * 0.5 <= $('#puck2').position().top + puckLength)
            {
                $('#puck2').stop();
                $('#ball').stop();
                xDir = -1
                BallMove(yNonce, xNonce, yDir, xDir);
            }
        }
        //border and ball, scoring takes priority
        else if ($('#ball').position().left < margin * 0.5)
        {
            $('#ball').stop();
            p2Score++;
            score2.innerHTML = '0' + p2Score; 
            WinCheck();
        }
        else if ($('#ball').position().left > w - ballDia - margin * 0.5)
        {
            $('#ball').stop();
            p1Score++;
            score1.innerHTML = '0' + p1Score;
            WinCheck();
        }
        else if ($('#ball').position().top - ballDia * 0.5 < 0)
        {
            $('#ball').stop();
            yDir = 1;
            BallMove(yNonce, xNonce, yDir, xDir);
        }
        else if ($('#ball').position().top > h - ballDia * 2)
        {
            $('#ball').stop();
            yDir = -1;
            BallMove(yNonce, xNonce, yDir, xDir);
        }
    }

    //initialize ball, generate random values for speed, direction
    function BallInit()
    {
        ballStarted = true;
        var randomMutation = Math.random();
        yNonce = yWeight * randomMutation;
        xNonce = xWeight * randomMutation;
        yDir = Math.round(Math.random()) * 2 - 1; //-1 or 1
        xDir = Math.round(Math.random()) * 2 - 1; //-1 or 1
        BallMove(yNonce, xNonce, yDir, xDir);
    }

    //ball movement, recursive callback
    function BallMove(nonceT, nonceL, signT, signL)
    {
        //randomising direction slightly using nonce and the signs
        $('#ball').stop().animate({
            top: '+=' + (signT * (nonceT + bolaSpeed) + 'px'),
            left: '+=' + (signL * (nonceL + bolaSpeed) + 'px')},
            framerate * 4, 'linear', 
            function(){BallMove(yNonce, xNonce, yDir, xDir);});
    } 

    //checks who wins
    function WinCheck()
    {
        //Win condition 
        if (p1Score >= winScore || p2Score >= winScore)
        {
            if (p1Score > p2Score)
                Win(1);
            else
                Win(2); 
        }
        else ResetPos();
    }

    //resets the score to 0
    function ScoreReset()
    {
        p1Score = p2Score = 0;
        score1.innerHTML = '0' + p1Score;
        score2.innerHTML = '0' + p2Score;
    }
    //calls the appropriate animation
    function Win(winner)
    {
        // override the bool set in Reset
        ballStarted = true;
        //disable any controls and collision detection
        clearInterval(control);
        clearInterval(coll);

        if (!(winner - 1))
            AnimateWin("PLAYER 1 WINS");
        else
            AnimateWin("PLAYER 2 WINS")

            //reset for next match
        setTimeout(function(){
            //fadeout animation
            $('#winMsg').fadeOut(250, "swing");
            //reset score
            ScoreReset();
            // reset bool
            ballStarted = false;
            ResetPos();
            RuntimeLoops(); //to restart the intervals / loops
        }, 2500);
        
    }

    //animation for victory
    function AnimateWin(string)
    {
        //empties the html
        winMsg.innerHTML = "";
        for (var i = 0; i < string.length; i++)
        {
            //fill it up while injecting span
            winMsg.innerHTML += "<span id = \"temp"+ i +"\">"+ string[i] +"</span>";
            //animating the span
            var letter = document.getElementById("temp" + i);
            letter.style.animationName = "you_win";
            letter.style.animationDuration = "1s";
            letter.style.animationDelay = i * (1 / 50) + "s";
            letter.style.animationIterationCount = "infinite";
            $('#winMsg').fadeIn(250, "swing");
        }
    }

    function AddTouchEvents()
    {
    //touch buttons, each one has touchstart and touchend

        up1.addEventListener('touchstart', function(){
            Move1(-1);
            keyState[87] = true;
        });
        up1.addEventListener('touchend', function(){
            keyState[87] = false;
        });
        down1.addEventListener('touchstart', function(){
            Move1(1);
            keyState[83] = true;
        });
        down1.addEventListener('touchend', function(){
            keyState[83] = false;
        });
        up2.addEventListener('touchstart', function(){
            if (!cpuMode) Move2(-1);
            keyState[38] = true;
        });
        up2.addEventListener('touchend', function(){
            keyState[38] = false;
        });
        down2.addEventListener('touchstart', function(){
            if (!cpuMode) Move2(1);
            keyState[40] = true;
        });
        down2.addEventListener('touchend', function(){
            keyState[40] = false;
        });
    }
})