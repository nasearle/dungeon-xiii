import { Player } from "./entities/player";

const state = {};
let player;
let CANVAS;
let CTX;

function getViewportDimensions() {
  // Different on different browsers?
  return {
    width: Math.min(window.innerWidth, document.body.clientWidth),
    height: Math.min(window.innerHeight, document.body.clientHeight)
  };
};

function setCanvasDetails(viewportDimensions) {
  CANVAS.width = viewportDimensions.width;
  CANVAS.height = viewportDimensions.height;

  // Canvas settings get reset on resize
  CTX.font = '12px Courier New';
  CTX.textAlign = 'center';
};

function renderLoop() {
  CTX.fillStyle = 'blue';
  CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);

  player.render();

  window.requestAnimationFrame(renderLoop);
};

onload = () => {
  CANVAS = document.querySelector('canvas#ctx');
  CTX = CANVAS.getContext('2d');

  const startScreen = document.querySelector('#startScreen');
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
      ctx: CTX
    }
    
    player = new Player(playerInfo);

    window.requestAnimationFrame(renderLoop);
  }
};