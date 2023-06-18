import { gameVar } from './gameVar.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

canvas.width = gameVar.canvasSize.width;
canvas.height = gameVar.canvasSize.height;

ctx.fillStyle = gameVar.backgroundColour;
ctx.fillRect(0, 0, canvas.width, canvas.height);
