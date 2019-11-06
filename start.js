import {
    fase1
} from "./fase1.js";
import {
    fase2
} from "./fase2.js";
export {
    start

};

var setupSceneInput;
var start = new Phaser.Scene("SceneA");

start.preload = function () {
    this.load.image("Sky2", "assets/sky2.png")
    this.load.image("start", "assets/start.png")
};


start.create = function () {
    this.add.image(400, 300, "Sky2");



    //this.add.sprite(400, 300, "start");
    var button = this.add
        .image(460, 200, "start", 0)
        .setOrigin(1, 0)
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

}
