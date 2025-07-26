export const shapes = {
  O: {
    blocks: [
      { i: -2, j: 4 },
      { i: -2, j: 5 },
      { i: -1, j: 4 },
      { i: -1, j: 5 },
    ],
    rotationCenter: { i: -1.5, j: 4.5 },
  },
  I: {
    blocks: [
      { i: -4, j: 5 },
      { i: -3, j: 5 },
      { i: -2, j: 5 },
      { i: -1, j: 5 },
    ],
    rotationCenter: { i: -2.5, j: 5 },
  },
  S: {
    blocks: [
      { i: -2, j: 4 },
      { i: -2, j: 5 },
      { i: -1, j: 3 },
      { i: -1, j: 4 },
    ],
    rotationCenter: { i: -1.5, j: 4 },
  },
  Z: {
    blocks: [
      { i: -2, j: 3 },
      { i: -2, j: 4 },
      { i: -1, j: 4 },
      { i: -1, j: 5 },
    ],
    rotationCenter: { i: -1.5, j: 4 },
  },
  L: {
    blocks: [
      { i: -3, j: 5 },
      { i: -2, j: 5 },
      { i: -1, j: 5 },
      { i: -1, j: 6 },
    ],
    rotationCenter: { i: -2, j: 5 },
  },
  J: {
    blocks: [
      { i: -3, j: 5 },
      { i: -2, j: 5 },
      { i: -1, j: 5 },
      { i: -1, j: 4 },
    ],
    rotationCenter: { i: -2, j: 5 },
  },
  T: {
    blocks: [
      { i: -2, j: 4 },
      { i: -2, j: 5 },
      { i: -2, j: 6 },
      { i: -1, j: 5 },
    ],
    rotationCenter: { i: -2, j: 5 },
  },
};

export function generateRandomShape() {
  const shapeInitials = Object.keys(shapes);
  const randomShapeInitial = shapeInitials[Math.floor(Math.random() * shapeInitials.length)];

  const shape = shapes[randomShapeInitial];

  return {
    name: randomShapeInitial,
    blocks: shape.blocks.map(({ i, j }) => ({ i, j })),
    rotationCenter: { ...shape.rotationCenter },
  };
}
