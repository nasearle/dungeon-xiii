import {
  Sprite,
  initKeys,
  keyPressed } from 'kontra';

initKeys();

const Player = Sprite({
  type: 'player',
  x: 300,
  y: 300,
  radius: 30,
  maxSpeed: 3,
  render() {
    this.context.strokeStyle = 'white';
    this.context.beginPath();
    this.context.arc(0, 0, this.radius, 0, Math.PI*2);
    this.context.stroke();
  },
  update() {
    // TODO: limit movement to max speed when moving diagonally
    if (keyPressed('a')) {
      this.x += -this.maxSpeed;
    }
    if (keyPressed('d')) {
      this.x += this.maxSpeed;
    }
    if (keyPressed('s')) {
      this.y += this.maxSpeed;
    }
    if (keyPressed('w')) {
      this.y += -this.maxSpeed;
    }
  }
});

export { Player };