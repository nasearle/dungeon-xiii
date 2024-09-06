import { Scene } from 'kontra';

const scene = Scene({
  id: 'game',
  objects: [],
  removeDeadObjects() {
    // TODO: fix this. this changes an array while looping through it so it
    // might be missing some objects and removing them on the next frame 😬
    for (const obj of this.objects) {
      if (!obj.isAlive()) {
        scene.remove(obj);
      }
    }
  },
  customUpdate() {
    this.removeDeadObjects();
    this.update();
  }
});

export { scene };