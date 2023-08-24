export const gameVar = {
  backgroundColour: 'black',
  canvasSize: { width: 500, height: 500 },
  player: {
    movement: { acceleration: 0.2, max: 3, rotate: 0.05, friction: 0.99 },
    projectile: { speed: 3, rate: 1, max: 5 },
  },
  asteroid: {
    gameSpeed: 3000,
  },
};
