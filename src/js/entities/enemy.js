import { Sprite, SpriteSheet } from 'kontra';
import { intersect, loadImage } from '../util/util';
import enemyImg from '../../img/enemy.png';

async function createEnemy(config) {
  const enemySheet = await loadImage(enemyImg);

  const spriteSheet = SpriteSheet({
    image: enemySheet,
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
    tileEngine: config.tileEngine,
    animations: spriteSheet.animations,
    setRandomDirection() {
      this.dx = Math.random() * 3 - 1.5;
      this.dy = Math.random() * 3 - 1.5;
    },
    handleCollision() {
      this.x -= this.dx;
      this.y -= this.dy;
      this.setRandomDirection();
    },
    update() {
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

      // Check LOS with player
      for (const line of config.wireframe.lines) {
        // Subtracting the tile engine camera position from the player and enemy
        // positions to account for the offset.
        const playerPos = {
          x: config.player.x + config.player.width / 2 - this.tileEngine.sx,
          y: config.player.y + config.player.height / 2 - this.tileEngine.sy
        }
        const enemyPos = {
          x: this.x + this.width / 2 - this.tileEngine.sx,
          y: this.y + this.height / 2 - this.tileEngine.sy
        }
        const playerToEnemy = [playerPos, enemyPos];
        
        if (intersect(playerToEnemy, line)) {
          this.hidden = true;
          break;
        } else {
          this.hidden = false;
        }
      }
      this.collisionBox.x = this.x + 4;
      this.collisionBox.y = this.y + 16;
    },
    render() {
      if (!this.hidden) {
        this.draw();
      }      
    }
  });
  enemy.setRandomDirection();

  enemy.collisionBox = {
    x: config.spawn.x + 4,
    y: config.spawn.y + 16,
    width: 24,
    height: 16
  };

  return enemy;
}

export { createEnemy };