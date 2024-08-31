function angleToTarget(start, target,) {
  return (Math.atan2(target.y - start.y, target.x - start.x) / Math.PI) * 180;
}

export { angleToTarget };