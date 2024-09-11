import { init, GameLoop, initKeys, initPointer, collides } from 'kontra';
import { initResizer, resize } from './util/resizer';
import { scene } from './scene';
import { initMenu, endGame, startGame } from './menu';
import { createPlayer } from './entities/player';
import { createEnemy } from './entities/enemy';
import { createTileEngine } from './level/tiles';
import { renderAmmoCount } from './hud/ammo';
import tilesheetImg from '../img/map.png';
import { Wireframe } from './level/wireframe';
import { Light } from './entities/light';
import { mapData } from './level/mapData';

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

  const tileEngine = createTileEngine(tileSheet, canvas);
  const worldWidth = tileEngine.tilewidth * tileEngine.width;
  const worldHeight = tileEngine.tileheight * tileEngine.height;
  const player = createPlayer(tileEngine, canvas);
  scene.add(player);

  const wireframe = new Wireframe({ tileEngine: tileEngine });
  const light = new Light({
    context: context,
    entity: player,
    wireframe: wireframe,
    tileEngine: tileEngine
  });

  for (const enemy of mapData.enemies) {
    scene.add(createEnemy({ spawn: enemy, player: player, wireframe: wireframe, tileEngine: tileEngine }));
  }

  for (let i = 0; i < player.ammo; i++) {
    scene.hudObjects.push(renderAmmoCount(7 * i + 10, 10));
  }

  const loop = GameLoop({
    update() {
      scene.customUpdate();
      for (const sprite of scene.objects) {
        const hasCollidedWithObstacle =
          tileEngine.layerCollidesWith('collision', sprite);
        const hasCollidedWithWall =
          sprite.x < 0 ||
          sprite.x + sprite.width > worldWidth ||
          sprite.y < 0 ||
          sprite.y + sprite.height > worldHeight;

        if (hasCollidedWithObstacle || hasCollidedWithWall) {
          sprite.handleCollision();
        }

        /* Sync the scene camera with the tile engine camera. The tileEngine
        coordinates are at the top left of the camera while the scene's are
        in the middle, so we need an offset of canvas size divided by 2 when
        syncing.

        The tileEngine camera takes care of the offset for the tiles and the
        scene camera takes care of the offset for the objects that have been
        added to the scene. Anything not in these two objects needs to have the 
        camera offset calculated manually in their update() methods, such as
        the wireframe, light, los calculations, and pointer events.
        */
        scene.camera.x = tileEngine.sx + canvas.width / 2;
        scene.camera.y = tileEngine.sy + canvas.height / 2;

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
      wireframe.update();
      light.update();
      if (!player.isAlive()) {
        endGame(loop);
      }
    },
    render() {
      context.fillStyle = '#141412';
      context.fillRect(0, 0, canvas.width, canvas.height);

      tileEngine.renderLayer('ground');
      tileEngine.renderLayer('collision');
      light.render();
      scene.render();
      tileEngine.renderLayer('foreground');
      for (const hudObj of scene.hudObjects) {
        hudObj.render();
      }
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