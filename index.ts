import { Scene } from "./debug/scene.ts";
import { Window } from "./src/app/web/window.ts";
import { Element } from "./src/node/node.ts";
import { FrameBuffer } from "./src/view/frame_buffer.ts";
import { Color } from "./src/view/index.d.ts";
import { TestSurface } from './src/view/test_surface.ts';

const s = new TestSurface();
const window = new Window(); 

class MapElement extends Element {

      constructor(private readonly buffer: Color[][]) {
            super();
      }
      public override draw(buffer: FrameBuffer): void {
            for (let i = 0; i < this.buffer.length; i += 2) {
                  for (let j = 0; j < this.buffer[i].length; j++) {
                        buffer.set(j, i/2, this.zIndex, '▀', this.buffer[i][j], this.buffer[i + 1][j]);
                  }
            }
      }
}

const G = '#2A2';   // grass
const D = '#964';   // dirt path
const W = '#48F';   // water
const S = '#68F';   // water shine
const T = '#1A1';   // dark tree
const L = '#5D2';   // tree top (light)
const B = '#864';   // building wall
const R = '#C33';   // building roof
const P = '#DDD';   // building door / path detail
const F = '#FFA';   // flower yellow
const K = '#F4F';   // flower pink
const E = '#553';   // dark grass edge
const N = '#000';   // border / outline

const map: Color[][] = [
    // row 0
    [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T],
    // row 1
    [T, L, L, T, L, L, T, G, G, G, G, G, G, T, L, L, T, L, L, T],
    // row 2
    [T, L, L, T, L, L, T, G, F, G, G, F, G, T, L, L, T, L, L, T],
    // row 3
    [T, T, T, T, T, T, G, G, G, G, G, G, G, G, T, T, T, T, T, T],
    // row 4
    [G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G],
    // row 5
    [G, G, F, G, G, G, D, D, D, D, D, D, D, D, G, G, G, K, G, G],
    // row 6
    [G, G, G, G, R, R, D, R, R, R, N, R, R, D, G, G, G, G, G, G],
    // row 7
    [G, G, G, G, R, R, D, B, B, B, B, B, B, D, G, G, G, G, G, G],
    // row 8
    [W, W, W, W, G, G, D, B, P, B, B, P, B, D, G, G, G, G, G, G],
    // row 9
    [W, S, W, W, G, G, D, B, B, B, B, B, B, D, G, G, K, G, G, G],
    // row 10
    [W, W, W, S, G, G, D, D, D, D, P, D, D, D, G, G, G, G, G, G],
    // row 11
    [W, W, S, W, G, G, G, G, G, D, D, D, G, G, G, G, G, G, G, G],
    // row 12
    [W, S, W, W, G, G, G, G, G, D, D, D, G, G, G, G, G, G, G, G],
    // row 13
    [W, W, W, W, G, G, F, G, G, D, D, D, G, G, G, F, G, G, G, G],
    // row 14
    [G, G, G, G, G, G, G, G, G, D, D, D, G, G, G, G, G, G, G, G],
    // row 15
    [G, G, G, G, G, G, G, G, G, D, D, D, G, G, G, G, G, G, G, G],
    // row 16
    [T, T, T, G, G, G, G, G, G, D, D, D, G, G, G, G, T, T, T, T],
    // row 17
    [T, L, T, G, G, K, G, G, G, D, D, D, G, G, G, G, T, L, L, T],
    // row 18
    [T, L, T, G, G, G, G, G, G, D, D, D, G, G, K, G, T, L, L, T],
    // row 19
    [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T],
];

const mapElement = new MapElement(map);


window.document.body.append(mapElement);

let seed = 0;
let now = performance.now();

function getXY(x: number, f: (x: number) => number) {
      const y = Math.max(Math.min(9, Math.round(f(x))), 0);
      return [x,y];
}
const scene = new Scene(window);

scene.style.top = 10;