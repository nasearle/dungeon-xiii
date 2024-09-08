import { Sprite } from 'kontra';

function renderAmmoCount(x, y) {
  return Sprite({
    type: 'ammo',
    x: x,
    y: y,
    width: 5,
    height: 10,
    color: 'yellow',
    render() {
      this.context.fillStyle = this.color;
      this.context.fillRect(0, 0, this.width, this.height);
      this.context.beginPath();
      this.context.moveTo(this.width / 2, -this.width / 2);
      this.context.lineTo(this.width, 0);
      this.context.lineTo(0, 0);
      this.context.fill();
    }
  });
}

export { renderAmmoCount };