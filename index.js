import {
    start
} from "./start.js";
import {
    fase1
} from "./fase1.js";
import {
    fase2
} from "./fase2.js";
import {
    fase3
} from "./fase3.js";
import {
    gameover
} from "./gameover.js";



var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 300
            },
            debug: true
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        parent: "game",
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    scene: [start, fase1, fase2, fase3, gameover]
};

var game = new Phaser.Game(config);
