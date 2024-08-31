import {
  Sprite,
  keyPressed,
  pointerPressed,
  getPointer,
  onPointer } from 'kontra';
import { angleToTarget } from '../util/util';
import { createBullet } from './bullet';
import { scene } from '../scene';

const player = Sprite({
  type: 'player',
  x: 300,
  y: 300,
  radius: 30,
  maxSpeed: 3,
  ammo: 13,
  ableToShoot: true,
  render() {
    this.context.strokeStyle = 'white';
    this.context.beginPath();
    this.context.arc(0, 0, this.radius, 0, Math.PI*2);
    this.context.stroke();
  },
  update() {
    if (pointerPressed('left') && this.ableToShoot && this.ammo > 0) {
      const lastAmmo = scene.objects.findLast(obj => {
        return obj.type == 'ammo'
      })
      scene.remove(lastAmmo);
      this.ammo -= 1;
      this.ableToShoot = false;
      const pointer = getPointer();
      const angle = angleToTarget(this, pointer);
      createBullet(this.x, this.y, angle);
    }

    // TODO: limit movement to max speed when moving diagonally
    // TODO: if more than one key is pressed, the latest key should take
    // precedence
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

onPointer('up', function() {
  player.ableToShoot = true;
});

export { player };