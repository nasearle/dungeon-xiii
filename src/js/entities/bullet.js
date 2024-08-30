import { Sprite } from 'kontra';

function createBullet(x, y, angle) {
  return Sprite({
    type: 'bullet',
    x: x,
    y: y,
    speed: 5,
    dx: Math.cos((angle / 180) * Math.PI) * 5,
    dy: Math.sin((angle / 180) * Math.PI) * 5,
    radius: 10,
    render() {
      this.context.strokeStyle = 'green';
      this.context.beginPath();
      this.context.arc(0, 0, this.radius, 0, Math.PI*2);
      this.context.stroke();
    }
  });
}

export { createBullet };