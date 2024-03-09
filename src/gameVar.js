export const gameVar = {
  backgroundColour: 'black',
  canvasSize: { width: 800, height: 800 },
  player: {
    movement: { acceleration: 0.2, max: 2, rotate: 0.05, friction: 0.99 },
    projectile: { speed: 3, rate: 8, max: 5 },
  },
  asteroid: {
    gameSpeed: 6000,
    size: 10,
  },
};
