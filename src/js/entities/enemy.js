import { Sprite } from 'kontra';
import { Direction } from './wall'

function createEnemy() {
  return Sprite({
    type: 'enemy',
    x: 500,
    y: 500,
    dx: Math.random() * 4 - 2,
    dy: Math.random() * 4 - 2,
    radius: 30,
    handleWallCollision(wallDirection) {
      // Hack: we need to bump the sprite back to avoid getting stuck in loop.
      // I couldn't figure out how to make this relative to sprite velocity...
      const bumpBackDistance = 5;
      switch (wallDirection) {
        case Direction.LEFT:
          this.x += bumpBackDistance;
          this.dx = -this.dx;
          this.dy = Math.random() * 4 - 2;
          break;
        case Direction.RIGHT:
          this.x -= bumpBackDistance;
          this.dx = -this.dx;
          this.dy = Math.random() * 4 - 2;
          break;
        case Direction.UP:
          this.y += bumpBackDistance;
          this.dx -= Math.random() * 4 - 2;
          this.dy = -this.dy;
          break;
        case Direction.DOWN:
          this.y -= bumpBackDistance;
          this.dx -= Math.random() * 4 - 2;
          this.dy = -this.dy;
          break;
        default:
          throw new Error('Unknown wall direction');
      }
    },
    render() {
      this.context.strokeStyle = 'red';
      this.context.beginPath();
      this.context.arc(0, 0, this.radius, 0, Math.PI*2);
      this.context.stroke();
    }
  });
}

export { createEnemy };