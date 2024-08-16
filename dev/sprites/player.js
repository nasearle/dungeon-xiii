class PlayerSprite {
  constructor(config) {
    for (const prop in config) {
      this[prop] = config[prop];
    }
    this.type = 'player';
    this.color = 'orange';
  }

  render() {
    this.context.fillStyle = this.color;
    this.context.fillRect(this.x, this.y, this.width, this.height);
  }
};

export { PlayerSprite };