import {
    start
} from "/start.js";
import {
    fase1
} from "/fase1.js";
import {
    fase2
} from "/fase2.js";

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
    scene: [start, fase1, fase2]
};

var game = new Phaser.Game(config);