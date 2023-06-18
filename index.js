const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

canvas.width = 500;
canvas.height = 500;

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);
