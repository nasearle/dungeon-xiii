import { TileEngine } from 'kontra';

function createTileEngine(tileSheet, mapData) {
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