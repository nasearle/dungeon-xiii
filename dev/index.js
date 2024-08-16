import { PlayerSprite } from "./sprites/player";

const state = {};
let player;

const CANVAS = document.querySelector('canvas#ctx');
const CONTEXT = CANVAS.getContext('2d');

function getViewportDimensions() {
  // Different on different browsers?
  return {
    width: Math.min(window.innerWidth, document.body.clientWidth),
    height: Math.min(window.innerHeight, document.body.clientHeight)
  };
}

function setCanvasDetails(viewportDimensions) {
  CANVAS.width = viewportDimensions.width;
  CANVAS.height = viewportDimensions.height;

  // Canvas settings get reset on resize
  CONTEXT.font = '12px Courier New';
  CONTEXT.textAlign = 'center';
}

function renderLoop() {
  CONTEXT.fillStyle = 'blue';
  CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height);

  player.render();

  window.requestAnimationFrame(renderLoop);
};

function init() {
  const startScreen = document.querySelector('#startScreen');
  const gameOverScreen = document.querySelector('#gameOverScreen');
  const gameUi = document.querySelector('#gameUi');
  const btnStartGame = document.querySelector('#btnStartGame');

  btnStartGame.onclick = () => {
    const viewportDimensions = getViewportDimensions();
    setCanvasDetails(viewportDimensions);

    startScreen.classList.add('hidden');
    gameUi.classList.remove('hidden');

    const playerInfo = {
      x: 150,
      y: 150,
      width: 32,
      height: 32,
      context: CONTEXT
    }
    
    player = new PlayerSprite(playerInfo);

    window.requestAnimationFrame(renderLoop);
  }
}

window.addEventListener('load', init, false);