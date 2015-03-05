// Get the context for use later
var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

// create the keyboard object
var keyboard = new Keyboard();
// create the player
var player = new Player();

// Constant variables
//----------------
var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;

var STATE_SPLASH = 0;
var STATE_MENU = 1;
var STATE_GAME = 2;
var STATE_GAMEOVER = 3;

var PLAYER_SPEED = 100;
var PLAYER_TURN_SPEED = 1.6;
var BULLET_SPEED = 150;
var ASTEROID_SPEED = 50;

var ASTEROID_LIMIT = 20;
//----------------

player.position.Set(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);

// Variables
//----------------
var font = "36px KenFuture";
var white = "#fff";
var black = "#000";
var red = "#E55C5C"

var score = 0;

var spawnTimer = 0;
var deltaTime = 0;
var shootTimer = 0;

var gameState = STATE_SPLASH;

// used to calculate deltaTime
var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

// Create an array to store our asteroids
var asteroids = [];

// create an array to hold all the bullets in our game
var bullets = [];

// load the texture that we will use to as a tiled backgrounds
var background = {}
background.image = document.createElement("img");
background.image.src = "blue.png";
background.width = 256;
background.height = 256;

var splashImage = {}
splashImage.image = document.createElement("img");
splashImage.image.src = "textGetReady.png";
splashImage.width = 400;
splashImage.height = 73;

var gameOverImage = {}
gameOverImage.image = document.createElement("img");
gameOverImage.image.src = "textGameOver.png";
gameOverImage.width = 412;
gameOverImage.height = 78;

// create an array to hold all of the instances of the backgrounds texture
var backgrounds = [];

// populate the backgrounds array with the backgrounds texture
for(var y = 0; y < SCREEN_HEIGHT / background.height; y++)
{
	backgrounds[y] = [];
	for(var x = 0; x < SCREEN_WIDTH / background.width; x++)
	{
		backgrounds[y][x] = background;
	}
}
//----------------

// Functions
//----------------
// rand(floor, ceil)
// Return a random number within the range of the two input variables
function rand(floor, ceil)
{
	return Math.floor( (Math.random()* (ceil-floor)) +floor );
}


// Create a new random asteroid and add it to our asteroids array.
// We'll give the asteroid a random position (just off screen) and
// set it moving towards the center of the screen
function spawnAsteroid()
{
	// make a random variable to specify which asteroid image to use
	// (small, mediam or large)
	var type = rand(0, 3);
	
	// create the new asteroid
	var asteroid = {};
	
	asteroid.image = document.createElement("img");	
	asteroid.image.src = "rock_large.png";
	asteroid.width = 69;
	asteroid.height = 75;		
	
	// to set a random position just off screen, we'll start at the centre of the 
	// screen then move in a random direction by the width of the screen
	var x = SCREEN_WIDTH/2;
	var y = SCREEN_HEIGHT/2;
	
	var dirX = rand(-10,10);
	var dirY = rand(-10,10);
	
	// 'normalize' the direction (the hypotenuse of the triangle formed 
	// by x,y will equal 1)
	var magnitude = (dirX * dirX) + (dirY * dirY);
	if(magnitude != 0)
	{
		var oneOverMag = 1 / Math.sqrt(magnitude);
		dirX *= oneOverMag;
		dirY *= oneOverMag;
	}	
	
	// now we can multiply the dirX/Y by the screen width to move that amount from 
	// the centre of the screen
	var movX = dirX * SCREEN_WIDTH;
	var movY = dirY * SCREEN_HEIGHT;
	
	// add the direction to the original position to get the starting	position of the 
	// asteroid
	asteroid.x = x + movX;
	asteroid.y = y + movY;
	
	// now, the easy way to set the velocity so that the asteroid moves towards the 
	// centre of the screen is to just reverse the direction we found earlier
	asteroid.velocityX = -dirX * ASTEROID_SPEED;
	asteroid.velocityY = -dirY * ASTEROID_SPEED;
			
	// finally we can add our new asteroid to the end of our asteroids array
	asteroids.push(asteroid);
}

function getDeltaTime()// Only call this function once per frame
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	if (deltaTime > 1)// validate that the delta is within range
	{
		deltaTime = 1;
	}
	return deltaTime;
}

function playerShoot()
{
	var bullet = 
	{
		image: document.createElement("img"),
		x: player.position.x,
		y: player.position.y,
		width: 5,
		height: 5,
		velocityX: 0,
		velocityY: 0
	};
	bullet.image.src = "bullet.png";
	
	// start off with a velocity that shoots the bullet straight up
	var velX = 0;
	var velY = 1;
			
	// now rotate this vector acording to the ship's current rotation
	var s = Math.sin(player.rotation);
	var c = Math.cos(player.rotation);
	
	// for an explanation of this formula, 
	// see http://en.wikipedia.org/wiki/Rotation_matrix
	var xVel = (velX * c) - (velY * s);
	var yVel = (velX * s) + (velY * c);				
				
	// dont bother storing a direction and calculating the 
	// velocity every frame, because it won't change. 
	// Just store the pre-calculated velocity				
	bullet.velocityX = xVel * BULLET_SPEED;
	bullet.velocityY = yVel * BULLET_SPEED;	
		
	bullets.push(bullet);
}

function intersects(x1, y1, w1, h1, x2, y2, w2, h2)
{
	if(	y2 + h2 < y1 ||
		x2 + w2 < x1 ||
		x2 > x1 + w1 ||
		y2 > y1 + h1)
	{
		return false;
	}
	return true;
}

var splashTimer = 3;
function runSplash(deltaTime)
{
	splashTimer -= deltaTime;
	if(splashTimer <= 0)
	{
		gameState = STATE_MENU;
		return;
	}
	
	//context.drawImage(splashImage.image, SCREEN_WIDTH/2 - splashImage.width / 2, SCREEN_HEIGHT/2 - splashImage.height/2);
	
	context.fillStyle = red;
	context.font = font;
	var textMeasure = context.measureText("ASTEROIDS");	// how wide will the text be?
	context.fillText("ASTEROIDS", canvas.width/2 - textMeasure.width/2, canvas.height/2);
}

function runMenu(deltaTime)
{
	context.fillStyle = red;
	context.font = font;
	var message = "Press Enter to Play!";
	var textMeasure = context.measureText(message);
	context.fillText(message, canvas.width / 2 - textMeasure.width / 2, canvas.height / 2);
	
	if(keyboard.isKeyDown(keyboard.Enter))
	{
		gameState = STATE_GAME;
		return;
	}
}

function runGame(deltaTime)
{	
	// spawn more asteroids
	spawnTimer -= deltaTime;
	if (spawnTimer <= 0 && asteroids.length <= ASTEROID_LIMIT)
	{
		spawnTimer = 2;
		spawnAsteroid();
	}
	
	// update the shoot timer
	if(shootTimer > 0)
	{
		shootTimer -= deltaTime;
	}
	
	// if space is held and there has been enough time since the last time you shot
	if(keyboard.isKeyDown(keyboard.Space) == true && shootTimer <= 0)
	{
		shootTimer += 0.3;
		playerShoot();
	}

	// update all the bullets
	for(var i = 0; i < bullets.length; i++)
	{
		bullets[i].x += bullets[i].velocityX * deltaTime;
		bullets[i].y += bullets[i].velocityY * deltaTime;
	}
	
	// Update Asteroid
	for(var i = 0; i < asteroids.length; i++)
	{
		asteroids[i].x += asteroids[i].velocityX * deltaTime;
		asteroids[i].y += asteroids[i].velocityY * deltaTime;
		
		if (asteroids[i].x + asteroids[i].width / 2 < 0)
		{
			asteroids[i].x = SCREEN_WIDTH + asteroids[i].width / 2;
		}
		if (asteroids[i].x - asteroids[i].width / 2 > SCREEN_WIDTH)
		{
			asteroids[i].x = 0 - asteroids[i].width / 2;
		}
		if (asteroids[i].y + asteroids[i].height / 2 < 0)
		{
			asteroids[i].y = SCREEN_HEIGHT + asteroids[i].height / 2;
		}
		if (asteroids[i].y - asteroids[i].height / 2 > SCREEN_HEIGHT)
		{
			asteroids[i].y = 0 - asteroids[i].height / 2;
		}
	}
	
	// Update the player
	player.Update(deltaTime);
	
	// check all the bullets to see if it has gone off of the screen
	for(var i = 0; i < bullets.length; i++)
	{
		// check if the bullet has gone out of the screen boundaries
		// and if so kill it
		if(	bullets[i].x + bullets[i].width / 2 < 0 ||
			bullets[i].x - bullets[i].height / 2 > SCREEN_WIDTH ||
			bullets[i].y + bullets[i].width / 2 < 0 ||
			bullets[i].y - bullets[i].height / 2 > SCREEN_HEIGHT) 
		{
			// remove 1 element at position i
			bullets.splice(i, 1);	
			// because we are deleting elements from the middle of the
			// array, we can only remove 1 at a time. So, as soon as we
			// remove 1 bullet stop.
			break;
		}
	}
	
	// check if any bullet intersects any asteroid. If so, kill them both
	for(var i=0; i<asteroids.length; i++) 
	{
		for(var j=0; j<bullets.length; j++)
		{
			if(intersects(	bullets[j].x - bullets[j].width / 2, 		bullets[j].y - bullets[j].height / 2, 
							bullets[j].width, 							bullets[j].height,
							asteroids[i].x - asteroids[i].width / 2, 	asteroids[i].y - asteroids[i].height / 2,
							asteroids[i].width, 						asteroids[i].height) == true)					
			{
				asteroids.splice(i, 1);
				bullets.splice(j, 1);
				score += 1;
				break;
			}		
		}
	}
	
	// check all of the asteroids to see if it hits the player
	for(var i = 0; i < asteroids.length; i++)
	{
		if(intersects(	asteroids[i].x - asteroids[i].width / 2, 	asteroids[i].y - asteroids[i].height / 2, 
						asteroids[i].width, 						asteroids[i].height,
						player.position.x - player.width / 2, 		player.position.y - player.height / 2,
						player.width, 								player.height) == true)
		{
			gameState = STATE_GAMEOVER;
			keyboard.keys[keyboard.Space] = false;
			var highScore = window.localStorage.getItem("highScore");
			
			console.log(highScore);
			if(highScore == null || highScore < score)			
				window.localStorage.setItem("highScore", score);
			// window.localStorage.clear()
			return;
		}
	}
	
	// draw all of the bullets
	for(var i=0; i<bullets.length; i++) 
	{	
		context.drawImage(bullets[i].image, bullets[i].x - bullets[i].width / 2, bullets[i].y - bullets[i].height / 2);
	}
	
	// Draw all of the Asteroids
	for(var i = 0; i < asteroids.length; i++)
	{
		context.drawImage(asteroids[i].image, asteroids[i].x - asteroids[i].width / 2, asteroids[i].y - asteroids[i].height / 2);
	}
	
	// Draw the player
	player.Draw();
	
	context.font = font;
	context.fillStyle = red;
	context.fillText("Score: " + score, 2, SCREEN_HEIGHT - 2);
}

function resetGame()
{
	player.isDead = false;
	asteroids = []
	bullets = []
	player.position.x = player.resetPosition.resetX;
	player.position.y = player.resetPosition.resetY;
	player.rotation = 0;
	score = 0;
}

function runGameOver(deltaTime)
{
	var highScore = window.localStorage.getItem("highScore");
	var message = "High Score: " + highScore;
	var tm = context.measureText(message);	
	context.fillStyle = red;
	context.fillText(message, SCREEN_WIDTH/2 - tm.width/2, SCREEN_HEIGHT/2 + 80);
	
	if(keyboard.isKeyDown(keyboard.Space) == true)
	{
		resetGame();
		gameState = STATE_MENU;
		return;
	}
	
	context.drawImage(gameOverImage.image, SCREEN_WIDTH/2 - gameOverImage.width/2, SCREEN_HEIGHT/2 - gameOverImage.height/2);
}

function run()
{	
	// get deltaTime at the beginning of the frame
	deltaTime = getDeltaTime();
	
	// first we draw the background so that it is below everything else
	for(var y = 0; y < SCREEN_HEIGHT / background.width; y++)
	{
		for(var x = 0; x < SCREEN_WIDTH / background.height; x++)
		{
			context.drawImage(backgrounds[y][x].image, x * backgrounds[y][x].width, y * backgrounds[y][x].height);
		}
	}
	
	switch(gameState)
	{
		case STATE_SPLASH:
			runSplash(deltaTime);
			break;
		case STATE_MENU:
			runMenu(deltaTime);
			break;
		case STATE_GAME:
			runGame(deltaTime);
			break;
		case STATE_GAMEOVER:
			runGameOver(deltaTime);
			break;
	} // End of gameState switch statement
}
//----------------

// This stuff is black magic code
(function() 
{
  var onEachFrame;
  if (window.requestAnimationFrame) 
  {
    onEachFrame = function(cb) 
	{
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } 
  else if (window.mozRequestAnimationFrame) 
  {
    onEachFrame = function(cb) 
	{
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } 
  else 
  {
    onEachFrame = function(cb) 
	{
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);