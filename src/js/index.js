import { init, GameLoop, initKeys, initPointer, collides } from 'kontra';
import { initResizer, resize } from './util/resizer';
import { scene } from './scene';
import { player } from './entities/player';
import { createEnemy } from './entities/enemy';
import { createTileEngine } from './level/tiles';
import { createAmmo } from './hud/ammo';
// TODO: Dramatically reduce tileset size...
import tilesheetImg from '../img/tilesheet.png';
import { Light } from './entities/light';

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

  const light = new Light({entity: player});

  for (let i = 0; i < 4; i++) {
    scene.add(createEnemy());
  }

  for (let i = 0; i < player.ammo; i++) {
    scene.add(createAmmo(10 * i + 20, 25));
  }
  
  const loop = GameLoop({
    update() {
      scene.customUpdate();
      for (const sprite of scene.objects) {
        const hasCollidedWithObstacle =
          tileEngine.layerCollidesWith('collision', sprite);
        const hasCollidedWithWall =
          sprite.x < 0 ||
          sprite.x + sprite.width > canvas.width ||
          sprite.y < 0 ||
          sprite.y + sprite.height > canvas.height;

        if (hasCollidedWithObstacle || hasCollidedWithWall) {
          sprite.handleCollision();
        }

        // TODO: move to bullet or enemy objects to avoid nested loop?
        if (sprite.type == 'bullet') {
          for (const enemy of scene.objects) {
            if (enemy.type == 'enemy') {
              if (collides(sprite, enemy)) {
                scene.remove(sprite);
                scene.remove(enemy);
              }
            }
          }
        }
      }
      light.update();
    },
    render() {
      // TODO: temp background color, maybe replace with tile system eventually
      context.fillStyle = '#18181a';
      context.fillRect(0, 0, canvas.width, canvas.height);

      tileEngine.render();
      scene.render();
      light.render();
    }
  });

  loop.start();
}