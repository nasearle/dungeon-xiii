import { player } from "./player";
import { radAngleToTarget, intersect } from "../util/util";
import { Wireframe } from "../level/wireframe";

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const wireframe = new Wireframe();

class Light {
  constructor() {
    this.sourceColor = 'rgba(255, 255, 255, 0.2)';
    this.distanceColor = 'rgba(255, 255, 255, 0)';
    this.minFalloff = 100;
    this.maxFalloff = 300;
    this.rayStart = {
      x: player.x + player.width / 2,
      y: player.y + player.height / 2
    };
    this.rayEndpoints = [];
  }

  // Returns two arrays on either side of the original at +/- 0.00001 radians.
  getAdjacentRays(start, angle) {
    const r = 1280;
    const posAngle = angle + 0.00001;
    const negAngle = angle - 0.00001;
    return [
      [start, {
        x: start.x + r * Math.cos(posAngle),
        y: start.y + r * Math.sin(posAngle),
        angle: posAngle
      }],
      [start, {
        x: start.x + r * Math.cos(negAngle),
        y: start.y + r * Math.sin(negAngle),
        angle: negAngle
      }]
    ]
  }

  createRays() {
    const rays = [];

    // For each point in the wireframe (represents a corner of a wall), create a
    // ray that points to it and two arrays very close on either side (so the
    // light can continue beyond the corner). 
    for (const point of wireframe.points) {
      const angle = radAngleToTarget(this.rayStart, point);
      let adjRays = this.getAdjacentRays(this.rayStart, angle);

      // Array of three rays, original and two adjacent.
      const rayGroup = [
        [this.rayStart, {x: point.x, y: point.y, angle: angle}],
        ...adjRays
      ]
      // For these three rays, loop through every line in the map wireframe and
      // find the closest intersect with the ray (closest wall hit by the
      // light), which is the point with the smallest dist value. The intersect
      // becomes the new endpoint for that ray.
      for (let ray of rayGroup) {
        let intersectPoint = {x: ray[1].x, y: ray[1].y, dist: 2};
        for (const line of wireframe.lines) {
          const intersection = intersect(ray, line);
          if (intersection && intersection.dist < intersectPoint.dist) {
            intersectPoint = intersection;
          }
        }
        const endpoint = {x: intersectPoint.x, y: intersectPoint.y, angle: ray[1].angle};        
        rays.push([this.rayStart, endpoint]);
        // Keep track of all the new ray endpoints so they can be used to draw
        // the light polygon.
        this.rayEndpoints.push(endpoint);
      }      
    }
    return rays;
  }

  drawLine(line) {
    ctx.beginPath();
    ctx.strokeStyle = 'green';
    ctx.moveTo(line[0].x, line[0].y);
    ctx.lineTo(line[1].x, line[1].y);
    ctx.stroke();
  }

  lightGradient() {
    const x = this.rayStart.x,
          y = this.rayStart.y,
          inner = this.minFalloff,
          outer = this.maxFalloff;

    const gradient = ctx.createRadialGradient(x, y, inner, x, y, outer);
    gradient.addColorStop(0, this.sourceColor);
    gradient.addColorStop(1, this.distanceColor);

    return gradient;
  }

  drawPolygon(points) {
    ctx.fillStyle = this.lightGradient();
    ctx.beginPath();
    
    points.forEach((point, index) => {
      if (index == 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.closePath();
    ctx.fill();
  }

  update() {
    this.rayStart = {
      x: player.x + player.width / 2,
      y: player.y + player.height / 2
    };
    this.rayEndpoints = [];
    this.createRays();
    this.rayEndpoints.sort((a,b) => a.angle - b.angle);
  }

  render() {
    this.drawPolygon(this.rayEndpoints);
  }
}

export { Light };