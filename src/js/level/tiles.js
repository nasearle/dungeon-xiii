import { TileEngine } from 'kontra';

function createTileEngine(tileSheet, mapData) {
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