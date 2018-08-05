const cvs = document.querySelector("canvas");
const ctx = cvs.getContext("2d");
const menu = document.querySelector(".menu");
const snakeTitle = document.querySelector(".snakeTitle");
const startButton = document.querySelector(".button_play");
const onePlayer = document.querySelector(".onePlayer");
const twoPlayer = document.querySelector(".twoPlayer");
const gameOverMenu = document.querySelector(".gameOverMenu");
const gameOverText = document.querySelector(".gameOverText");
const gameOverPoints1 = document.querySelector(".gameOverPoints1")
const gameOverPoints2 = document.querySelector(".gameOverPoints2")
const buttonTryAgain = document.querySelector(".button_tryagain");
const box = 32;
const frameInterval = 130;


startButton.addEventListener("click", function(){
	startButton.style.display = "none";
	snakeTitle.style.display = "none";
	onePlayer.style.display = "block";
	twoPlayer.style.display = "block";
	onePlayer.addEventListener('click', function(){
		menu.style.display = "none";
		cvs.style.display= "block";
		game(false);
	})
	twoPlayer.addEventListener('click', function(){
		menu.style.display = "none";
		cvs.style.display= "block";
		game(true);
	})
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
	this.headFillId;
	this.tailFillId;
}



//MOVES SNAKE
function moveSnake(snake, foodEaten){
	if(snake.pendingDir[0]===undefined){
		//Move in the direction already in the snake
		if(snake.dir==="LEFT"){
			snake.snakePos.unshift({x:snake.snakePos[0].x - box, y:snake.snakePos[0].y});
			if(!foodEaten) snake.snakePos.pop();
	
		} else if(snake.dir==="UP"){
			snake.snakePos.unshift({x:snake.snakePos[0].x, y:snake.snakePos[0].y - box});
			if(!foodEaten) snake.snakePos.pop();
	
		} else if(snake.dir==="RIGHT"){
			snake.snakePos.unshift({x:snake.snakePos[0].x + box, y:snake.snakePos[0].y});
			if(!foodEaten) snake.snakePos.pop();
	
		} else if(snake.dir==="DOWN"){
			snake.snakePos.unshift({x:snake.snakePos[0].x, y:snake.snakePos[0].y + box});
			if(!foodEaten) snake.snakePos.pop();
		} 
	} else {
		//Changes snake direction
		turnSnake(snake, foodEaten);
	}
}

function turnSnake(snake, foodEaten){
	if(snake.pendingDir[0]==="LEFT"){
			snake.snakePos.unshift({x:snake.snakePos[0].x - box, y:snake.snakePos[0].y});
			snake.pendingDir.shift();
			if(!foodEaten) snake.snakePos.pop();
			snake.dir="LEFT";
	
		} else if(snake.pendingDir[0]==="UP"){
			snake.snakePos.unshift({x:snake.snakePos[0].x, y:snake.snakePos[0].y - box});
			snake.pendingDir.shift();
			if(!foodEaten) snake.snakePos.pop();
			snake.dir="UP";
	
		} else if(snake.pendingDir[0]==="RIGHT"){
			snake.snakePos.unshift({x:snake.snakePos[0].x + box, y:snake.snakePos[0].y});
			snake.pendingDir.shift();
			if(!foodEaten) snake.snakePos.pop();
			snake.dir="RIGHT";
	
		} else if(snake.pendingDir[0]==="DOWN"){
			snake.snakePos.unshift({x:snake.snakePos[0].x, y:snake.snakePos[0].y + box});
			snake.pendingDir.shift();
			if(!foodEaten) snake.snakePos.pop();
			snake.dir="DOWN";
		} 
}

//ADD A NEW DIRECTION TO THE PENDING DIRECTIONS OF A SNAKE
function updatePendingDirection(snake, left, up, right, down){
	document.addEventListener("keydown", function(e){
		if(snake.pendingDir.length<2){
			var last = snake.pendingDir[0]===undefined? snake.dir : snake.pendingDir[snake.pendingDir.length-1];
			if(e.which===left && (last != "RIGHT")){
				snake.pendingDir.push("LEFT");
			} else if(e.which===up && (last != "DOWN")){
				snake.pendingDir.push("UP");
			} else if(e.which===right && (last != "LEFT")){
				snake.pendingDir.push("RIGHT");
			} else if(e.which===down && (last != "UP")){
				snake.pendingDir.push("DOWN");
			}
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
		if(snake.snakePos[0].x===snake.snakePos[i].x && 
			snake.snakePos[0].y===snake.snakePos[i].y){
			return true;
		}
	}
	return false;
}

//CHECKS FOR SNAKES COLLISION WITH EACH OTHER
function checkSnakesCollision(snake1, snake2){
	//checks for snake1 collision with snake2
	for(var i = 0; i<snake2.snakePos.length; i++){
		if((snake1.snakePos[0].x === snake2.snakePos[i].x) && 
			(snake1.snakePos[0].y === snake2.snakePos[i].y)){
			return true;
		}
	}
	//checks for snake2 collision with snake1
	for(var i = 0; i < snake1.snakePos.length; i++){
		if((snake1.snakePos[i].x === snake2.snakePos[0].x) && 
			(snake1.snakePos[i].y === snake2.snakePos[0].y)){
			return true;
		}
	}
	return false;
}
var c;
function fillBox(x, y, direction, color){
	if(direction==="LEFT"){
		var boxX = x+box;
		var boxY = y;
		interval = setInterval(function(){
				c++;
			ctx.fillStyle = color;
			ctx.fillRect(boxX, boxY, 2, box);
			boxX-=2;
			if(boxX===x) clearInterval(interval);
		}, frameInterval/(box/2));
		return interval;
	} else if(direction==="UP"){
		var boxX = x;
		var boxY = y+box;
		interval = setInterval(function(){
			c++;
			ctx.fillStyle = color;
			ctx.fillRect(boxX, boxY, box, 2);
			boxY-=2;
			if(boxY===y) clearInterval(interval);
		}, frameInterval/(box/2));
		return interval;
	} else if(direction==="RIGHT"){
		var boxX = x;
		var boxY = y;
		interval = setInterval(function(){
			c++;
			ctx.fillStyle = color;
			ctx.fillRect(boxX, boxY, 2, box);
			boxX+=2;
			if(boxX===x+box) clearInterval(interval);
		}, frameInterval/(box/2));
		return interval;
	} else if(direction==="DOWN"){
		var boxX = x;
		var boxY = y;
		interval = setInterval(function(){
			c++;
			ctx.fillStyle = color;
			ctx.fillRect(boxX, boxY, box, 2);
			boxY+=2;
			if(boxY===y+box) clearInterval(interval);
		}, frameInterval/(box/2));
		return interval;
	}
}

function removeTail(snake){
	var tail = snake.snakePos[snake.snakePos.length-1];
	var beforeTail = snake.snakePos[snake.snakePos.length-2];
	if(tail.x > beforeTail.x){
		return fillBox(tail.x, tail.y, "LEFT", "#0f0f0f");
	} else if(tail.x < beforeTail.x){
		return fillBox(tail.x, tail.y, "RIGHT", "#0f0f0f");
	} else if(tail.y > beforeTail.y){
		return fillBox(tail.x, tail.y, "UP", "#0f0f0f");
	} else if(tail.y < beforeTail.y){
		return fillBox(tail.x, tail.y, "DOWN", "#0f0f0f");
	}
}

//DRAWS SNAKE FOOD POINTS
function draw(snake1, snake2, food, refreshInterval, twoPlayers){
	console.log(c);
	c=0;
	ctx.clearRect(0, 0, cvs.width, cvs.height);//clear canvas
	clearInterval(snake1.headFillId);
	clearInterval(snake1.tailFillId);
	//in game points text
	ctx.font="18px bit-wonder";
	ctx.fillStyle= "#ff8e8e";
	ctx.fillText("points: "+ snake1.points, 10, 22);

	if(twoPlayers){
		ctx.font="18px bit-wonder";
		ctx.fillStyle="#7275ff";
		ctx.fillText("points: "+ snake2.points, 650, 22);
	}

	drawFood(food);
	var foodEaten = checkFood(snake1, food);
	moveSnake(snake1, foodEaten);
	if(twoPlayers){
		foodEaten = checkFood(snake2, food);
		moveSnake(snake2, foodEaten);
	}
	//Checks for collision with wall itself or other snake
	if(twoPlayers){
		if(checkCollisionWall(snake1) || checkCollisionBody(snake1) ||
			checkCollisionWall(snake2) || checkCollisionBody(snake2) || 
			checkSnakesCollision(snake1, snake2)){

			gameOver(snake1,snake2, refreshInterval, twoPlayers);
		}
	} else {
		if(checkCollisionWall(snake1) || checkCollisionBody(snake1)){
			gameOver(snake1, snake2, refreshInterval, twoPlayers);
		}
	}

	//Draws snake head
	snake1.headFillId = fillBox(snake1.snakePos[0].x, snake1.snakePos[0].y, snake1.dir, "#ffffff");
	//Removes tail
	snake1.tailFillId = removeTail(snake1);
	//Draws snake body
	for(var i=1; i<snake1.snakePos.length; i++){
		ctx.fillStyle =  "#ffffff";
		ctx.fillRect(snake1.snakePos[i].x, snake1.snakePos[i].y, box,box);
	}
	if(twoPlayers){
		for(var i=0; i<snake2.snakePos.length; i++){
			ctx.fillStyle = i===0? "#0000ff" : "#ffffff";
			ctx.fillRect(snake2.snakePos[i].x+2, snake2.snakePos[i].y+2, box-4,box-4);
		}
	}


}

//GAMEOVER
function gameOver(snake1, snake2, refreshInterval, twoPlayers){
	clearInterval(refreshInterval);
	cvs.style.display= "none";
	gameOverMenu.style.display = "block";
	gameOverText.style.display = "block";
	buttonTryAgain.style.display = "block";
	if(twoPlayers){
		gameOverPoints2.textContent = "points: " + snake2.points;
		gameOverPoints2.style.display = "block";
	} else {
		gameOverPoints1.style.width = "100%";
		gameOverPoints1.style.marginLeft = "auto";
	}
	gameOverPoints1.textContent = "points: " + snake1.points;
	gameOverPoints1.style.display = "block";
	buttonTryAgain.addEventListener("click", restart);
	function restart(){
		console.log(1);
		//remove eventListener so it doesnt stack listeners
		buttonTryAgain.removeEventListener('click', restart);
		ctx.clearRect(0, 0, cvs.width, cvs.height);//clear canvas
		game(twoPlayers);
		cvs.style.display= "block";
		gameOverMenu.style.display = "none";
	}
}

//GAME
function game(twoPlayers){
	//Creates first snake
	var snake1 = new Snake(5*box, 10*box, "RIGHT");
	snake1.snakePos[1]={x:4*box, y:10*box};
	snake1.snakePos[2]={x:3*box, y:10*box};
	snake1.snakePos[3]={x:2*box, y:10*box};
	
	//Creates second snake
	if(twoPlayers){
		var snake2 = new Snake(5*box, 15*box, "RIGHT");
		snake2.snakePos[1]={x:4*box, y:15*box};
		snake2.snakePos[2]={x:3*box, y:15*box};
	}

	var food = {x:Math.floor(Math.random()*25)*box, 
				y:Math.floor(Math.random()*25+1)*box
	};

	var refreshInterval = setInterval(function(){draw(snake1, snake2, food, refreshInterval, twoPlayers)}, frameInterval);
	updatePendingDirection(snake1, 37, 38, 39, 40);//controled using arrow keys
	if(twoPlayers) updatePendingDirection(snake2, 65, 87, 68, 83);//controled using wasd keys
}
