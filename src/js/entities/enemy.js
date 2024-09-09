import { Sprite } from 'kontra';
import { intersect } from '../util/util';

function createEnemy(config) {
  const enemy = Sprite({
    type: 'enemy',
    x: 300,
    y: 400,
    height: 16,
    width: 16,
    color: 'red',
    hidden: true,
    tileEngine: config.tileEngine,
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
      this.x += this.dx
      this.y += this.dy
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
    },
    render() {
      if (!this.hidden) {
        this.context.fillStyle = this.color;
        this.context.fillRect(0, 0, this.width, this.height);
      }      
    }
  });
  enemy.setRandomDirection();
  return enemy;
}

export { createEnemy };