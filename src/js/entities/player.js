import {
  Sprite,
  SpriteSheet,
  keyPressed,
  pointerPressed,
  getPointer,
  onPointer } from 'kontra';
import { removeFromArray, angleToTarget } from '../util/util';
import { createBullet } from './bullet';

function createPlayer(scene, tileEngine, canvas, playerSheet, playerLoc) {
  const worldWidth = tileEngine.tilewidth * tileEngine.width;
  const worldHeight = tileEngine.tileheight * tileEngine.height;

  const spriteSheet = SpriteSheet({
    image: playerSheet,
    frameWidth: 32,
    frameHeight: 32,
    animations: {
      idle: {
        frames: '0..3',
        frameRate: 4
      },
      run: {
        frames: '4..9',
        frameRate: 4
      }
    }
  });

  const player = Sprite({
    type: 'player',
    x: playerLoc.x,
    y: playerLoc.y,
    dx: 0,
    dy: 0,
    height: 32,
    width: 32,
    maxSpeed: 1,
    ammo: 13,
    ableToShoot: true,
    // Defines the minimum distance between the player and the canvas edge
    // required to move the camera, as a percentage of canvas size. Closer to 1
    // means there's a bigger deadzone and 0.5 means no deadzone.
    cameraDeadzone: 0.6,
    cameraLastMove: {
      dx: 0,
      dy: 0
    },
    animations: spriteSheet.animations,
    handleCollision() {
      this.x -= this.dx;
      this.y -= this.dy;
      tileEngine.sx -= this.cameraLastMove.dx;
      tileEngine.sy -= this.cameraLastMove.dy;
    },
    update() {
      const playerCenter = {
        x: this.x + this.width / 2,
        y: this.y + this.height / 2
      };
      if (pointerPressed('left') && this.ableToShoot && this.ammo > 0) {
        const lastAmmo = scene.hudObjects.findLast(obj => {
          return obj.type == 'ammo'
        })
        removeFromArray(scene.hudObjects, lastAmmo);
        this.ammo -= 1;
        this.ableToShoot = false;
        const pointer = getPointer();
        // Account for camera offset.
        pointer.x += tileEngine.sx;
        pointer.y += tileEngine.sy;
                
        const angle = angleToTarget(playerCenter, pointer);
        // idk if the player should be responsible for adding things to the scene.
        scene.add(
          createBullet(
            this.x + this.width / 2,
            this.y + this.height / 2,
            angle,
            4,
            4
          )
        );
      }

      if (keyPressed('a') ||
          keyPressed('d') ||
          keyPressed('s') ||
          keyPressed('w'))
      {
        if (this.currentAnimation != 'run') {
          this.playAnimation('run');
        }
      } else {
        if (this.currentAnimation != 'idle') {
          this.playAnimation('idle');
        }
      }

      const xCameraDeadzone = canvas.width * this.cameraDeadzone;
      const yCameraDeadzone = canvas.height * this.cameraDeadzone;
  
      // TODO: limit movement to max speed when moving diagonally
      // TODO: if more than one key is pressed, the latest key should take
      // precedence
      if (keyPressed('a')) {
        this.dx = -this.maxSpeed;
        if (playerCenter.x < worldWidth - xCameraDeadzone &&
          playerCenter.x - tileEngine.sx < canvas.width - xCameraDeadzone &&
          !tileEngine.sx <= 0)
        {
          tileEngine.sx -= this.maxSpeed;
          this.cameraLastMove.dx = -this.maxSpeed;
        } else {
          this.cameraLastMove.dx = 0;
        }
      }
      else if (keyPressed('d')) {
        this.dx = this.maxSpeed;
        if (playerCenter.x > xCameraDeadzone &&
          playerCenter.x - tileEngine.sx > xCameraDeadzone &&
          !(tileEngine.sx + canvas.width >= worldWidth))
        {
          tileEngine.sx += this.maxSpeed;
          this.cameraLastMove.dx = this.maxSpeed;
        } else {
          this.cameraLastMove.dx = 0;
        }
      }
      else {
        this.dx = 0;
        this.cameraLastMove.dx = 0;
      }
  
      if (keyPressed('s')) {
        this.dy = this.maxSpeed;
        if (playerCenter.y > yCameraDeadzone &&
          playerCenter.y - tileEngine.sy > yCameraDeadzone &&
          !(tileEngine.sy + canvas.height >= worldHeight))
        {
          tileEngine.sy += this.maxSpeed;
          this.cameraLastMove.dy = this.maxSpeed;
        } else {
          this.cameraLastMove.dy = 0;
        }
      }
      else if (keyPressed('w')) {
        this.dy = -this.maxSpeed;
        if (playerCenter.y < worldHeight - yCameraDeadzone &&
          playerCenter.y - tileEngine.sy < canvas.height - yCameraDeadzone &&
          !tileEngine.sy <= 0)
        {
          tileEngine.sy -= this.maxSpeed;
          this.cameraLastMove.dy = -this.maxSpeed;
        } else {
          this.cameraLastMove.dy = 0;
        }
      }
      else {
        this.dy = 0;
        this.cameraLastMove.dy = 0;
      }
        
      this.advance();
      this.collisionBox.x = this.x + 4;
      this.collisionBox.y = this.y + 16;
    }
  });
  
  onPointer('up', function() {
    player.ableToShoot = true;
  });

  player.collisionBox = {
    x: player.x + 4,
    y: player.y + 16,
    width: 24,
    height: 16
  };

  return player;
}

export { createPlayer };