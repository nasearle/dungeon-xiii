import tilesheetUrl from '../../img/map.png';
import playerUrl from '../../img/player.png';
import enemyUrl from '../../img/enemy.png';

function loadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = function() {
      resolve(this);
    }
  })
}

async function loadAllImages() {
  const tilesheetImg = await loadImage(tilesheetUrl);
  const playerImg = await loadImage(playerUrl);
  const enemyImg = await loadImage(enemyUrl);

  return { tilesheetImg, playerImg, enemyImg };
}

export { loadAllImages };