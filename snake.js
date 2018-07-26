const cvs = document.querySelector("canvas");
const ctx = cvs.getContext("2d");
const menu = document.querySelector(".menu");
const startButton = document.querySelector(".button_play");
const gameOverMenu = document.querySelector(".gameOverMenu");
const gameOverText = document.querySelector(".gameOverText");
const buttonTryAgain = document.querySelector(".button_tryagain");
const box = 32;

startButton.addEventListener("click", function(){
	menu.style.display = "none";
	cvs.style.display= "block";
	game();
});


//SNAKE OBJECT
function Snake(x, y, direction){
	this.snakePos=[];
	this.snakePos[0] = {
		x: x,
		y: y
	};
	this.dir=direction;
	this.pendingDir=[];
	this.pendingDir[0]=direction
	this.points=0;
}



//MOVES SNAKE
function moveSnake(snake, foodEaten){
	if(snake.pendingDir[0]==="LEFT"){
		snake.snakePos.unshift({x:snake.snakePos[0].x - box, y:snake.snakePos[0].y});
		if(!foodEaten) snake.snakePos.pop();
		snake.dir="LEFT";

	} else if(snake.pendingDir[0]==="UP"){
		snake.snakePos.unshift({x:snake.snakePos[0].x, y:snake.snakePos[0].y - box});
		if(!foodEaten) snake.snakePos.pop();
		snake.dir="UP";

	} else if(snake.pendingDir[0]==="RIGHT"){
		snake.snakePos.unshift({x:snake.snakePos[0].x + box, y:snake.snakePos[0].y});
		if(!foodEaten) snake.snakePos.pop();;
		snake.dir="RIGHT";

	} else if(snake.pendingDir[0]==="DOWN"){
		snake.snakePos.unshift({x:snake.snakePos[0].x, y:snake.snakePos[0].y + box});
		if(!foodEaten) snake.snakePos.pop();
		snake.dir="DOWN";
	}
	//Checks if there are pending directions
	if(snake.pendingDir[1] != undefined){
		snake.pendingDir.shift();
	}
}


//ADD A NEW DIRECTION TO THE PENDING DIRECTIONS OF A SNAKE
function updatePendingDirection(snake){
	document.addEventListener("keydown", function(e){
			var last = snake.pendingDir[snake.pendingDir.length-1];
			if(e.which===37 && (last != "RIGHT")){
				snake.pendingDir.push("LEFT");
			} else if(e.which===38 && (last != "DOWN")){
				snake.pendingDir.push("UP");
			} else if(e.which===39 && (last != "LEFT")){
				snake.pendingDir.push("RIGHT");
			} else if(e.which===40 && (last != "UP")){
				snake.pendingDir.push("DOWN");
			}
		
	})
}

//CHECKS FOR COLLISIONS WITH A WALL
function checkCollisionWall(snake){
	return (snake.snakePos[0].x===-box) ||
			(snake.snakePos[0].y===0) ||
			(snake.snakePos[0].x===25*box) ||
			(snake.snakePos[0].y===26*box);
}

//SPAWNS FOOD
function drawFood(food){
	ctx.fillStyle="#60f900";
	ctx.fillRect(food.x+5, food.y+5, box-10, box-10);
}

//CHECK IF FOOD WAS EATEN
function checkFood(snake, food){
	if(snake.snakePos[0].x===food.x && snake.snakePos[0].y===food.y){
		food.x = Math.floor(Math.random()*25)*box; 
		food.y = Math.floor(Math.random()*25+1)*box;
		snake.points++;
		return true;
	} else {
		return false;
	}
}

//CHECkS FOR SNAKE COLLISION WITH ITSELF
function checkCollisionBody(snake){
	for(var i = 1; i<snake.snakePos.length; i++){
		if(snake.snakePos[0].x===snake.snakePos[i].x && snake.snakePos[0].y===snake.snakePos[i].y){
			return true;
		}
	}
	return false;
}

//DRAWS SNAKE FOOD POINTS
function draw(snake, food,refreshInterval){
	console.log(1)
	ctx.clearRect(0, 0, cvs.width, cvs.height);//clear canvas
	ctx.font="18px bit-wonder";
	ctx.fillStyle="white";
	ctx.fillText("points: "+ snake.points, 10, 22);//points text
	drawFood(food);
	var foodEaten = checkFood(snake, food);
	moveSnake(snake, foodEaten);
	if(checkCollisionWall(snake) || checkCollisionBody(snake)){
		gameOver(snake,refreshInterval);
	}
	for(var i=0; i<snake.snakePos.length; i++){
		ctx.fillStyle = i===0? "#ff0000" : "#ffffff";
		ctx.fillRect(snake.snakePos[i].x+2, snake.snakePos[i].y+2, box-4,box-4);
	}
}

//GAMEOVER
function gameOver(snake,refreshInterval){
	clearInterval(refreshInterval);
	cvs.style.display= "none";
	gameOverMenu.style.display = "block";
	gameOverText.style.display = "block";
	buttonTryAgain.style.display = "block";
	buttonTryAgain.addEventListener("click", restart);
	function restart(){
		//remove eventListener so it doesnt stack 
		buttonTryAgain.removeEventListener('click', restart);
		buttonTryAgain.style.display = "none";
		cvs.style.display= "block";console.log("ok")
		gameOverMenu.style.display = "none";
		gameOverText.style.display = "none";
		game();
	}
}

//GAME
function game(){
	var snake1 = new Snake(10*box, 10*box, "RIGHT");
	var food = {x:Math.floor(Math.random()*25)*box, 
				y:Math.floor(Math.random()*25+1)*box
	};

	snake1.snakePos[1]={x:9*box, y:10*box};
	snake1.snakePos[2]={x:8*box, y:10*box};

	var refreshInterval = setInterval(function(){draw(snake1, food,refreshInterval)}, 100);
	updatePendingDirection(snake1);
}
