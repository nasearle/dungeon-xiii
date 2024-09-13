import { createScene } from './scene';
import { createTileEngine } from './level/tiles';
import { Wireframe } from './level/wireframe';
import { Light } from './entities/light';
import { createPlayer } from './entities/player';
import { createEnemy } from './entities/enemy';
import { renderAmmoCount } from './hud/ammo';
import { levels } from './level/levels';
import { gameWin } from './menu';


class Game {
  constructor(canvas, context, images) {
    this.canvas = canvas;
    this.context = context;
    this.tilesheetImg = images.tilesheetImg;
    this.playerImg = images.playerImg;
    this.enemyImg = images.enemyImg;
    this.playerAmmo = 13;
    this.currentLevel = 0;

    this.initLevel();
  }

  syncCameras(scene, tileEngine) {
    scene.camera.x = tileEngine.sx + this.canvas.width / 2;
    scene.camera.y = tileEngine.sy + this.canvas.height / 2;
  }

  initLevel() {
    const scene = createScene(`level${this.currentLevel}`);
    const levelData = levels[this.currentLevel];
    
    const tileEngine = createTileEngine(this.tilesheetImg, levelData);
    this.syncCameras(scene, tileEngine);

    const player = createPlayer(scene, tileEngine, this.canvas, this.playerImg, levelData.player, this.playerAmmo);
    scene.add(player);

    const wireframe = new Wireframe({ tileEngine, levelData });
    const light = new Light({
      context: this.context,
      entity: player,
      wireframe,
      tileEngine
    });

    for (const enemy of levelData.enemies) {
      scene.add(createEnemy({
        spawn: enemy,
        player,
        wireframe,
        tileEngine,
        enemySheet: this.enemyImg
      }));
    }

    for (let i = 0; i < player.ammo; i++) {
      scene.hudObjects.push(renderAmmoCount(7 * i + 10, 10));
    }

    this.scene = scene,
    this.tileEngine = tileEngine,
    this.wireframe = wireframe,
    this.light = light,
    this.player = player;
  }

  nextLevel(gameLoop) {
    gameLoop.stop();
    this.playerAmmo = this.player.ammo;
    this.currentLevel += 1;
    this.scene.destroy();
    if (levels[this.currentLevel]) {
      this.initLevel();
      gameLoop.start();
    } else {
      gameWin();
    }
  }
}

export { Game };