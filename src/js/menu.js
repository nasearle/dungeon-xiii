let startGame;

const initMenu = function(gameLoop) {
  const startScreen = document.querySelector('#startScreen');
  const gameUi = document.querySelector('#gameUi');
  const btnStartGame = document.querySelector('#btnStartGame');

  startGame = () => {
    startScreen.classList.add('hidden');
    gameUi.classList.remove('hidden');
    gameLoop.start();
  }

  btnStartGame.addEventListener('click', startGame);
  btnStartGame.removeAttribute("disabled");
}

const endGame = function(gameLoop) {
  gameLoop.stop();
  const gameOverScreen = document.querySelector('#gameOverScreen');
  const gameUi = document.querySelector('#gameUi');
  gameOverScreen.classList.remove('hidden');
  gameUi.classList.add('hidden');
}

export { initMenu, endGame, startGame };