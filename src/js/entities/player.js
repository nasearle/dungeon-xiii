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
  height: 16,
  width: 16,
  color: 'white',
  maxSpeed: 3,
  ammo: 13,
  ableToShoot: true,
  handleCollision() {
    this.x -= this.dx;
    this.y -= this.dy;
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
      // idk if the player should be responsible for adding things to the scene.
      scene.add(createBullet(this.x, this.y, angle));
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