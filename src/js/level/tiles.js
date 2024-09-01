import { TileEngine } from 'kontra';

function createTileEngine(tileSheet) {
  return TileEngine({
    // tile size
    tilewidth: 64,
    tileheight: 64,

    // map size in tiles
    width: 9,
    height: 9,

    // tileset object
    tilesets: [{
      firstgid: 1,
      image: tileSheet
    }],

    // layer object
    layers: [{
      name: 'ground',
      data: [ 0,  0,  0,  0,  0,  0,  0,  0,  0,
              0,  0,  6,  7,  7,  8,  0,  0,  0,
              0,  6,  27, 24, 24, 25, 0,  0,  0,
              0,  23, 24, 24, 24, 26, 8,  0,  0,
              0,  23, 24, 24, 24, 24, 26, 8,  0,
              0,  23, 24, 24, 24, 24, 24, 25, 0,
              0,  40, 41, 41, 10, 24, 24, 25, 0,
              0,  0,  0,  0,  40, 41, 41, 42, 0,
              0,  0,  0,  0,  0,  0,  0,  0,  0 ]
    },
    {
      name: 'collision',
      data: [ 0,  0,  0,  0,  0,  0,  0,  0,  0,
              0,  0,  0,  0,  0,  0,  0,  0,  0,
              0,  0,  0,  0,  0,  0,  0,  0,  0,
              0,  0,  0,  0,  0,  0,  0,  0,  0,
              0,  0,  0,  0,  0,  0,  0,  0,  0,
              0,  0,  0,  0,  0,  0,  0,  0,  0,
              0,  0,  0,  0,  0,  0,  0,  0,  0,
              0,  0,  0,  0,  0,  0,  0,  0,  0,
              0,  0,  0,  0,  0,  0,  0,  0,  43 ]
    }]
  });
}

export { createTileEngine };