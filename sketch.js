//variables for ever single sprite
var bomb, bombImg;
var sky, skyImg;
var warplane, planeImg, planesGroup;
var invisibleGround;
var explosion, explosionImg;
var tower, towerImg;
var ground;

var gameover, gameoverimg;
var restart, restartimg;

var score;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

function preload() {
  
  //loads all the images
  skyImg = loadImage("sky.png");
  
  bombImg = loadImage("bomb.png");
  
  explosionImg = loadImage("explosion.png");
  
  towerImg = loadImage("tower.png");
  
  gameoverimg = loadImage("gameover.png");
  
  restartimg = loadImage("restart.png");
  
  planeImg = loadImage("bomberplane.png");
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  
  //creates the sky background
  sky = createSprite(width/2, height+425, width, 10);
  sky.velocityX = -3;
  sky.addImage(skyImg);
  sky.scale = 3;
  sky.x = sky.width /2;
  
  //creates the player
  bomb = createSprite(225, height-200, 30, 30);
  bomb.addImage(bombImg);
  bomb.scale = 0.5;
  
  
  //creates the invisible ground for the player to stand on
  invisibleGround = createSprite(width/2, height+20, width, 30);
  //makes the ground invisible
  invisibleGround.visible = false;
  
  //creates the explosion
  explosion = createSprite(240, height-480);
  explosion.addImage(explosionImg);
  explosion.scale = 0.3;
  explosion.visible = false;
  
  
  //creates the eiffel tower
  tower = createSprite(100, height-235, 20, 50);
  tower.addImage(towerImg);
  //sets the collision radius for the tower
  tower.setCollider("rectangle", -250, 0, tower.width, tower.height);
  
  //creates the gameover image
  gameover = createSprite(width/2, height/2);
  gameover.addImage(gameoverimg);
  gameover.visible = false;
  
  //creates the restart button
  restart = createSprite(width/2, height/2 +150);
  restart.addImage(restartimg);
  restart.scale = 0.3;
  restart.visible = false;
  
  //creates the ground
  ground = createSprite(425, height-10, width+1500, 200);
  //makes the ground color green
  ground.shapeColor = "green";
  
  //makes the ground in front of the sky
  ground.depth = sky.depth;
  sky.depth = sky.depth -1;
  
  score = 0;
  
  //creates the planes group
  planesGroup = new Group();
  
}

function draw() {
  background(rgb(226, 226, 226));

  //tells you how to play the game
  text("Protect the Eiffel Tower by destorying the war planes by jumping by pressing the space key!", 0, 15);
  
  //if the game state is equal to play, then the game begins
  if(gameState === PLAY) {
  
  //makes the player collide with the invisible ground  
  bomb.collide(invisibleGround);
  
  //if the sky's x value is less than 0, then it's x value will go to half of it's width
    if(sky.x < 500) {
    sky.x = sky.width /2;
  }
  
  //shows the score
  text("Score:  " +score, 500, 15);
    
  //if key space is pressed and the player's y value is met, then the player will jump
  if((touches.length > 0) || keyDown("space") && bomb.y >= height-50) {
      bomb.velocityY = -25;
      touches = [];  
    }
 
  //makess the sky move
  sky.velocityX = -3;
    
  //gravity for the player
  bomb.velocityY = bomb.velocityY + 0.8;
  
  //if the planes touch the player, then the player will earn one point
  if(planesGroup.isTouching(bomb)) {
    //makes the explosion show
    explosion.visible = true;
    //destroys the individual planes
    planesGroup.destroyEach();
    //changes the score by one
    score = score +1;
  } else {
    //the explosion only lasts for 50 frame counts
    if(frameCount % 50 === 0) {  
    //hides the explosion
    explosion.visible = false;
    }
  }
  
  //creates a function for planes to spawn
    planes();

  //if the planes touches the tower, then it changes the game state to end
  if(planesGroup.isTouching(tower)) {
    gameState = END;
  }
  
  } else if(gameState === END) {
    //makes every plane not move
    planesGroup.setVelocityXEach(0);
    //makes the planes stay there forever until reset
    planesGroup.setLifetimeEach(-1);
    
    text("Score:  " +score, 500, 15);
    
    //makes the sky and the player not move
    sky.velocityX = 0;
    bomb.velocityY = 0;
    
    //makes the gameover screen and the restart button show, and makes it in front of everything
    gameover.visible = true;
    bomb.depth = gameover.depth;
    gameover.depth = gameover.depth +1;
    restart.visible = true;
    bomb.depth = restart.depth;
    restart.depth = restart.depth +1;
  }
  
  //if you click the restart button, then it activates the reset function
  if((touches.length > 0 || mousePressedOver(restart))) {
    reset();
  }

  drawSprites();
}
function planes() {
  if(frameCount % 150 === 0) {
    //creates the warplanes
    warplane = createSprite(width, height-480, 10, 10);
    //adds the image
    warplane.addImage(planeImg);
    //scales down the image
    warplane.scale = 0.3;
    
    //makes the bomb in front of the planes
    warplane.depth = bomb.depth;
    bomb.depth = bomb.depth + 1;
    
    //makes the planes move
    warplane.velocityX = -3;
    
    //gives it a lifetime value so it doesn't prevent any memory leak/doesn't make the game slow
    warplane.lifetime = 300;
    
    planesGroup.add(warplane);
  }
}
function reset() {
  //changes the game state to play
  gameState = PLAY;
  
  //hides the gameover screen and restart button
  gameover.visible = false;
  restart.visible = false;
  
  //destroys every single plane
  planesGroup.destroyEach();
  
  //resets the score back to 0
  score = 0;
}