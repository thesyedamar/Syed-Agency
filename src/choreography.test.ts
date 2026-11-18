import test from 'node:test';
import assert from 'node:assert/strict';

function stepDeg(cw: number, R: number): number {
  return 2 * Math.asin(Math.min(0.99, (1.05 * cw) / (2 * R))) * (180 / Math.PI);
}

function iconsLeft(lettersLeft: number, totalLetters = 10): number {
  return Math.ceil((7 * lettersLeft) / totalLetters);
}

function spriteCrop(box: [number, number, number, number]) {
  const [x0, y0, x1, y1] = box;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const sizeX = (100 / dx);
  const sizeY = (100 / dy);
  const posX = dx === 1 ? 0 : (x0 / (1 - dx)) * 100;
  const posY = dy === 1 ? 0 : (y0 / (1 - dy)) * 100;
  return { sizeX, sizeY, posX, posY, aspect: dx / dy };
}

function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (
    2 * p1 +
    (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  );
}

test('card angular step maintains 1.05 * cw chord spacing', () => {
  const cw = 218;
  const R = 1250;
  const deg = stepDeg(cw, R);
  const rad = (deg * Math.PI) / 180;
  const chord = 2 * R * Math.sin(rad / 2);
  assert.ok(Math.abs(chord - 1.05 * cw) < 1e-9);
});

test('icon-to-letter morph consumes all 7 icons across Syed Agency (10 non-space letters)', () => {
  assert.equal(iconsLeft(10, 10), 7);
  assert.equal(iconsLeft(8, 10), 6);
  assert.equal(iconsLeft(7, 10), 5);
  assert.equal(iconsLeft(5, 10), 4);
  assert.equal(iconsLeft(4, 10), 3);
  assert.equal(iconsLeft(2, 10), 2);
  assert.equal(iconsLeft(1, 10), 1);
  assert.equal(iconsLeft(0, 10), 0);
});

test('camera crop box aspect ratio matches 1.094 spec', () => {
  const cam = spriteCrop([0.148, 0.141, 0.879, 0.809]);
  assert.ok(Math.abs(cam.aspect - 1.094) < 0.001);
});

test('catmull-rom passes through control points at t=0 and t=1', () => {
  assert.equal(catmullRom(10, 20, 35, 50, 0), 20);
  assert.equal(catmullRom(10, 20, 35, 50, 1), 35);
});
