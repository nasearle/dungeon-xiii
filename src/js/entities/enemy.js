import { Sprite } from 'kontra';

function createEnemy() {
  const enemy = Sprite({
    type: 'enemy',
    x: 300,
    y: 400,
    height: 16,
    width: 16,
    color: 'red',
    setRandomDirection() {
      this.dx = Math.random() * 4 - 2;
      this.dy = Math.random() * 4 - 2;
    },
    handleCollision() {
      this.x -= this.dx;
      this.y -= this.dy;
      this.setRandomDirection();
    }
  });
  enemy.setRandomDirection();
  return enemy;
}

export { createEnemy };