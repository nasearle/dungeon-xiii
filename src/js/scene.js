import { Scene } from 'kontra';

function createScene(id) {
  return Scene({
    id: id,
    objects: [],
    hudObjects: [],
    removeDeadObjects() {
      const deadObjects = this.objects.filter(obj => !obj.isAlive());
      this.remove(deadObjects)
    },
    customUpdate() {
      this.removeDeadObjects();
      this.update();
    }
  });
}


export { createScene };