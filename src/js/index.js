import { init, GameLoop } from 'kontra';
import { Player } from './entities/player';
import { createEnemy } from './entities/enemy';

const { canvas } = init();

const sprites = [];

for (let i = 0; i < 4; i++) {
  sprites.push(createEnemy());
}

sprites.push(Player);

const loop = GameLoop({
  update() {
   for (const sprite of sprites) {
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
    for (const sprite of sprites) {
      sprite.render();
    }
  }
});

loop.start();

