import {
  fase1
} from "./fase1.js";
export {
  gameover
};

var morri;
var button;
// var setupSceneInput;
var gameover = new Phaser.Scene("gameover");

gameover.preload = function () {
  this.load.image("game2", "assets/game2.png");
  this.load.audio('morri', 'assets/morri.mp3');
  this.load.spritesheet("over", "assets/over.png", {
    frameWidth: 128,
    frameHeight: 128
  });

};

gameover.create = function () {
  this.add.image(400, 300, "game2");
  this.anims.create({
    key: "game_over",
    frames: this.anims.generateFrameNumbers("over", {
      start: 0,
      end: 119
    }),
    frameRate: 15,
    repeat: -1
  });

  //this.add.sprite(400, 300, "start");
  button = this.add
    .sprite(400, 300, "over", 0)
    //.setOrigin(1, 0)
    .setInteractive();

    morri = this.sound.add('morri'); 
    morri.play();
};


gameover.update = function () {
  button.anims.play("game_over", true);
 
 

}
