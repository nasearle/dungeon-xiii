import { init, GameLoop, initKeys, initPointer, collides } from 'kontra';
import { initResizer, resize } from './util/resizer';
import { scene } from './scene';
import { initMenu, endGame, startGame } from './menu';
import { player } from './entities/player';
import { createEnemy } from './entities/enemy';
import { createTileEngine } from './level/tiles';
import { renderAmmoCount } from './hud/ammo';
import tilesheetImg from '../img/tilesheet.png';
import { Wireframe } from './level/wireframe';
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

  const wireframe = new Wireframe();
  const light = new Light({
    context: context,
    entity: player,
    wireframe: wireframe
  });

  for (let i = 0; i < 4; i++) {
    scene.add(createEnemy({ player: player, wireframe: wireframe }));
  }

  for (let i = 0; i < player.ammo; i++) {
    scene.add(renderAmmoCount(10 * i + 20, 25));
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

        /* TODO: Optimize? We could track additional entity references to
         avoid duplicated entity checks. For example instead of check all
         entities against all other entities, we could check enemies explicitly
         against bullets and the player. Not critical now, as we have
         O(10) sprites, so even N*N is only O(100) operations.
        */
        if (sprite.type == 'enemy') {
          for (const otherSprite of scene.objects) {
            if (otherSprite.type == 'bullet') {
              if (collides(sprite, otherSprite)) {
                scene.remove(sprite);
                scene.remove(otherSprite);
              }
            }
            // Enemy collisions result in Game Over condition.
            else if (otherSprite.type == 'player') {
              if (collides(sprite, otherSprite)) {
                player.ttl = 0;
              }
            }
          }
        }
      }
      light.update();
      if (!player.isAlive()) {
        endGame(loop);
      }
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

  initMenu(loop);
  // TODO: remove later if we need the space.
  // Skip the main menu during development because it's annoying during hot
  // reloads.
  const urlParams = new URLSearchParams(window.location.search);
  const debug = urlParams.get('debug');
  if (debug) {
    startGame();
  }
}