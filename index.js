import { gameVar } from './src/gameVar.js';
import { Player } from './src/Player.js';
import { Projectile } from './src/Projectile.js';
import { Asteroid } from './src/Asteroid.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

canvas.width = gameVar.canvasSize.width;
canvas.height = gameVar.canvasSize.height;

ctx.fillStyle = gameVar.backgroundColour;
ctx.fillRect(0, 0, canvas.width, canvas.height);

let score = 0;
let gameOver = false;

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

const SPEED = gameVar.player.movement.max;
const ROTATIONAL_SPEED = gameVar.player.movement.rotate;
const FRICTION = gameVar.player.movement.friction;
const PROJECTILE_SPEED = gameVar.player.projectile.speed;

const projectiles = [];
const asteroids = [];

const intervalId = window.setInterval(() => {
  const index = Math.floor(Math.random() * 8);
  let x, y;
  let vx, vy;
  let radius = Math.floor(50 * Math.random() + 10 + score / 100);

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

function circleCollision(circle1, circle2) {
  const xDifference = circle2.position.x - circle1.position.x;
  const yDifference = circle2.position.y - circle1.position.y;
  const distance = Math.sqrt(
    xDifference * xDifference + yDifference * yDifference
  );
  if (distance <= circle1.radius + circle2.radius) {
    console.log('Collision');
    return true;
  }
  return false;
}

function circleTriangleCollision(circle, triangle) {
  for (let i = 0; i < 3; i++) {
    let start = triangle[i];
    let end = triangle[(i + 1) % 3];

    let dx = end.x - start.x;
    let dy = end.y - start.y;
    let length = Math.sqrt(dx * dx + dy * dy);

    let dot =
      ((circle.position.x - start.x) * dx +
        (circle.position.y - start.y) * dy) /
      Math.pow(length, 2);

    let closestX = start.x + dot * dx;
    let closestY = start.y + dot * dy;

    if (!isPointOnLineSegment(closestX, closestY, start, end)) {
      closestX = closestX < start.x ? start.x : end.x;
      closestY = closestY < start.y ? start.y : end.y;
    }

    dx = closestX - circle.position.x;
    dy = closestY - circle.position.y;

    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= circle.radius) {
      return true;
    }
  }
  return false;
}

function isPointOnLineSegment(x, y, start, end) {
  return (
    x >= Math.min(start.x, end.x) &&
    x <= Math.max(start.x, end.x) &&
    y >= Math.min(start.y, end.y) &&
    y <= Math.max(start.y, end.y)
  );
}

function animate() {
  const animationID = window.requestAnimationFrame(animate);
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

    if (circleTriangleCollision(asteroid, player.getVertices())) {
      console.log('game over');
      window.cancelAnimationFrame(animationID);
      clearInterval(intervalId);
      gameOver = true;
      // window.parent.postMessage(
      //   JSON.stringify({ asteroidScore: score }),
      //   "https://arcade-game-room.netlify.app"
      // );
    }

    if (asteroid.position.x < -asteroid.radius) {
      asteroid.position.x = canvas.width + asteroid.radius;
    } else if (asteroid.position.y < -asteroid.radius) {
      asteroid.position.y = canvas.height + asteroid.radius;
    } else if (asteroid.position.y > canvas.height + asteroid.radius) {
      asteroid.position.y = -asteroid.radius;
    } else if (asteroid.position.x > canvas.width + asteroid.radius) {
      asteroid.position.x = -asteroid.radius;
    }

    for (let j = projectiles.length - 1; j >= 0; j--) {
      const projectile = projectiles[j];
      if (circleCollision(asteroid, projectile)) {
        console.log('HIT');
        projectiles.splice(j, 1);
        console.log(asteroids[i].radius);
        console.log(asteroids[i].position);
        console.log(asteroids[i].velocity);
        score += asteroids[i].radius;
        if (asteroids[i].radius > 20) {
          asteroids.push(
            new Asteroid({
              position: {
                x: asteroids[i].position.x,
                y: asteroids[i].position.y,
              },
              velocity: {
                x: asteroids[i].velocity.x,
                y: asteroids[i].velocity.y,
              },
              radius: Math.floor(asteroids[i].radius / 2),
            })
          );
        }
        asteroids[i].velocity.x =
          -asteroids[i].velocity.x * (Math.random() + 1);
        asteroids[i].velocity.y =
          -asteroids[i].velocity.y * (Math.random() + 1);
        asteroids[i].radius -= Math.floor(asteroids[i].radius / 2);
        if (asteroids[i].radius < 10) {
          asteroids.splice(i, 1);
        }
        console.log(score);
      }
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

// window.addEventListener('keydown', (event) => {
//   console.log(event);
// });
