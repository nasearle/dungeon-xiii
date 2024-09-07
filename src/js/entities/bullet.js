import { Sprite } from 'kontra';

function createBullet(x, y, angle, width, height) {
  return Sprite({
    type: 'bullet',
    x: x - width / 2,
    y: y - height / 2,
    speed: 5,
    dx: Math.cos((angle / 180) * Math.PI) * 5,
    dy: Math.sin((angle / 180) * Math.PI) * 5,
    height: height,
    width: width,
    color:'green',
    ttl: 100,
    handleCollision() {
      //TODO: Add an animation.
      this.ttl = 0;
    }
  });
}

export { createBullet };