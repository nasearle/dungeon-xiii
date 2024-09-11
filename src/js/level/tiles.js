import { TileEngine } from 'kontra';
import { mapData } from './mapData';

function createTileEngine(tileSheet) {
  return TileEngine({
    ...mapData,
    sx: 0,
    sy: mapData.tileheight * mapData.height - mapData.canvasHeight,
    // tileset object
    tilesets: [{
      firstgid: 1,
      image: tileSheet
    }]
  });
}

export { createTileEngine };