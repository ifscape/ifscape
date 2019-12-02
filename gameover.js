import {
  fase1
} from "./fase1.js";
export {
  gameover
};

var button;
// var setupSceneInput;
var gameover = new Phaser.Scene("gameover");

gameover.preload = function () {
  this.load.image("game2", "assets/game2.png");
  this.load.spritesheet("over", "assets/over.png", {
    frameWidth: 130,
    frameHeight: 130
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
};

gameover.update = function () {
  button.anims.play("game_over", true);
  music.stop();

}
