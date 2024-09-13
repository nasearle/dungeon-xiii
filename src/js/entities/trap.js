import { Sprite, SpriteSheet } from 'kontra';

function createTrap(config) {
  const spriteSheet = SpriteSheet({
    image: config.tileSheet,
    frameWidth: 16,
    frameHeight: 32,
    animations: {
      disarmed: {
        frames: '10',
        frameRate: 4
      },
      armed: {
        frames: '11',
        frameRate: 4
      },
      triggered: {
        frames: '12',
        frameRate: 4
      }
    }
  });

  const trap = Sprite({
    type: 'trap',
    x: config.x,
    y: config.y,
    height: 32,
    width: 16,
    state: 'disarmed',
    armedStart: 2,
    triggeredStart: 2.75,
    tridderedEnd: 3.5,
    animations: spriteSheet.animations,
    dt: 0,
    update(dt) {
      this.dt += dt;
      if (this.dt < this.armedStart) {
        this.state = 'disarmed';
      } else if (this.armedStart <= this.dt && this.dt < this.triggeredStart ) {
        this.state = 'armed';
      } else if (this.triggeredStart <= this.dt && this.dt < this.tridderedEnd) {
        this.state = 'triggered';
      } else if (this.dt >= this.tridderedEnd) {
        this.dt = 0;
      }

      this.playAnimation(this.state);
      this.advance();
    }
  })

  trap.collisionBox = {
    x: config.x,
    y: config.y + trap.height - 23,
    width: 16,
    height: 23
  };

  return trap;
}

export { createTrap };