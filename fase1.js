export {
  fase1
};
import {
  fase2
} from "./fase2.js";

var fase1 = new Phaser.Scene("fase1");

var player;
var stars;
var bombs;
var platforms;
var cursors;
var grounds;
var score = 0;
var gameOver = false;
var scoreText;

fase1.preload = function () {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('grounds', 'assets/grounds.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.spritesheet('dude', 'assets/dude.png', {
    frameWidth: 34,
    frameHeight: 34,
  });
}

fase1.create = function () {
  //  A simple background for our game
  this.add.image(400, 300, 'sky');

  //  The platforms group contains the ground and the 2 ledges we can jump on
  platforms = this.physics.add.staticGroup();
  platforms.create(400, 600, 'grounds'); //.setScale(2).refreshBody();

  //  Now let's create some ledges
  // (xxx, yyystart) : x = move os lados, y = move a altura
  platforms.create(400, 400, 'ground');
  platforms.create(800, 250, 'ground');
  platforms.create(40, 230, 'ground');
  platforms.create(290, 80, 'ground');

  // The player and its settings
  player = this.physics.add.sprite(100, 450, 'dude');

  //  Player physics properties. Give the little guy a slight bounce.
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  //  Our playstarter animations, turning, walking left and walking right.
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

  //  Input Events
  cursors = this.input.keyboard.createCursorKeys();

  //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
  stars = this.physics.add.group({
    key: 'star',
    repeat: 3,
    setXY: {
      x: 62,
      y: 8,
      stepX: 230
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

  var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
  var bomb2 = bombs.create(x, 16, 'bomb');

  bomb1.setBounce(1);
  bomb1.setCollideWorldBounds(true);
  bomb1.setVelocity(Phaser.Math.Between(-200, 200), 20);
  bomb1.allowGravity = false

  bomb2.setBounce(1);
  bomb2.setCollideWorldBounds(true);
  bomb2.setVelocity(Phaser.Math.Between(-200, 200), 20);
  bomb2.allowGravity = false
  //

  //  The score
  scoreText = this.add.text(16, 16, 'score: 0', {
    fontSize: '32px',
    fill: '#000'
  });

  //  Collide the player and the stars with the platforms
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(stars, platforms);
  this.physics.add.collider(bombs, platforms);

  //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
  this.physics.add.overlap(player, stars, collectStar, null, this);

  // a bomba nao pega no personagem
  this.physics.add.collider(player, bombs, hitBomb, null, this);
}

fase1.update = function () {
  if (gameOver) {
    return;
  }

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
}

function collectStar(player, star) {
  star.disableBody(true, true);


  score += 10;
  scoreText.setText('Score: ' + score);

  if (stars.countActive(true) === 0) {
    //  A new batch of stars to collect
    stars.children.iterate(function (child) {

      child.enableBody(true, child.x, 0, true, true);

    });
    //
  }
  this.scene.start(fase2);

}

function hitBomb(player, bomb) {
  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play('turn');

  gameOver = true;


}
