import { Pool, Sprite } from 'kontra';

// TODO: using a bullet pool is overkill. revert to single Sprite.
const bulletPool = Pool({
  create: Sprite
});

function createBullet(x, y, angle) {
  bulletPool.get({
    type: 'bullet',
    x: x,
    y: y,
    speed: 5,
    dx: Math.cos((angle / 180) * Math.PI) * 5,
    dy: Math.sin((angle / 180) * Math.PI) * 5,
    radius: 10,
    ttl: 100,
    handleWallCollision() {
      //TODO: Add an animation.
      this.ttl = 1;
    },
    render() {
      this.context.strokeStyle = 'green';
      this.context.beginPath();
      this.context.arc(0, 0, this.radius, 0, Math.PI*2);
      this.context.stroke();
    }
  });
}

export { createBullet, bulletPool };