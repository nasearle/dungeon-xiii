class Player {
  constructor(config) {
    for (const prop in config) {
      this[prop] = config[prop];
    }
    this.type = 'player';
    this.color = 'orange';
  }

  render() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
};

export { Player };