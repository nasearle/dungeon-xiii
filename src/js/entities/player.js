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
  dx: 0,
  dy: 0,
  radius: 30,
  maxSpeed: 3,
  ammo: 13,
  ableToShoot: true,
  handleCollision() {
    // Reset sprite back before wall collision. 1 dx is insufficient and causes
    // sticking, 3 dx causes visible bouncing. 2 dx just works. It's simpler
    // to bump both x and y than to detect which direction the wall is.
    this.x -= this.dx * 2;
    this.y -= this.dy * 2;
  },
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
      this.dx = -this.maxSpeed;
    }
    else if (keyPressed('d')) {
      this.dx = this.maxSpeed;
    }
    else {
      this.dx = 0;
    }

    if (keyPressed('s')) {
      this.dy = this.maxSpeed;
    }
    else if (keyPressed('w')) {
      this.dy = -this.maxSpeed;
    }
    else {
      this.dy = 0;
    }

    this.advance();
  }
});

onPointer('up', function() {
  player.ableToShoot = true;
});

export { player };