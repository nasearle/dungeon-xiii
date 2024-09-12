function angleToTarget(start, target) {
  return Math.atan2(target.y - start.y, target.x - start.x);
}

function distanceToTarget(start, target) {
  const a = target.x - start.x;
  const b = target.y - start.y;
  return Math.sqrt(a * a + b * b);
}

function convertArrayToMatrix(arr, width, height) {
  const matrix = [];
  for (let i = 0; i < height; i++) {
    matrix.push(arr.slice(i*width, i*width+width))
  }
  return matrix
}

function removeFromArray(array, item) {
  let index = array.indexOf(item);
  if (index != -1) {
    array.splice(index, 1);
    return true;
  }
}

/* 
Get the intersection point of two lines. Return false if the lines don't
intersect. A line looks like:
  [{x: 10, y: 20}, {x: 15, y: 25}]
*/ 
function intersect(line1, line2) {
  const x1 = line1[0].x,
        y1 = line1[0].y,
        x2 = line1[1].x,
        y2 = line1[1].y,
        x3 = line2[0].x,
        y3 = line2[0].y,
        x4 = line2[1].x,
        y4 = line2[1].y

  // Check that the lines are not length 0.
	if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
		return false
	}
	const denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))
  // Lines are parallel
	if (denominator === 0) {
		return false
	}

	const dist = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
	const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

  // Check if the intersection is within the endpoints of the two lines.
	if (dist < 0 || dist > 1 || ub < 0 || ub > 1) {
		return false
	}

  // Return an object with the x, y coordinates of the intersection and the
  // relative distance along the first line that the intersection occurred.
	const x = x1 + dist * (x2 - x1)
	const y = y1 + dist * (y2 - y1)

	return {x, y, dist}
}

export {
  angleToTarget,
  intersect,
  convertArrayToMatrix,
  distanceToTarget,
  removeFromArray
};