export {
  fase1
};
import {
  fase2
} from "./fase2.js";
import {
  gameover
} from "./gameover.js";
import {
  start
} from "./start.js";


var fase1 = new Phaser.Scene("fase1");

var player;
var player2;
var stars;
var bombs;
var platforms;
var cursors;
var grounds;
//var score = 0;
var gameOver = false;
//var scoreText;
var button;
var music;

//
var keyA, keyD, keyW;
var playerGot;
//

fase1.preload = function () {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('plat', 'assets/plat.png');
  this.load.image('tijolo', 'assets/tijolo.png');
  this.load.image('grounds', 'assets/grounds.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.image('sapo', 'assets/sapo.png');
  this.load.audio('musica', 'assets/musica.mp3');
  this.load.spritesheet("fullscreen", "assets/fullscreen.png", {
    frameWidth: 64,
    frameHeight: 64
  });
  this.load.spritesheet('dude', 'assets/dude.png', {
    frameWidth: 34,
    frameHeight: 34,
  });
  this.load.spritesheet('dude2', 'assets/dude2.png', {
    frameWidth: 34,
    frameHeight: 34,
  });
}

fase1.create = function () {

  music = this.sound.add('musica')
  //  A simple background for our game

  this.add.image(400, 300, 'sky');

  //  The platforms group contains the ground and the 2 ledges we can jump on
  platforms = this.physics.add.staticGroup();
  platforms.create(400, 600, 'grounds'); //.setScale(2).refreshBody();

  //  Now let's create some ledges
  // (xxx, yyystart) : x = move os lados, y = move a altura
  platforms.create(400, 250, 'plat');
  platforms.create(850, 130, 'ground');
  platforms.create(400, 400, 'ground');

  platforms.create(30, 130, 'plat');

  platforms.create(105, 101, 'tijolo');
  platforms.create(675, 101, 'tijolo');
  //platforms.create(290, 80, 'ground');
  platforms.create(400, 227, 'sapo');

  // The player and its settings
  player = this.physics.add.sprite(700, 450, 'dude');
  player.setScale(1);
  player.setSize(27, 32, true);


  //  Player physics properties. Give the little guy a slight bounce.
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  //
  // The player and its settings
  player2 = this.physics.add.sprite(100, 450, 'dude2');
  player2.setScale(1);
  player2.setSize(27, 32, true);


  //  Player physics properties. Give the little guy a slight bounce.
  player2.setBounce(0.2);
  player2.setCollideWorldBounds(true);
  //

  //  Our playstarter animations, turning, walking left and walking right.

  //Player 1: direcionais
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', {
      start: 0,
      end: 3
    }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [{
      key: 'dude',
      frame: 4
    }],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', {
      start: 5,
      end: 8
    }),
    frameRate: 10,
    repeat: -1
  });
  //Player 2: WASD
  this.anims.create({
    key: 'left2',
    frames: this.anims.generateFrameNumbers('dude2', {
      start: 0,
      end: 3
    }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn2',
    frames: [{
      key: 'dude2',
      frame: 4
    }],
    frameRate: 20
  });

  this.anims.create({
    key: 'right2',
    frames: this.anims.generateFrameNumbers('dude2', {
      start: 5,
      end: 8
    }),
    frameRate: 10,
    repeat: -1
  });

  //  Input Events
  cursors = this.input.keyboard.createCursorKeys();
  //
  keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  //

  //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
  stars = this.physics.add.group({
    key: 'star',
    repeat: 1,
    setXY: {
      x: 62,
      y: 8,
      stepX: 658
    }
  });

  stars.children.iterate(function (child) {
    //  Give each star a slightly different bounce
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  // BOMBAAA CAINDOOOOO
  bombs = this.physics.add.group();

  var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
  var bomb1 = bombs.create(x, 16, 'bomb');

  //var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
  //var bomb2 = bombs.create(x, 16, 'bomb');

  bomb1.setBounce(1);
  bomb1.setCollideWorldBounds(true);
  bomb1.setVelocity(Phaser.Math.Between(-200, 200), 20);
  bomb1.allowGravity = false

  // bomb2.setBounce(1);
  //  bomb2.setCollideWorldBounds(true);
  //  bomb2.setVelocity(Phaser.Math.Between(-200, 200), 20);
  // bomb2.allowGravity = false
  //

  //  The score
  

  //  Collide the player and the stars with the platforms
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(stars, platforms);
  this.physics.add.collider(bombs, platforms);
  //
  this.physics.add.collider(player2, platforms);
  //

  //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
  this.physics.add.overlap(player2, stars, collectStar, null, this);
  this.physics.add.overlap(player2, stars, collectStar, null, this);
  this.physics.add.collider(player2, bombs, hitBomb, null, this);
  //
  this.physics.add.overlap(player, stars, collectStar, null, this);
  this.physics.add.overlap(player, stars, collectStar, null, this);
  this.physics.add.collider(player, bombs, hitBomb, null, this);
  //


  const fullscreenButton = this.add
    .image(this.scale.width - 16, 16, "fullscreen", 0)
    .setOrigin(1, 0)
    .setInteractive();

  // Ao clicar no botão de tela cheia
  fullscreenButton.on("pointerup", () => {
    if (this.scale.isFullscreen) {
      fullscreenButton.setFrame(0);
      this.scale.stopFullscreen();
    } else {
      fullscreenButton.setFrame(1);
      this.scale.startFullscreen();
    }
  });
  music.play();
}


fase1.update = function () {
  if (gameOver) {
    this.scene.start(gameover);;
  }
  // Player 1: direcionais
  if (cursors.left.isDown) {
    player.setVelocityX(-160);

    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);

    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);

    player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }

  //
  if (keyA.isDown) {
    player2.setVelocityX(-160);

    player2.anims.play('left2', true);
  } else if (keyD.isDown) {
    player2.setVelocityX(160);

    player2.anims.play('right2', true);
  } else {
    player2.setVelocityX(0);

    player2.anims.play('turn2');
  }

  if (keyW.isDown && player2.body.touching.down) {
    player2.setVelocityY(-330);
  }
  //
}

function collectStar(player, star) {
  //
  if (playerGot !== player) {
    star.disableBody(true, true);

    if (stars.countActive(true) === 0) {
      this.scene.start(fase2);
    }
  }
  playerGot = player
  //
}

function hitBomb(playerHit, bomb) {
  this.physics.pause();
  playerHit.setTint(0xff0000);
  playerHit.anims.play('turn');
  gameOver = true;
  music.stop();
}
