import { mapData } from "./mapData";
import { convertArrayToMatrix } from "../util/util";

class Wireframe {
  constructor(config) {
    this.tileEngine = config.tileEngine;
    const worldWidth = config.tileEngine.tilewidth * config.tileEngine.width;
    const worldHeight = config.tileEngine.tileheight * config.tileEngine.height;
    this.fixedPoints = [
      {x: 0, y: 0},
      {x: worldWidth, y: 0},
      {x: 0, y: worldHeight},
      {x: worldWidth, y: worldHeight}
    ];
    this.fixedLines = [];
    this.points = [];
    this.lines = [];

    const layerData = this.getLayerData('light');
    this.getHorizontalsFromLayer(layerData);
    this.getVerticalsFromLayer(layerData);
  }

  getLayerData(layerName) {
    return mapData.layers.filter((elem) => elem.name == layerName)[0].data;
  }

  addPoint(point) {
    if (!this.fixedPoints.includes(point)) {
      this.fixedPoints.push(point)
    }
  }

  addLine(line) {
    this.fixedLines.push(line);
  }

  getBoxPoints(left, right, top, bottom) {
    return {
      topLeft: {x: left, y: top},
      topRight: {x: right, y: top},
      bottomRight: {x: right, y: bottom},
      bottomLeft: {x: left, y: bottom}
    } 
  }

  addBox(left, right, top, bottom) {
    const points = this.getBoxPoints(left, right, top, bottom)

    const lines = [
      [points.topLeft, points.topRight],
      [points.topRight, points.bottomRight],
      [points.bottomRight, points.bottomLeft],
      [points.bottomLeft, points.topLeft]
    ]
    this.fixedLines.push(...lines);

    for (const point in points) {
      this.addPoint(points[point]);
    }
  }

  /* Returns an array of lines. Each line is an array containing the start and
  end point. The structure looks like this:
  [
    [{x: 10, y: 20}, {x: 30, y: 40}],    -- endpoints for line 1
    [{x: 15, y: 25}, {x: 35, y: 45}],    -- endpoints for line 2
    ...                                  -- etc.
  ]
  */
  getHorizontalsFromLayer(layerData) {
    const lines = [];
    let left = undefined;
    let right = undefined;

    layerData.forEach((elem, index) => {
      const row = Math.floor(index / mapData.width);
      const column = index % mapData.width;      
      if (elem != 0 &&
        left == undefined &&
        !layerData[index + mapData.width] &&
        !layerData[index - mapData.width]) {
        left = column * mapData.tilewidth;
      }
      // If there are tiles above and below, add intersection points.
      if (left != undefined && (layerData[index + mapData.width] || layerData[index - mapData.width])) {
        const left = column * mapData.tilewidth,
              right = left + mapData.tilewidth,
              top = row * mapData.tileheight,
              bottom = top + mapData.tileheight;

        const points = this.getBoxPoints(left, right, top, bottom);

        for (const point in points) {
          this.addPoint(points[point]);
        }
      }
      if (left != undefined && (layerData[index + 1] == 0 || (index + 1) % mapData.width == 0)) {
        right = column * mapData.tilewidth + mapData.tilewidth;

        const top = row * mapData.tileheight,
              bottom = top + mapData.tileheight;

        this.addBox(left, right, top, bottom);

        left = undefined;
        right = undefined;
      }
    });
    return lines;
  }

  /* Loops through the mapData matrix, column by column, checking for adjacent
  vertical tiles. Returns an array of lines. See method above for the structure.
  */
  getVerticalsFromLayer(layerData) {
    const lines = [];
    let top = undefined;
    let bottom = undefined;

    const layerMatrix = convertArrayToMatrix(layerData, mapData.width, mapData.height);

    let row = 0;
    let column = 0;
    let flag = false;

    for (let k = 0; k < layerData.length; k++) {
      row = k % mapData.height;
      if (row == 0 && flag == true) {
        column++;
      }
      flag = true;
      const elem = layerMatrix[row][column];

      if (elem != 0 && top == undefined && !(!layerMatrix[row + 1] || layerMatrix[row + 1][column] == 0)) {
        top = row * mapData.tileheight;
      }
      if (top != undefined && (!layerMatrix[row + 1] || layerMatrix[row + 1][column] == 0)) {
        bottom = row * mapData.tileheight + mapData.tileheight;

        const left = column * mapData.tilewidth,
              right = left + mapData.tilewidth;

        this.addBox(left, right, top, bottom);

        top = undefined;
        bottom = undefined;
      }
    }
    return lines;
  }

  update() {
    // Update the points and lines with the tile engine camera offset.
    this.points = this.fixedPoints.map((fixedPoint) => {
      return {
        x: fixedPoint.x - this.tileEngine.sx,
        y: fixedPoint.y - this.tileEngine.sy
      }
    });
    
    this.lines = this.fixedLines.map((fixedLine) => {
      const line = [];
      for (const endpoint of fixedLine) {
        line.push({
          x: endpoint.x - this.tileEngine.sx,
          y: endpoint.y - this.tileEngine.sy
        })
      }
      return line;
    });
  }

  // For debugging:
  // drawLine(line) {
  //   ctx.beginPath();
  //   ctx.strokeStyle = 'green';
  //   ctx.moveTo(line[0].x, line[0].y);
  //   ctx.lineTo(line[1].x, line[1].y);
  //   ctx.stroke();
  // }

  // render() {
  //   for (const line of this.lines) {
  //     this.drawLine(line)
  //   }
  //   for (const point of this.points) {
  //     ctx.beginPath();
  //     ctx.fillStyle = this.color;
  //     ctx.rect(point.x, point.y, 5, 5);
  //     ctx.fill();
  //   }
  // }
}

export { Wireframe };