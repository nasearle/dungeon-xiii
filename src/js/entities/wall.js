import { Sprite } from 'kontra';

const Direction = Object.freeze({
  LEFT: 'left',
  RIGHT: 'right',
  UP: 'up',
  DOWN: 'down',
});

// TODO: implement actual walls
// function createWall(x,y,width,height) {
//   return Sprite({
//     type: 'wall',
//     x: x,
//     y: y,
//     width: width,
//     height: height,
//     render() {
//       this.context.fillStyle = 'gray';
//       // Drawing is relative to sprite location, so nominal x and y are 0.
//       this.context.fillRect(0,0,this.width,this.height)
//     }
//   });
// }

export { Direction };