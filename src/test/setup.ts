import "@testing-library/jest-dom/vitest";

// Mock canvas context
class MockCanvasRenderingContext2D {
  fillStyle = '';
  strokeStyle = '';
  lineWidth = 1;
  font = '';
  textAlign = 'left';
  globalAlpha = 1.0;

  fillRect() {}
  strokeRect() {}
  fillText() {}
  clearRect() {}
  beginPath() {}
  closePath() {}
  ellipse() {}
  fill() {}
  stroke() {}
}

HTMLCanvasElement.prototype.getContext = function(contextId: string) {
  if (contextId === '2d') {
    return new MockCanvasRenderingContext2D() as unknown as CanvasRenderingContext2D;
  }
  return null;
};
