import { Sprite } from 'kontra';

function createAmmo(x, y) {
  return Sprite({
    type: 'ammo',
    x: x,
    y: y,
    width: 5,
    height: 10,
    color: 'white'
  });
}

export { createAmmo };