import { gameVar } from './gameVar.js';
import { Player } from './Player.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

canvas.width = gameVar.canvasSize.width;
canvas.height = gameVar.canvasSize.height;

ctx.fillStyle = gameVar.backgroundColour;
ctx.fillRect(0, 0, canvas.width, canvas.height);

const player = new Player({
  position: { x: canvas.width / 2, y: canvas.height / 2 },
  velocity: { x: 0, y: 0 },
});

console.log(player);
