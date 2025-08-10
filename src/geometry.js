/**
 * Utility geometric functions based on SlideGrid documentation.
 * All measures are in points (pt) unless otherwise stated.
 */

const PT_TO_EMU = 12700; // 1 pt = 12700 EMU

/** Convert points to EMUs rounding to nearest integer. */
function ptToEmu(pt) {
  return Math.round(pt * PT_TO_EMU);
}

/** Convert inches to points. */
function inchToPt(inch) {
  return inch * 72;
}

/** Snap a value to the closest line within tolerance and round to step. */
function snapToLines(v, lines, tol, step = 0.5) {
  let best = v;
  let min = Infinity;
  for (const L of lines) {
    const d = Math.abs(v - L);
    if (d < min && d <= tol) {
      min = d;
      best = L;
    }
  }
  return Math.round(best / step) * step;
}

/**
 * Determine best column/row factor pair for N that approximates aspect ratio.
 * @param {number} N number of cells
 * @param {number} W parent width
 * @param {number} H parent height
 * @param {number} gh gutter horizontal
 * @param {number} gv gutter vertical
 * @returns {[number,number]} [cols, rows]
 */
function bestFactorGrid(N, W, H, gh, gv) {
  const ar = W / H;
  let best = [N, 1];
  let bestCost = Infinity;
  const limit = Math.floor(Math.sqrt(N));
  for (let c = 1; c <= limit; c++) {
    if (N % c !== 0) continue;
    const r = N / c;
    const cw = (W - (c - 1) * gh) / c;
    const ch = (H - (r - 1) * gv) / r;
    const car = cw / ch;
    const cost = Math.abs(Math.log(car / ar));
    if (cost < bestCost) {
      bestCost = cost;
      best = [c, r];
    }
    if (c !== r) {
      const cw2 = (W - (r - 1) * gh) / r;
      const ch2 = (H - (c - 1) * gv) / c;
      const car2 = cw2 / ch2;
      const cost2 = Math.abs(Math.log(car2 / ar));
      if (cost2 < bestCost) {
        bestCost = cost2;
        best = [r, c];
      }
    }
  }
  return best;
}

/** Balanced grid: approximate square layout. */
function balancedGrid(N) {
  const c = Math.max(1, Math.round(Math.sqrt(N)));
  const r = Math.ceil(N / c);
  return [c, r];
}

/** Distribute residue deterministically left to right, top to bottom. */
function distributeResidue(total, n, step = 0.5) {
  const base = Math.floor(total / n / step) * step;
  let residue = total - base * n;
  const out = Array(n).fill(base);
  let i = 0;
  while (residue > 1e-6) {
    const add = Math.min(step, residue);
    out[i % n] += add;
    residue -= add;
    i++;
  }
  return out;
}

module.exports = {
  ptToEmu,
  inchToPt,
  snapToLines,
  bestFactorGrid,
  balancedGrid,
  distributeResidue,
};
