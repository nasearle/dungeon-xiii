import { Sprite } from 'kontra';

const speed = 10;

function createBullet(x, y, angle, width, height) {
  return Sprite({
    type: 'bullet',
    x: x - width / 2,
    y: y - height / 2,
    dx: Math.cos(angle) * speed,
    dy: Math.sin(angle) * speed,
    height: height,
    width: width,
    color: 'yellow',
    ttl: 100,
    handleCollision() {
      //TODO: Add an animation.
      this.ttl = 0;
    },
    update() {
      this.advance();
    }
  });
}

export { createBullet };