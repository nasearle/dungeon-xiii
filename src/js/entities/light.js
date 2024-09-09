import { radAngleToTarget, intersect, distanceToTarget } from "../util/util";

class Light {
  constructor(config) {
    this.ctx = config.context;
    this.parent = config.entity;
    this.wireframe = config.wireframe;
    this.sourceColor = 'rgba(255, 255, 255, 0.2)';
    this.distanceColor = 'rgba(255, 255, 255, 0)';
    this.minShadowColor = 'rgba(0, 0, 0, 0)';
    this.maxShadowColor = 'rgba(0, 0, 0, 0.85)';
    this.minFalloff = 50;
    this.maxFalloff = 275;
    this.origin = {
      x: this.parent.x + this.parent.width / 2,
      y: this.parent.y + this.parent.height / 2
    };
    this.rayEndpoints = [];
  }

  // Returns two rays on either side of the original at +/- 0.00001 radians.
  getAdjacentRays(angle) {
    const r = 1280;
    const posAngle = angle + 0.00001;
    const negAngle = angle - 0.00001;
    return [
      [this.origin, {
        x: this.origin.x + r * Math.cos(posAngle),
        y: this.origin.y + r * Math.sin(posAngle),
        angle: posAngle
      }],
      [this.origin, {
        x: this.origin.x + r * Math.cos(negAngle),
        y: this.origin.y + r * Math.sin(negAngle),
        angle: negAngle
      }]
    ]
  }

  createRays() {
    const rays = [];

    // For each point in the wireframe (represents a corner of a wall), create a
    // ray that points to it and two rays very close on either side (so the
    // light can continue beyond the corner). 
    for (const point of this.wireframe.points) {
      const angle = radAngleToTarget(this.origin, point);
      let adjRays = this.getAdjacentRays(angle);

      // Array of three rays, original and two adjacent.
      const rayGroup = [
        [this.origin, {x: point.x, y: point.y, angle: angle}],
        ...adjRays
      ]
      // For these three rays, loop through every line in the map wireframe and
      // find the closest intersect with the ray (closest wall hit by the
      // light), which is the point with the smallest dist value. The intersect
      // becomes the new endpoint for that ray.
      for (let ray of rayGroup) {
        let intersectPoint = {x: ray[1].x, y: ray[1].y, dist: 2};
        for (const line of this.wireframe.lines) {
          const intersection = intersect(ray, line);
          if (intersection && intersection.dist < intersectPoint.dist) {
            intersectPoint = intersection;
          }
        }
        const endpoint = {x: intersectPoint.x, y: intersectPoint.y, angle: ray[1].angle};        
        rays.push([this.origin, endpoint]);
        // Keep track of all the new ray endpoints so they can be used to draw
        // the light polygon.
        this.rayEndpoints.push(endpoint);
      }      
    }
    return rays;
  }

  drawLine(line) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'green';
    this.ctx.moveTo(line[0].x, line[0].y);
    this.ctx.lineTo(line[1].x, line[1].y);
    this.ctx.stroke();
  }

  lightGradient() {
    const x = this.origin.x,
          y = this.origin.y,
          inner = this.minFalloff,
          outer = this.maxFalloff;

    const gradient = this.ctx.createRadialGradient(x, y, inner, x, y, outer);
    gradient.addColorStop(0, this.sourceColor);
    gradient.addColorStop(1, this.distanceColor);

    return gradient;
  }

  /*
  If performance becomes an issue we could use something like this to reduce the
  number of rays.
  */
  // filterPoints() {
  //   const filteredPoints = this.rayEndpoints.filter((point) => {
  //     return distanceToTarget(this.origin, point) <= this.maxFalloff
  //   });
  //   this.rayEndpoints.splice(0, this.rayEndpoints.length, ...filteredPoints);
  // }

  drawPolygon(points) {
    this.ctx.fillStyle = this.lightGradient();
    this.ctx.beginPath();
    
    points.forEach((point, index) => {
      if (index == 0) {
        this.ctx.moveTo(point.x, point.y);
      } else {
        this.ctx.lineTo(point.x, point.y);
      }
    });
    this.ctx.closePath();
    this.ctx.fill();
  }

  shadowGradient() {
    const x = this.origin.x,
          y = this.origin.y,
          inner = this.minFalloff,
          outer = this.maxFalloff + 400;

    const gradient = this.ctx.createRadialGradient(x, y, inner, x, y, outer);
    gradient.addColorStop(0, this.minShadowColor);
    gradient.addColorStop(1, this.maxShadowColor);

    return gradient;
  }

  drawShadow() {
    this.ctx.fillStyle = this.shadowGradient();
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  update() {
    this.origin = {
      x: this.parent.x + this.parent.width / 2,
      y: this.parent.y + this.parent.height / 2
    };
    this.rayEndpoints = [];
    this.createRays();
    // this.filterPoints();
    this.rayEndpoints.sort((a,b) => a.angle - b.angle);
  }

  render() {
    this.drawShadow();
    this.drawPolygon(this.rayEndpoints);
  }
}

export { Light };