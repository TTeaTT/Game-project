var player;
var lives = 3;
var floor1;
var danger1, danger2;
var key;
var door;
var keyGot = false;
var coin1;

// FUNCTION TO START THE GAME
function startGame() {
	gameArea.start();

	floor1 = new component(window.innerWidth / 2, window.innerHeight, "black",
			0, 350)
	danger1 = new component(20, 50, "red", 200, 300);
	danger2 = new component(20, 80, "red", 400, 270);
	key = new component(65, 41, "img/small_key.png", 200, 250, "image");
	door = new component(100, 150, "img/door.png", window.innerWidth - 150, 50,
			"image");
	coin1 = new component(30, 30, "img/coin.png", 500, 100, "image");
	player = new component(50, 50, "img/player.png", 10, 300, "image");
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
	// this.gravity = 0.05;
	// this.gravitySpeed = 0;
	this.update = function() {
		ctx = gameArea.context;
		if (type == "image") {
			ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
		} else {
			ctx.fillStyle = color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}// end else
	}// end this.update
	this.newPos = function() {
		// this.gravitySpeed += this.gravity;
		this.x += this.speedX;
		this.y += this.speedY;// + this.gravitySpeed;
	}// end this.newPos

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
		this.canvas.height = window.innerHeight;
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
	player.speedY -= 5;
}

function moveLeft() {
	player.speedX -= 5;
}
function moveRight() {
	player.speedX += 5;
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
	}
	if (player.crashWith(key)) {
		document.getElementById("keyslot").src = "img/key.png";
		keyGot = true;
		key.y = -500; //not an elegant way to make it disappear, but works for now...
	}
	
	if (player.crashWith(door) && keyGot){
		window.location.href = "scores.html";
	}
	
	if (player.crashWith(coin1)){
		coin1.y=-500;//not an elegant way to make it disappear, but works for now...
	}
	// if (player.crashWith(floor1)) {
	// player.y = 250;
	// player.speedY = 0;
	// }
	gameArea.clear();
	floor1.update();
	danger1.update();
	danger2.update();
	key.update();
	door.update();
	coin1.update();
	player.newPos();
	player.update();
	
}