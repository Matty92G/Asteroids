import { gameVar } from './gameVar.js';
import { Player } from './Player.js';
import { Projectile } from './Projectile.js';
import { Asteroid } from './Asteroid.js';

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
const PROJECTILE_SPEED = 2;

const projectiles = [];
const asteroids = [];

const intervalId = window.setInterval(() => {
  const index = Math.floor(Math.random() * 8);
  let x, y;
  let vx, vy;
  let radius = 50 * Math.floor(Math.random()) + 10;

  switch (index) {
    case 0:
      x = 0 - radius;
      y = (Math.random() * canvas.height) / 2;
      vx = 1;
      vy = 0.5;
      break;
    case 1:
      x = (Math.random() * canvas.width) / 2;
      y = canvas.height + radius;
      vx = 0.5;
      vy = -1;
      break;
    case 2:
      x = canvas.width + radius;
      y = (Math.random() * canvas.height) / 2;
      vx = -1;
      vy = 0.5;
      break;
    case 3:
      x = (Math.random() * canvas.width) / 2;
      y = 0 - radius;
      vx = 0.5;
      vy = 1;
      break;
    case 4:
      x = 0 - radius;
      y = canvas.height + radius;
      vx = 1;
      vy = -1;
      break;
    case 5:
      x = canvas.width + radius;
      y = canvas.height + radius;
      vx = -1;
      vy = -1;
      break;
    case 6:
      x = canvas.width + radius;
      y = 0 - radius;
      vx = -1;
      vy = 1;
      break;
    case 7:
      x = 0 - radius;
      y = 0 - radius;
      vx = 1;
      vy = 1;
      break;
  }

  asteroids.push(
    new Asteroid({
      position: {
        x: x,
        y: y,
      },
      velocity: {
        x: vx,
        y: vy,
      },
      radius,
    })
  );
  console.log(asteroids);
}, gameVar.asteroid.gameSpeed);

function animate() {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = gameVar.backgroundColour;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  player.update();

  for (let i = projectiles.length - 1; i >= 0; i--) {
    const projectile = projectiles[i];
    projectile.update();

    if (
      projectile.position.x + projectile.radius < 0 ||
      projectile.position.x - projectile.radius > canvas.width ||
      projectile.position.y - projectile.radius > canvas.height ||
      projectile.position.y + projectile.radius < 0
    ) {
      projectiles.splice(i, 1);
    }
  }

  for (let i = asteroids.length - 1; i >= 0; i--) {
    const asteroid = asteroids[i];
    asteroid.update();
    if (
      asteroid.position.x + asteroid.radius < 0 ||
      asteroid.position.x - asteroid.radius > canvas.width ||
      asteroid.position.y - asteroid.radius > canvas.height ||
      asteroid.position.y + asteroid.radius < 0
    ) {
      asteroids.splice(i, 1);
    }
  }

  if (player.position.x > canvas.width + 10) {
    player.position.x = -10;
  } else if (player.position.y > canvas.height + 10) {
    player.position.y = -10;
  } else if (player.position.x < -10) {
    player.position.x = canvas.width + 10;
  } else if (player.position.y < -10) {
    player.position.y = canvas.height + 10;
  } else if (keys.s.pressed && keys.w.pressed) {
    player.velocity.x = Math.cos(player.rotation) * SPEED * 0.8;
    player.velocity.y = Math.sin(player.rotation) * SPEED * 0.8;
  } else if (keys.shift.pressed && keys.w.pressed) {
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
    case 'Space':
      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + Math.cos(player.rotation) * 30,
            y: player.position.y + Math.sin(player.rotation) * 30,
          },
          velocity: {
            x: Math.cos(player.rotation) * PROJECTILE_SPEED,
            y: Math.sin(player.rotation) * PROJECTILE_SPEED,
          },
        })
      );
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
    case 'Space':
      keys.shift.pressed = false;
      break;
  }
});

window.addEventListener('keydown', (event) => {
  console.log(event);
});
