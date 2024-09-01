import { Sprite } from 'kontra';

function createEnemy() {
  const enemy = Sprite({
    type: 'enemy',
    x: 400,
    y: 400,
    radius: 30,
    setRandomDirection() {
      this.dx = Math.random() * 4 - 2;
      this.dy = Math.random() * 4 - 2;
    },
    handleCollision() {
      // Reset sprite back before wall collision. 1 dx is insufficient and
      // causes sticking, 3 dx causes visible bouncing. 2 dx just works. It's
      // simpler to bump both x and y than to detect which direction the wall
      // is.
      this.x -= this.dx * 2;
      this.y -= this.dy * 2;
      this.setRandomDirection();
    },
    render() {
      this.context.strokeStyle = 'red';
      this.context.beginPath();
      this.context.arc(0, 0, this.radius, 0, Math.PI*2);
      this.context.stroke();
    }
  });
  enemy.setRandomDirection();
  return enemy;
}

export { createEnemy };