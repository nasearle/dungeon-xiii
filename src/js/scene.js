import { Scene } from 'kontra';

const scene = Scene({
  id: 'game',
  objects: [],
  hudObjects: [],
  removeDeadObjects() {
    const deadObjects = scene.objects.filter(obj => !obj.isAlive());
    this.remove(deadObjects)
  },
  customUpdate() {
    this.removeDeadObjects();
    this.update();
  }
});

export { scene };