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
      this.x -= this.dx;
      this.y -= this.dy;
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