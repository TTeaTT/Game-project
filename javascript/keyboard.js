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
