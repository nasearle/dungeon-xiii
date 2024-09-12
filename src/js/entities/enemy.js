import { angleToTarget, Sprite, SpriteSheet } from 'kontra';
import { intersect, distanceToTarget } from '../util/util';

function createEnemy(config) {
  const spriteSheet = SpriteSheet({
    image: config.enemySheet,
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

  const enemy = Sprite({
    type: 'enemy',
    x: config.spawn.x,
    y: config.spawn.y,
    height: 32,
    width: 32,
    hidden: true,
    speed: 1.5,
    range: 100,
    tileEngine: config.tileEngine,
    animations: spriteSheet.animations,
    setRandomDirection() {
      this.dx = Math.random() * 3 - 1.5;
      this.dy = Math.random() * 3 - 1.5;
    },
    handleCollision() {
      this.x -= this.dx;
      this.y -= this.dy;
    },
    update() {
      // Subtracting the tile engine camera position from the player and enemy
      // positions to account for the offset.
      const playerPos = {
        x: config.player.x + config.player.width / 2 - this.tileEngine.sx,
        y: config.player.y + config.player.height - 15 - this.tileEngine.sy
      }
      const enemyPos = {
        x: this.x + this.width / 2 - this.tileEngine.sx,
        y: this.y + this.height / 2 - this.tileEngine.sy
      }
      const playerToEnemy = [playerPos, enemyPos];

      // Check LOS with player
      for (const line of config.wireframe.lines) {
        if (intersect(playerToEnemy, line)) {
          this.hidden = true;
          break;
        } else {
          this.hidden = false;
        }
      }

      if (!this.hidden && distanceToTarget(enemyPos, playerPos) <= this.range) {
        const angle = angleToTarget(enemyPos, playerPos);
        this.dx = Math.cos(angle) * this.speed;
        this.dy = Math.sin(angle) * this.speed;
      } else {
        this.dx = 0;
        this.dy = 0;
      }

      if (this.dx || this.dy) {
        if (this.currentAnimation != 'run') {
          this.playAnimation('run');
        }
      } else {
        if (this.currentAnimation != 'idle') {
          this.playAnimation('idle');
        }
      }
      this.advance();

      this.collisionBox.x = this.x + 4;
      this.collisionBox.y = this.y + 16;
    },
    render() {
      if (!this.hidden) {
        this.draw();
      }      
    }
  });

  enemy.collisionBox = {
    x: config.spawn.x + 4,
    y: config.spawn.y + 16,
    width: 24,
    height: 16
  };

  return enemy;
}

export { createEnemy };