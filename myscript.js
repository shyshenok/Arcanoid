var RIGHT_BUTTON = 39;
var LEFT_BUTTON = 37;
var BALL_RADIUS = 10;


var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext("2d");

var x = canvas.width/2;
var y = canvas.height-30;

var dx = 2;
var dy = -2;

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;

var rightPressed = false;
var leftPressed = false;

// var brickRowCount = 3;
// var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;

var lives = 4;


var bricks = [[0, 1, 1, 0, 1, 1, 0],
              [1, 1, 1, 1, 1, 1, 1],
              [0, 1, 1, 1, 1, 1, 0],
              [0, 0, 1, 1, 1, 0, 0],
              [0, 0, 0, 1, 0, 0, 0]];
 for(r=0; r<bricks.length; r++) {
    for(c=0; c<bricks[r].length; c++) {
        if (bricks[r][c] == 1) {
            bricks[r][c] = {x:0, y:0, status: 1}
        } else {
            bricks[r][c] = {status: 0}
        }
    }
}    

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}


function drawBall() {
    ctx.beginPath();
	ctx.arc(x, y, BALL_RADIUS, 0, Math.PI*2);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(r=0; r<bricks.length; r++) {
        for(c=0; c<bricks[r].length; c++) {
            if(bricks[r][c].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[r][c].x = brickX;
                bricks[r][c].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}


function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall();
	drawBricks();
	drawPaddle();
	collisionDetection();
	drawScore();
	drawLives();

	if(x + dx > canvas.width - BALL_RADIUS || x + dx < BALL_RADIUS) {
        dx = -dx;
    }

	if(y + dy < BALL_RADIUS) {
	    dy = -dy;
	} else if(y + dy > canvas.height - BALL_RADIUS) {

		if(x > paddleX && x < paddleX + paddleWidth) {
        	dy = -dy;
    	} else {
    		lives--;
			if(!lives) {
			    alert("GAME OVER");
			    document.location.reload();
			}
			else {
			    x = canvas.width/2;
			    y = canvas.height-30;
			    dx = 2;
			    dy = -2;
			    paddleX = (canvas.width-paddleWidth)/2;
			}
    	}
	}

	x += dx;
	y += dy;

	if(rightPressed && paddleX < canvas.width-paddleWidth) {
	    paddleX += 7;
	}
	else if(leftPressed && paddleX > 0) {
	    paddleX -= 7;
	}

	requestAnimationFrame(draw);

}
draw();

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);


function keyDownHandler(e) {
    if(e.keyCode == RIGHT_BUTTON) {
        rightPressed = true;
    }
    else if(e.keyCode == LEFT_BUTTON) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == RIGHT_BUTTON) {
        rightPressed = false;
    }
    else if(e.keyCode == LEFT_BUTTON) {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function collisionDetection() {
    for(r=0; r<bricks.length; r++) {
        for(c=0; c<bricks[r].length; c++) {
            var b = bricks[r][c];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    // if(score == brickRowCount*brickColumnCount) {
                    //     alert("YOU WIN, CONGRATULATIONS!");
                    //     document.location.reload();
                    // }
                }
            }
        }
    }
}