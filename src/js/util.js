function angleBetween(a, b,) {
  return (Math.atan2(b.y - a.y, b.x - a.x) / Math.PI) * 180;
}

export { angleBetween };