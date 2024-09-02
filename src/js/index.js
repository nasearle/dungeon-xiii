import { init, GameLoop, initKeys, initPointer } from 'kontra';
import { initResizer, resize } from './util/resizer';
import { scene } from './scene';
import { player } from './entities/player';
import { createEnemy } from './entities/enemy';
import { createTileEngine } from './level/tiles';
import { bulletPool } from './entities/bullet';
import { createAmmo } from './hud/ammo';
// TODO: Dramatically reduce tileset size...
import tilesheetImg from '../img/mapPack_tilesheet.png';

const { canvas, context } = init();
initResizer();
resize();
initKeys();
initPointer();

// TODO: consider using Kontra asset loader. I couldn't figure out
// how to get it to work with Webpack.
const tileSheet = new Image();
tileSheet.src = tilesheetImg;
tileSheet.onload = function() {

  const tileEngine = createTileEngine(tileSheet);

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
        const hasCollidedWithObstacle =
          tileEngine.layerCollidesWith('collision', sprite);
        const hasCollidedWithWall =
          sprite.x - sprite.radius < 0 ||
          sprite.x + sprite.radius > canvas.width ||
          sprite.y - sprite.radius < 0 ||
          sprite.y + sprite.radius > canvas.height;

        if (hasCollidedWithObstacle || hasCollidedWithWall) {
          sprite.handleCollision();
        }
      }
    },
    render() {
      // TODO: temp background color, maybe replace with tile system eventually
      context.fillStyle = '#18181a';
      context.fillRect(0, 0, canvas.width, canvas.height);

      tileEngine.render();

      scene.render();
      bulletPool.render();
    }
  });

  loop.start();
}