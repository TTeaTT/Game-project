var player;
var lives = 3;
var platform1;
var danger1, danger2;
var key, keyGot = false;
var door;
var coin1, coin1Got = false;
var score = 0;


// TIMER
var totalSeconds = 0;
var totalMinutes = 0;
function countTime() {
	totalSeconds++;
	
	//I added minutes as well
	//idk why, but when the seconds are at 0 I can't display it as "0:00", only as "0:0"
	if (totalSeconds<10){
		totalSeconds = "0"+totalSeconds;
	}
	else if (totalSeconds==60){
		totalMinutes++;
		totalSeconds=0;
	}
}
window.setInterval(countTime,1000);
window.clearInterval(countTime);


// FUNCTION TO START THE GAME
function startGame() {
	gameArea.start();
	platform1 = new component(100, 50, "black", gameArea.canvas.width/2, 400)
	danger1 = new component(10, 25, "red", 200, gameArea.canvas.height - 25);
	danger2 = new component(10, 25, "red", 400, gameArea.canvas.height - 25);
	key = new component(65, 41, "img/small_key.png", gameArea.canvas.width/1.5, gameArea.canvas.height - 131, "image");
	door = new component(100, 150, "img/door.png", gameArea.canvas.width - 150,
			window.innerHeight * 0.75 - 150, "image");
	coin1 = new component(30, 30, "img/coin.png", gameArea.canvas.width/3, gameArea.canvas.height - 120, "image");
	player = new component(50, 50, "img/player.png", 10,
			(window.innerHeight * 0.75 - 50), "image");
}

// CREATE A COMPONENT
function component(width, height, color, x, y, type) {
	this.type = type;
	if (type == "image") {
		this.image = new Image();
		this.image.src = color;
	}
	this.width = width;
	this.height = height;
	this.speedX = 0;
	this.speedY = 0;
	this.x = x;
	this.y = y;
	this.jumping = false;
	this.update = function() {
		ctx = gameArea.context;
		ctx.font = "40px Verdana";
		ctx.fillText(("Score: " + score), 10, 50);
		ctx.fillText(("Time: " + totalMinutes + ":" + totalSeconds), 10, 90);
		ctx.fillStyle = "white";
		if (type == "image") {
			ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
		} else {
			ctx.fillStyle = color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
		if(player.y == gameArea.canvas.height - player.height) {
			player.jumping = false;
		}
	}// end this.update
	this.newPos = function() {
		this.speedY += 1.5;
		this.x += this.speedX;
		this.y += this.speedY;
		this.speedY *= 0.95;
		this.hitBottom();
		this.hitLeft();
		this.hitRight();
		
	}// end this.newPos

	this.hitBottom = function() {
		if (player.y > gameArea.canvas.height - player.height) {
			player.y = (gameArea.canvas.height - player.height);
		}
	}

	this.hitLeft = function() {
		if (player.x < 0) {
			player.x = 0;
		}
	}
	this.hitRight = function() {
		if (player.x > gameArea.canvas.width - player.width) {
			player.x = (gameArea.canvas.width - player.width);
		}
	}

	// COLLISION
	this.crashWith = function(otherobj) {
		var myleft = this.x;
		var myright = this.x + (this.width);
		var mytop = this.y;
		var mybottom = this.y + (this.height);
		var otherleft = otherobj.x;
		var otherright = otherobj.x + (otherobj.width);
		var othertop = otherobj.y;
		var otherbottom = otherobj.y + (otherobj.height);
		var crash = true;
		if ((mybottom < othertop) || (mytop > otherbottom)
				|| (myright < otherleft) || (myleft > otherright)) {
			crash = false;
		}
		return crash;
	}
	
}// end component

// GAME AREA
var gameArea = {
	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight * 0.75;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.interval = setInterval(updateGameArea, 20);
	},
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	stop : function() {
		clearInterval(this.interval);
		lives -= 1;
		if (lives == 2) {
			document.getElementById("life3").style.visibility = "hidden";
		}
		if (lives == 1) {
			document.getElementById("life2").style.visibility = "hidden";
		}
		if (lives == 0) {
			window.location.href = "gameover.html";
		} else {
			startGame();
		}
	}
}

// MOVING
function moveUp() {
	if(player.jumping == false) {
		player.speedY = -20;
		player.jumping = true;
	}
}

function moveLeft() {
	player.speedX = -5;
}
function moveRight() {
	player.speedX = 5;
}
function stopMove() {
	player.speedX = 0;
	player.speedY = 0;
}

// UPDATE GAME AREA
function updateGameArea() {

	if (player.crashWith(danger1) || player.crashWith(danger2)) {
		gameArea.stop();
		if (keyGot == true) {
			key.y = -500;
		}
		if (coin1Got == true) {
			coin1.y = -500;
		}
	}
	if (player.crashWith(key)) {
		document.getElementById("keyslot").src = "img/key.png";
		keyGot = true;
		key.y = -500; // not an elegant way to make it disappear, but works
						// for now...
	}

	if (player.crashWith(door) && keyGot) {
		window.location.href = "scores.html";
	}

	if (player.crashWith(coin1)) {
		score = score + 100;
		coin1Got = true;
		coin1.y = -500;// not an elegant way to make it disappear, but works
						// for now...
	}
	if (player.crashWith(platform1)) {
		player.y = platform1.y - platform1.height;
		player.speedY = 0;
	}
	gameArea.clear();
	platform1.update();
	danger1.update();
	danger2.update();
	key.update();
	door.update();
	coin1.update();
	player.newPos();
	player.update();
	
}


// KEYBOARD CONTROLS
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

var rightPressed = false,
	leftPressed = false,
	upPressed = false;

function keyDownHandler(event) {
    if(event.keyCode == 39) {
        rightPressed = true;
        moveRight();
    }
    else if(event.keyCode == 37) {
        leftPressed = true;
        moveLeft();
    }else if(event.keyCode == 38) {
    	upPressed = true;
    	moveUp();
    }
}
function keyUpHandler(event) {
    if(event.keyCode == 39) {
        rightPressed = false;
        stopMove();
    }
    else if(event.keyCode == 37) {
        leftPressed = false;
        stopMove();
    }
    else if(event.keyCode == 38) {
    	upPressed = false;
    	stopMove();
    }
}
