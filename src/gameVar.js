export const gameVar = {
  backgroundColour: 'black',
  canvasSize: { width: 700, height: 700 },
  player: {
    movement: { acceleration: 0.2, max: 2, rotate: 0.05, friction: 0.99 },
    projectile: { speed: 3, rate: 1, max: 5 },
  },
  asteroid: {
    gameSpeed: 6000,
  },
};
