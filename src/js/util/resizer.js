let canvas;

function getViewportSize() {
  return {
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight
  };
}

function resize() {
  const CANVAS_WIDTH = 1280;
  const CANVAS_HEIGHT = 720;
  const { windowWidth, windowHeight } = getViewportSize();    
  const availableRatio = windowWidth / windowHeight;
  const canvasRatio = CANVAS_WIDTH / CANVAS_HEIGHT;
  if (availableRatio <= canvasRatio) {
    canvas.style.width = `${windowWidth}px`;
    canvas.style.height = `${windowWidth / canvasRatio}px`;
  } else {
    canvas.style.height = `${windowHeight}px`;
    canvas.style.width = `${windowHeight * canvasRatio}px`;
  }
}

function initResizer() {
  canvas = document.querySelector('canvas');
  window.addEventListener('resize', resize);
}

export { resize, initResizer };