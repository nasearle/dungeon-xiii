import { init, GameLoop, initKeys, initPointer } from 'kontra';
import { initResizer, resize } from './util/resizer';
import { scene } from './scene';
import { player } from './entities/player';
import { Direction } from './entities/wall';
import { createEnemy } from './entities/enemy';
import { bulletPool } from './entities/bullet';
import { createAmmo } from './hud/ammo';

const { canvas, context } = init();
initResizer();
resize();
initKeys();
initPointer();

scene.add(player);

for (let i = 0; i < 4; i++) {
  scene.add(createEnemy());
}

for (let i = 0; i < player.ammo; i++) {
  scene.add(createAmmo(10 * i + 20, 25));
}

scene.add(bulletPool);

const loop = GameLoop({
  update() {
    scene.update();
    bulletPool.update();
    for (const sprite of scene.objects) {
      sprite.update();

      if (sprite.x - sprite.radius < 0) {
        sprite.handleWallCollision(Direction.LEFT);
      }
      else if (sprite.x + sprite.radius > canvas.width) {
        sprite.handleWallCollision(Direction.RIGHT);
      }
      if (sprite.y - sprite.radius < 0) {
        sprite.handleWallCollision(Direction.UP);
      }
      else if (sprite.y + sprite.radius > canvas.height) {
        sprite.handleWallCollision(Direction.DOWN);
      }
    }
  },
  render() {
    // temp background color, maybe replace with tile system eventually
    context.fillStyle = '#18181a';
    context.fillRect(0, 0, canvas.width, canvas.height);

    scene.render();
    bulletPool.render();
  }
});

loop.start();

