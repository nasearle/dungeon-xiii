import {
  Sprite,
  keyPressed,
  pointerPressed,
  getPointer,
  onPointer } from 'kontra';
import { angleToTarget } from '../util';
import { createBullet } from './bullet';
import { scene } from '../scene';
import { Direction } from './wall'

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
  ableToMoveLeft: true,
  ableToMoveRight: true,
  ableToMoveUp: true,
  ableToMoveDown: true,
  handleWallCollision(wallDirection) {
    switch (wallDirection) {
      // Collision implies that the player is _already_ past the obstacle
      // by one frame, so we need to bump them back the opposite direction.
      case Direction.LEFT:
        this.ableToMoveLeft = false;
        this.x += this.maxSpeed;
        break;
      case Direction.RIGHT:
        this.ableToMoveRight = false
        this.x -= this.maxSpeed;
        break;
      case Direction.UP:
        this.ableToMoveUp = false
        this.y += this.maxSpeed;
        break;
      case Direction.DOWN:
        this.ableToMoveDown = false
        this.y -= this.maxSpeed;
        break;
      default:
        throw new Error('Unknown wall direction');
    }
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
    if (keyPressed('a') && this.ableToMoveLeft) {
      this.dx = -this.maxSpeed;
    }
    else if (keyPressed('d') && this.ableToMoveRight) {
      this.dx = this.maxSpeed;
    }
    else {
      this.dx = 0;
    }

    if (keyPressed('s') && this.ableToMoveDown) {
      this.dy = this.maxSpeed;
    }
    else if (keyPressed('w') && this.ableToMoveUp) {
      this.dy = -this.maxSpeed;
    }
    else {
      this.dy = 0;
    }
    this.advance();
    this.ableToMoveLeft = true;
    this.ableToMoveRight = true;
    this.ableToMoveUp = true;
    this.ableToMoveDown = true;
  }
});

onPointer('up', function() {
  player.ableToShoot = true;
});

export { player };