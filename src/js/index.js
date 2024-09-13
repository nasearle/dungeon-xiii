import { init, GameLoop, initKeys, initPointer, collides } from 'kontra';
import { initResizer, resize } from './util/resizer';
import { initMenu, endGame, startGame } from './menu';
import { loadAllImages } from './util/imageLoader'; 
import { Game } from './game';

const { canvas, context } = init();
initResizer();
resize();
initKeys();
initPointer();

window.onload = async () => {
  const images = await loadAllImages();
  const game = new Game(canvas, context, images);

  const loop = GameLoop({
    async update(dt) {
      game.scene.customUpdate(dt);
      for (const sprite of game.scene.objects) {
        if (sprite.type == 'player') {
          if (game.tileEngine.layerCollidesWith('stairs', sprite)) {
            game.nextLevel(loop);
          }
        }
        
        if (sprite.type == 'player' || sprite.type == 'enemy') {
          let hasCollidedWithObstacle;
          if (sprite.collisionBox) {
            hasCollidedWithObstacle = game.tileEngine.layerCollidesWith('collision', sprite.collisionBox);
          } else {
            hasCollidedWithObstacle = game.tileEngine.layerCollidesWith('collision', sprite);
          }
    
          if (hasCollidedWithObstacle) {
            sprite.handleCollision();
          }
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
        game.scene.camera.x = game.tileEngine.sx + canvas.width / 2;
        game.scene.camera.y = game.tileEngine.sy + canvas.height / 2;

        if (sprite.type == 'trap' && sprite.state == 'triggered') {
          if (collides(game.player.collisionBox, sprite.collisionBox)) {
            game.player.ttl = 0;
          }
        }
  
        /* TODO: Optimize? We could track additional entity references to
          avoid duplicated entity checks. For example instead of check all
          entities against all other entities, we could check enemies explicitly
          against bullets and the player. Not critical now, as we have
          O(10) sprites, so even N*N is only O(100) operations.
        */
        if (sprite.type == 'enemy') {
          for (const otherSprite of game.scene.objects) {
            if (otherSprite.type == 'bullet') {
              if (collides(sprite, otherSprite)) {
                game.scene.remove(sprite);
                game.scene.remove(otherSprite);
              }
            }
            // Enemy collisions result in Game Over condition.
            else if (otherSprite.type == 'player') {
              if (collides(sprite, otherSprite)) {
                game.player.ttl = 0;
              }
            }
          }
        }
      }
      game.wireframe.update();
      game.light.update();
      if (!game.player.isAlive()) {
        endGame(loop);
      }
    },
    render() {
      context.fillStyle = '#141412';
      context.fillRect(0, 0, canvas.width, canvas.height);
  
      game.tileEngine.renderLayer('ground');
      game.tileEngine.renderLayer('collision');
      game.scene.render();
      game.light.render();
      game.tileEngine.renderLayer('foreground');
      for (const hudObj of game.scene.hudObjects) {
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
