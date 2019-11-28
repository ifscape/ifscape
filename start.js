import {
  fase1
} from "./fase1.js";
import {
  fase2
} from "./fase2.js";
import {
  fase3
} from "./fase3.js";
export {
  start
};

var button;
var setupSceneInput;
var start = new Phaser.Scene("SceneA");

start.preload = function () {
  this.load.image("sky", "assets/sky.png");
  
  this.load.spritesheet("start", "assets/start.png", {
    frameWidth: 135,
    frameHeight: 135
  });
};


start.create = function () {

  this.add.image(400, 300, "sky");

  this.anims.create({
    key: "animacao",
    frames: this.anims.generateFrameNumbers("start", {
      start: 0,
      end: 29
    }),
    frameRate: 10,
    repeat: -1
  });


  //this.add.sprite(400, 300, "start");
  button = this.add
    .sprite(400, 300, "start", 0)
    //.setOrigin(1, 0)
    .setInteractive();
 
  button.on(
    "pointerup",
    function () {
      this.scene.start(fase1);
    },
    this
  );
};

start.update = function () {
  button.anims.play("animacao", true);
}
