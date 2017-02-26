var ROW;// = document.getElementById("col").value;
var COL;// = document.getElementById("row").value;
var snake = {x:[0, 1, 2], y:[0, 0, 0]}; // Set snake
var flag = {};
var corner;// The corner of the snake body
var timer;// Set time span
var snake_length = snake.x.length;
var direction = "right";// The direction of movement
var score = 0;
var score_output= document.getElementById("score");//Display score
console.log(score_output.innerHTML)
function setTimer()// Set time by level 
{
	level = document.getElementById("level").value;// Get level value
	step = 200 / parseInt(level);
	timer = setInterval("move()", step);
}			

function setCorner()
{
	//Find the corner
	corner = {};
	for (var i = 1; i < snake_length - 2; i++)
	{
		var dir_x = snake.x[i-1] + snake.y[i + 1] - 2*snake.y[i];
		var dir_y = snake.y[i-1] + snake.y[i + 1] - 2*snake.y[i];
		if (dir_x > 0 && dir_y > 0)
			corner[i] = "first";
		else if (dir_x < 0 && dir_y > 0)
			corner[i] = "second";
		else if (dir_x < 0 && dir_y < 0)
			corner[i] = "third";
		else if (dir_x > 0 && dir_y < 0)
			corner[i] = "fourth";
	}

	//Mark the three corner elements
	//Set the corner background
}


function updateSnake()
{
	flag = {};
	for (var i = 0; i < snake_length; i++)
	{
		var id = snake.x[i] + "_" + snake.y[i];
		var div = document.getElementById(id);
		if (0 == i)
		{
			div.className = "tail";
		}
		else if (snake_length - 1 == i)
		{
			div.className = "head";
		}
		else
		{
			div.className = "body";
		}
		flag[id] = true;
	}
}

var time_flag = true;
var start_btn = document.getElementById("start");
var pause_btn = document.getElementById("pause");

start_btn.onclick = function()
{
	if (time_flag && start_btn.innerHTML != "Stop" || pause_btn.innerHTML == "Restore")
	{
		start_btn.innerHTML = "Stop";		
		createChessboard();
		setTimer();
		time_flag = false;
	}
	else if (this.innerHTML == "Stop")
		clearInterval(timer);
}

pause_btn.onclick = function()
{
	if (time_flag && this.innerHTML != "Restore" && start_btn.innerHTML == "Stop")
	{
		this.innerHTML = "Restore";
		clearInterval(timer);
		time_flag = !time_flag;
	}
	else
	{
		start_btn.onclick();
		this.innerHTML = "Pause";
		time_flag = !time_flag;
	}
}

function createChessboard()
{
	//$("#chess").empty();
    document.getElementById("chess").innerHTML = '';
	ROW = document.getElementById("row").value;	
	COL = document.getElementById("col").value;
	
	if (ROW < 1 || COL < 1)	
		alert("Row and col must be positive!");

	// Initialize the chessboard
	for (var i = 0; i < ROW; i++)
		for (var j = 0; j < COL; j++)
		{
			var div = document.createElement("div");
			div.id = j + '_' + i;
			div.className = "board";
			var dx = (600 - 2*COL) / COL + "px";
			var dy = (600 - 2*ROW) / ROW + "px";
			div.style.width = dx;
			div.style.height = dy;
			div.style.border = "1px solid #000";
			div.style.float = "left";
			document.getElementById("chess").appendChild(div);
		}
	updateSnake();
	food = createFood();
}

function createFood()// Create food
{
	// Initialize the food
	var food_x = parseInt(Math.random()*COL);
	var food_y = parseInt(Math.random()*ROW);
	while (flag[food_x + "_" + food_y])
	{
		food_x = parseInt(Math.random()*COL);
		food_y = parseInt(Math.random()*ROW);
	}
	//food_x=3;
	//food_y=0;
	document.getElementById(food_x + "_" + food_y).className = "food";
	//document.getElementById(food_x + "_" + food_y).style.background = "url(./image/food.gif)";
	return {x:food_x, y:food_y};
}

document.onkeydown = function(e)// Control the direction of movement
{
	//e = e || window.event;
	var key_code = e.keyCode;// || e.which;
	switch (key_code)
	{
		case 37: case 72://left arrow or 'h'
			if (direction != "right")
				direction = "left";
			break;
		case 38: case 75://up arrow or 'k'
			if (direction != "down")
				direction = "up";
			break;
		case 39: case 76://right arrow or 'l'
			if (direction != "left")
				direction = "right";
			break;
		case 40: case 74://down arrow or 'j'
			if (direction != "up")
				direction = "down";
			break;
	}
}

function restartGame()
{
	clearInterval(timer);
	var msg = confirm("Game over!")
	if (msg)
		window.location.reload();
}

function move()
{

	var snake_head = {x:snake.x[snake_length - 1], y:snake.y[snake_length - 1]};
	switch (direction)
	{
		case "left":
			snake_head.x -= 1;
			break;
		case "up":
			snake_head.y -= 1;
			break;
		case "right":
			snake_head.x += 1;
			break;
		case "down":
			snake_head.y += 1;
	}

	// Died
	if (snake_head.x < 0 || snake_head.y < 0 || snake_head.x > ROW || snake_head.y > COL || flag[snake_head.x + "_" + snake_head.y])
		restartGame();

	//Eat food
	if (food.x == snake_head.x && food.y == snake_head.y)
	{
		document.getElementById(food.x + "_" + food.y).className = "board";
		food = createFood();
		score++;
		snake_length++;
		score_output.innerHTML = "Score:" + "<br\><br\>" + score;
	}
	else
	{
		var del_x = snake.x.shift();
		var del_y = snake.y.shift();
		document.getElementById(del_x + "_" + del_y).className = "board";
	}

	snake.x.push(snake_head.x);
	snake.y.push(snake_head.y);
	updateSnake();
}

