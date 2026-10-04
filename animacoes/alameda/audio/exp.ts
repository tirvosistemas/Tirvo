import {craneAt, CYC, CD, craneDown} from '../src/crane';
import {DUR} from '../src/tl';
const fr = [];
for (let f = 0; f <= DUR; f++) { const p = craneAt(f); fr.push([+p.ang.toFixed(4), +p.r.toFixed(3), +p.y.toFixed(3), +craneDown(f).toFixed(3)]); }
console.log(JSON.stringify({fr, drops: CYC.map((c) => ({t: c.a + 0.74 * CD, pick: c.a + 0.17 * CD, load: c.load}))}));
