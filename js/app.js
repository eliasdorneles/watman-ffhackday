// Setup requestAnimationFrame
requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||  
                        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 510;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "img/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "img/hero.png";
var hero2Ready = false;
var hero2Image = new Image();
hero2Image.onload = function () {
	hero2Ready = true;
};
hero2Image.src = "img/hero2.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "img/monster.png";

// Tree image
var treeReady = false;
var treeImage = new Image();
treeImage.onload = function () {
	treeReady = true;
};
treeImage.src = "img/tree.png";

// Fruit image
var fruitReady = false;
var fruitImage = new Image();
fruitImage.onload = function () {
	fruitReady = true;
};
fruitImage.src = "img/fruit.png";

var getRandomDirection = function(){
    var directions = ["up", "down", "left", "right"];
    return directions[parseInt(Math.random() * 100) % directions.length];
}
// Game objects
var hero = {
	speed: 180, // movement in pixels per second
	direction: "stopped",
	lives: 3
};
//var monster = {
//    speed: 100,
//    direction: getRandomDirection()
//};
var monsters = [
    { speed: 100, direction: getRandomDirection(), prev_x: 0, prev_y: 0 },
    { speed: 100, direction: getRandomDirection(), prev_x: 0, prev_y: 0 },
    { speed: 100, direction: getRandomDirection(), prev_x: 0, prev_y: 0 },
    { speed: 100, direction: getRandomDirection(), prev_x: 0, prev_y: 0 },
];
var monstersCaught = 0;
var fruitsEaten = 0;


var game_over = false;
var TREE = 1;
var FRUIT = 2;
var labirint_width = 17;
var labirint_height = 16;
var labirint = null; // labirint unitialized

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// TODO: fazer outros labirintos e escolher um aleatoriamente
var LABIRINTOS = [
];

// i eh linha
// j eh coluna
var is_tree = function(x, y){
    var i = parseInt(Math.floor(y) / 30);
    var j = parseInt(Math.floor(x) / 30);
    //if (labirint == null) return false;
    return labirint[parseInt(Math.floor(y) / 30)     ][parseInt(Math.floor(x) / 30)     ] == TREE ||
	   labirint[parseInt(Math.floor(y + 25) / 30)][parseInt(Math.floor(x) / 30)     ] == TREE ||
	   labirint[parseInt(Math.floor(y + 25) / 30)][parseInt(Math.floor(x + 25) / 30)] == TREE ||
	   labirint[parseInt(Math.floor(y) / 30)     ][parseInt(Math.floor(x + 25) / 30)] == TREE;
}
var really_eat_fruit = function(i, j){
    if (labirint[i][j] == FRUIT){
	labirint[i][j] = 0;
	return true;
    }
    return false;
}
var eat_fruit = function(x, y){
    return really_eat_fruit(parseInt(Math.floor(y) / 30)     , parseInt(Math.floor(x) / 30)) ||
	   really_eat_fruit(parseInt(Math.floor(y + 25) / 30), parseInt(Math.floor(x) / 30)     ) ||
	   really_eat_fruit(parseInt(Math.floor(y + 25) / 30), parseInt(Math.floor(x + 25) / 30)) ||
	   really_eat_fruit(parseInt(Math.floor(y) / 30)     , parseInt(Math.floor(x + 25) / 30));
}

var positionRandomly = function(guy){
    guy.x = 32 + (Math.random() * (canvas.width - 64));
    guy.y = 32 + (Math.random() * (canvas.height - 64));
    while (is_tree(guy.x, guy.y)){
	guy.x = 32 + (Math.random() * (canvas.width - 64));
	guy.y = 32 + (Math.random() * (canvas.height - 64));
    }
}


// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	labirint = [
	    [2, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 2],
	    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
	    [0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0],
	    [0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0],
	    [0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0],
	    [0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
	    [0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
	    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	    [0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0],
	    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
	    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
	    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
	    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
	    [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
	    [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
	    [2, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	    ]

	// Throw the monster somewhere on the screen randomly
	for(i in monsters){
	    var monster = monsters[i];
	    positionRandomly(monster);
	}
};

var move = function(guy, delta){
    var dist = guy.speed * delta;
    if (guy.direction == "up"){
	guy.y = is_tree(guy.x, guy.y - dist) ? guy.y : guy.y - dist;
    } else if (guy.direction == "down"){
	guy.y = is_tree(guy.x, guy.y + dist) ? guy.y : guy.y + dist;
    } else if (guy.direction == "left"){
	guy.x = is_tree(guy.x - dist, guy.y) ? guy.x : guy.x - dist;
    } else if (guy.direction == "right"){
	guy.x = is_tree(guy.x + dist, guy.y) ? guy.x : guy.x + dist;
    }

    // constraint to size
    if(guy.x < 0) guy.x = 0;
    if(guy.x > 480) guy.x = 480;
    if(guy.y < 0) guy.y = 0;
    if(guy.y > 450) guy.y = 450;
}

var caught_monster = function(hero, monster){
    return hero.x <= (monster.x + 32)
	&& monster.x <= (hero.x + 32)
	&& hero.y <= (monster.y + 32)
	&& monster.y <= (hero.y + 32);
}


// Update game objects
var update = function (delta) {
	if (38 in keysDown) { // Player holding up
	    hero.direction = "up";
	}
	if (40 in keysDown) { // Player holding down
	    hero.direction = "down";
	}
	if (37 in keysDown) { // Player holding left
	    hero.direction = "left";
	}
	if (39 in keysDown) { // Player holding right
	    hero.direction = "right";
	}
	if (hero.direction != "stopped"){
	    move(hero, delta);
	}
	if (hero.powerup != undefined){
	    hero.powerup += 1;
	    console.log("with powerup=", hero.powerup);
	}
	if (hero.powerup > 500){
	    hero.powerup = undefined;
	}

	if (eat_fruit(hero.x, hero.y)){
	    hero.powerup = 1;
	    ++fruitsEaten;
	}

	for (i in monsters){
	    var monster = monsters[i];
	    if (monster == null) continue;
	    monster.prev_x = monster.x;
	    monster.prev_y = monster.y;
	    move(monster, delta);
	    if (monster.x == monster.prev_x && monster.y == monster.prev_y){
	        monster.direction = getRandomDirection();
	    }
	    if (caught_monster(hero, monster)){
		console.log("powerup=" + hero.powerup);
		if (hero.powerup){
		    monsters[i] = null;
		} else {
		    if (hero.lives > 0){
			hero.lives--;
			reset();
		    } else {
			game_over = true;
		    }
		}
	    }
	}


	// Are they touching?
	//if (is_tree(hero.x + 15, hero.y + 15)){
	//    console.log('CAVALGANDO ARVORE');
	//}
};

// Draw everything
var render = function () {
    if (game_over){
	// Score
	ctx.fillStyle = "rgb(250, 50, 50)";
	ctx.font = "46px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("GAME OVER", 150, 200);
    } else {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	// mostrar labirinto
	for(var i = 0; i < labirint.length; i++){
	    for(var j = 0; j < labirint[i].length; j++){
		if (labirint[i][j] == TREE){
		    ctx.drawImage(treeImage, j * 30, i * 30);
		} else if (labirint[i][j] == FRUIT){
		    ctx.drawImage(fruitImage, j * 30, i * 30);
		}
	    }
	}

	if (heroReady && hero.powerup == undefined) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}
	if (hero2Ready && hero.powerup != undefined) {
		ctx.drawImage(hero2Image, hero.x, hero.y);
	}

	if (monsterReady) {
	    for (i in monsters){
		var monster = monsters[i];
		if (monster != null)
		ctx.drawImage(monsterImage, monster.x, monster.y);
	    }
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "12px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Lives: " + hero.lives, 32, 32);
    }
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
	requestAnimationFrame(main);
};

// Let's play this game!
reset();
var then = Date.now();
main();
