import { init, GameLoop, initKeys, initPointer } from 'kontra';
import { scene } from './scene';
import { Player } from './entities/player';
import { createEnemy } from './entities/enemy';

const { canvas } = init();
initKeys();
initPointer();

scene.add(Player);

for (let i = 0; i < 4; i++) {
  scene.add(createEnemy());
}

const loop = GameLoop({
  update() {
    scene.update();
    for (const sprite of scene.objects) {
      sprite.update();
      if (sprite.x < -sprite.radius) {
        sprite.x = canvas.width + sprite.radius;
      }
      else if (sprite.x > canvas.width + sprite.radius) {
        sprite.x = 0 - sprite.radius;
      }
      if (sprite.y < -sprite.radius) {
        sprite.y = canvas.height + sprite.radius;
      }
      else if (sprite.y > canvas.height + sprite.radius) {
        sprite.y = -sprite.radius;
      }
    }
  },
  render() {
    scene.render();
  }
});

loop.start();

