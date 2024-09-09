import { TileEngine } from 'kontra';
import { mapData } from './mapData';

function createTileEngine(tileSheet, canvas) {
  return TileEngine({
    ...mapData,
    sx: 0,
    sy: 0,
    // tileset object
    tilesets: [{
      firstgid: 1,
      image: tileSheet
    }]
  });
}

export { createTileEngine };