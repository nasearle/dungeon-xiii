import { Sprite } from 'kontra';

function createEnemy() {
  return Sprite({
    type: 'enemy',
    x: 500,
    y: 500,
    dx: Math.random() * 4 - 2,
    dy: Math.random() * 4 - 2,
    radius: 30,
    render() {
      this.context.strokeStyle = 'red';
      this.context.beginPath();
      this.context.arc(0, 0, this.radius, 0, Math.PI*2);
      this.context.stroke();
    }
  });
}

export { createEnemy };