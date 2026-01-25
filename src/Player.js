import { gameVar } from './gameVar.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d", {alpha: false});
ctx.imageSmoothingEnabled = false;

canvas.width = gameVar.canvasSize.width;
canvas.height = gameVar.canvasSize.height;

export class Player {
  constructor({ position, velocity, color }) {
    this.position = position;
    this.velocity = velocity;
    this.color = color;
    this.rotation = -Math.PI / 2;
  }
  draw() {
    ctx.save();

    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);
    ctx.translate(-this.position.x, -this.position.y);

    ctx.beginPath();
    ctx.moveTo(this.position.x + 15, this.position.y);
    ctx.lineTo(this.position.x - 5, this.position.y - 5);
    ctx.lineTo(this.position.x - 5, this.position.y + 5);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 2.5, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
  getVertices() {
    const cos = Math.cos(this.rotation);
    const sin = Math.sin(this.rotation);

    return [
      {
        x: this.position.x + cos * 15 - sin * 0,
        y: this.position.y + sin * 15 + cos * 0,
      },
      {
        x: this.position.x + cos * -5 - sin * 5,
        y: this.position.y + sin * -5 + cos * 5,
      },
      {
        x: this.position.x + cos * -5 - sin * -5,
        y: this.position.y + sin * -5 + cos * -5,
      },
    ];
  }
}
