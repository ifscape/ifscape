export {
  fase2
};
import {
  fase3
} from "./fase3.js";
import {
  gameover
} from "./gameover.js";

var fase2 = new Phaser.Scene("fase2");

var player;
var player2;
var stars;
var bombs;
var platforms;
var lava;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var button;
var keyA, keyD, keyW;
var playerGot;


fase2.preload = function () {
  this.load.image('sky2', 'assets/sky2.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('chao2', 'assets/chao2.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.spritesheet('dude', 'assets/dude.png', {

    frameWidth: 34,
    frameHeight: 34,
  });
  this.load.spritesheet("lava", "assets/lava.png", {
    frameWidth: 80,
    frameHeight: 80,
  });

  this.load.spritesheet('dude2', 'assets/dude2.png', {
    frameWidth: 34,
    frameHeight: 34,
  });
};
fase2.create = function () {

  this.add.image(400, 300, 'sky2');

  //  The platforms group contains the ground and the 2 ledges we can jump on
  platforms = this.physics.add.staticGroup();

  //  Here we create the ground.
  platforms.create(106, 582, 'chao2'); //.setScale(2).refreshBody();
  platforms.create(684, 582, 'chao2'); //.setScale(2).refreshBody();
  
  // (xxx, yyy) : x = move os lados, y = move a altura
  platforms.create(200, 365, 'ground'); //plataforma da esrquerda embaixo
  platforms.create(600, 230, 'ground'); //platafomra da direita
  platforms.create(40, 230, 'ground'); //platafomra da esquerda
  //platforms.create(290, 80, 'ground'); //plataforma de cima
  platforms.create(750, 420, 'ground'); //plat direita de baixo

  player = this.physics.add.sprite(100, 450, 'dude');

  //  Player physics properties. Give the little guy a slight bounce.
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  player2 = this.physics.add.sprite(100, 450, 'dude2');
  player2.setScale(1);
  player2.setSize(27, 32, true);


  //  Player physics properties. Give the little guy a slight bounce.
  player2.setBounce(0.2);
  player2.setCollideWorldBounds(true);

  //  Our player animations, turning, walking left and walking right.

  //Player 1: direcionais
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', {
      start: 0,
      end: 4
    }),
    frameRate: 10,
    repeat: -1
  });


  this.anims.create({
    key: 'turn',
    frames: [{
      key: 'dude',
      frame: 5
    }],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', {
      start: 7,
      end: 10
    }),
    frameRate: 10,
    repeat: -1
  });
  //Pĺayer 2: WASD
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

  this.anims.create({
    key: "lava",
    frames: this.anims.generateFrameNumbers("lava", {
      start: 0,
      end: 5
    }),
    frameRate: 8,
    repeat: -1
  });


  //  Input Events
  cursors = this.input.keyboard.createCursorKeys();

  keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

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

  //
  bombs = this.physics.add.group();

  var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
  var bomb1 = bombs.create(x, 18, 'bomb');

  var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
  var bomb2 = bombs.create(x, 18, 'bomb');

  bomb1.setBounce(1);
  bomb1.setCollideWorldBounds(true);
  bomb1.setVelocity(Phaser.Math.Between(-200, 200), 20);
  bomb1.allowGravity = false

  bomb2.setBounce(1);
  bomb2.setCollideWorldBounds(true);
  bomb2.setVelocity(Phaser.Math.Between(-200, 200), 20);
  bomb2.allowGravity = false
  //
  lava = this.physics.add.sprite(395, 800, "lava");
  lava.setCollideWorldBounds(true);
  lava.allowGravity = false
  lava.setScale(2.2, 0.5);
  //  The score
  scoreText = this.add.text(16, 16, 'score: 0', {
    fontSize: '32px',
    fill: '#000'
  });



  //  Collide the player and the stars with the platforms
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(stars, platforms);
  this.physics.add.collider(bombs, platforms);
  this.physics.add.collider(lava, platforms);
  this.physics.add.collider(player2, platforms);


  //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
  this.physics.add.overlap(player, stars, collectStar, null, this);
  this.physics.add.overlap(player2, stars, collectStar, null, this);

  // a bomba nao pega no personagem
  this.physics.add.collider(player, bombs, hitBomb, null, this);
  this.physics.add.collider(player, lava, hitLava, null, this);

  this.physics.add.collider(player2, bombs, hitBomb, null, this);
  this.physics.add.collider(player2, lava, hitLava, null, this);

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
      music
      fullscreenButton.setFrame(1);
      this.scale.startFullscreen();
    }
  });
}

fase2.update = function () {
  if (gameOver) {
    this.scene.start(gameover);;
  }
  //player 1: direcionais
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

  //Player 2: WASD
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

  lava.anims.play("lava", true);
}


function collectStar(player, star) {
  //
  if (playerGot !== player) {
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0) {
      this.scene.start(fase3);
    }
  }
  playerGot = player
  //
}


function hitBomb(player, bomb) {
  this.physics.pause();
  player.setTint(0xff0000);
  player.anims.play('turn');
  gameOver = true;
  music.stop();
}

function hitLava(player, lava) {
  this.physics.pause();
  player.setTint(0xff0000);
  player.anims.play('turn');
  gameOver = true;
  music.stop();
}
