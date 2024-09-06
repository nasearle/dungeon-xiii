import { TileEngine } from 'kontra';
import { mapData } from './mapData';

function createTileEngine(tileSheet) {
  return TileEngine({
    ...mapData,
    // tileset object
    tilesets: [{
      firstgid: 1,
      image: tileSheet
    }]
  });
}

export { createTileEngine };