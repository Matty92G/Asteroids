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

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  shift: {
    pressed: false,
  },
};

const SPEED = 3;
const ROTATIONAL_SPEED = 0.05;
const FRICTION = 0.99;

function animate() {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = gameVar.backgroundColour;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  player.update();
  if (keys.shift.pressed && keys.w.pressed) {
    player.velocity.x = Math.cos(player.rotation) * SPEED * 1.5;
    player.velocity.y = Math.sin(player.rotation) * SPEED * 1.5;
  } else if (keys.w.pressed) {
    player.velocity.x = Math.cos(player.rotation) * SPEED;
    player.velocity.y = Math.sin(player.rotation) * SPEED;
  } else if (!keys.w.pressed && keys.s.pressed) {
    player.velocity.x *= FRICTION / 1.05;
    player.velocity.y *= FRICTION / 1.05;
  } else if (!keys.w.pressed) {
    player.velocity.x *= FRICTION;
    player.velocity.y *= FRICTION;
  }

  if (keys.d.pressed) {
    player.rotation += ROTATIONAL_SPEED;
  } else if (keys.a.pressed) {
    player.rotation -= ROTATIONAL_SPEED;
  }
}

animate();

window.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyW':
      keys.w.pressed = true;
      break;
    case 'KeyA':
      keys.a.pressed = true;
      break;
    case 'KeyD':
      keys.d.pressed = true;
      break;
    case 'KeyS':
      keys.s.pressed = true;
      break;
    case 'ShiftLeft':
      keys.shift.pressed = true;
      break;
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'KeyW':
      keys.w.pressed = false;
      break;
    case 'KeyA':
      keys.a.pressed = false;
      break;
    case 'KeyD':
      keys.d.pressed = false;
      break;
    case 'KeyS':
      keys.s.pressed = false;
      break;
    case 'ShiftLeft':
      keys.shift.pressed = false;
      break;
  }
});

window.addEventListener('keydown', (event) => {
  console.log(event);
});
