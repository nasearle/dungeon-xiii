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
    setRandomDirection() {
      this.dx = Math.random() * 4 - 2;
      this.dy = Math.random() * 4 - 2;
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
        const playerPos = {
          x: config.player.x + config.player.width / 2,
          y: config.player.y + config.player.height / 2
        }
        const enemyPos = {
          x: this.x + this.width / 2,
          y: this.y + this.height / 2
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