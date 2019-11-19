export {
    fase3
  };
  import {
    fase2
  } from "./fase2.js";
  
  var fase3 = new Phaser.Scene("fase3");
  
  var player;
  var stars;
  var bombs;
  var platforms;
  var lava;
  var cursors;
  var score = 0;
  var gameOver = false;
  var scoreText;
  var button;
  
  fase3.preload = function () {
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
  };
  fase3.create = function () {
  
    this.add.image(400, 300, 'sky2');
  
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();
  
    //  Here we create the ground.
    platforms.create(105, 580, 'chao2'); //.setScale(2).refreshBody();
    platforms.create(685, 580, 'chao2'); //.setScale(2).refreshBody();
    //platforms.create(400, 1200, 'lava');//.setScale(2).refreshBody ();
  
    // (xxx, yyy) : x = move os lados, y = move a altura
    platforms.create(200, 380, 'ground'); //plataforma da esrquerda embaixo
    platforms.create(600, 230, 'ground'); //platafomra da direita
    platforms.create(40, 230, 'ground'); //platafomra da esquerda
    //platforms.create(290, 80, 'ground'); //plataforma de cima
    platforms.create(750, 420, 'ground'); //plat direita de baixo
  
    player = this.physics.add.sprite(100, 450, 'dude');
  
    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
  
    //  Our player animations, turning, walking left and walking right.
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
    lava = this.physics.add.sprite(395, 800, "lava");
    lava.setCollideWorldBounds(true);
    lava.allowGravity = false
    lava.setScale(2.2,0.56);
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
  
  
    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, stars, collectStar, null, this);
  
    // a bomba nao pega no personagem
    this.physics.add.collider(player, bombs, hitBomb, null, this);
    this.physics.add.collider(player, lava, hitLava, null, this);
  }
  
  fase3.update = function () {
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
  
    lava.anims.play("lava", true)
  }
  
  function collectStar(player, star) {
    star.disableBody(true, true);
  
    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);
  
    if (stars.countActive(true) === 0) {
      //  A new batch of stars to collect
      stars.children.iterate(function (child) {
  
        child.enableBody(true, child.x, 0, true, true);
  
      });
  
      var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
  
      var bomb = bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      bomb.allowGravity = false
    }
    //this.scene.start(start);
  }
  
  function hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
  }
  
  function hitLava(player, lava) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('animacao');
    gameOver = true;
  }
  
