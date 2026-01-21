const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
    let ranColor;
    let RandomColor = Math.floor(Math.random() * 4);
    switch (RandomColor) {
      case 0:
        ranColor = "red";
        break;
      case 1:
        ranColor = "yellow";
        break;
      case 2:
        ranColor = "blue";
        break;
      case 3:
        ranColor = "green";
        break;
    }
ctx.imageSmoothingEnabled = false;

export class Projectile {
  constructor({ position, velocity, color }) {
    this.position = position;
    this.velocity = velocity;
    this.color = color;
    this.radius = 3;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2,
      false
    );
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
