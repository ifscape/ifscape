import {
    fase3
  } from "./fase3.js";
  export {
    win
  };
  
  var button;
  // var setupSceneInput;
  var win = new Phaser.Scene("win");
  
  win.preload = function () {
    this.load.image("win", "assets/win.png");
    this.load.spritesheet("winner", "assets/winner.png", {
      frameWidth: 130,
      frameHeight: 130
    });
  
  };
  
  win.create = function () {
    this.add.image(400, 300, "win");
    this.anims.create({
      key: "win_scene",
      frames: this.anims.generateFrameNumbers("winner", {
        start: 0,
        end: 109
      }),
      frameRate: 15,
      repeat: -1
    });
  
    //this.add.sprite(400, 300, "start");
    button = this.add
      .sprite(400, 300, "win", 0)
      //.setOrigin(1, 0)
      .setInteractive();
  };
  
  win.update = function () {
    button.anims.play("win_scene", true);
  }
  
