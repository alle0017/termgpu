import { Window } from "./src/app/web/window.ts";
import { Element } from "./src/node/node.ts";
import { FrameBuffer } from "./src/view/frame_buffer.ts";
import { Color } from "./src/view/index.d.ts";
import { TestSurface } from './src/view/test_surface.ts';

const s = new TestSurface();
const window = new Window(); 
class Shader extends Element {
      public readonly buffer: Color[][] = []

      constructor(width: number, height: number) {
            super();
            this.buffer = new Array(height).fill(0).map(() => new Array(width).fill('#FFF0'));
      }
      public clear() {
            for (let i = 0; i < this.buffer.length; i ++) {
                  for (let j = 0; j < this.buffer[i].length; j++) {
                        this.buffer[i][j] = '#FFF';
                  }
            } 
      }
      public override draw(buffer: FrameBuffer): void {
            for (let i = 0; i < this.buffer.length; i += 2) {
                  for (let j = 0; j < this.buffer[i].length; j++) {
                        buffer.set(j, i/2, this.zIndex, '▀', this.buffer[i][j], this.buffer[i + 1][j]);
                  }
            }
      }
}
const shader = new Shader(10, 10);


window.document.body.append(shader);

let seed = 0;
let now = performance.now();

function getXY(x: number, f: (x: number) => number) {
      const y = Math.max(Math.min(9, Math.round(f(x))), 0);
      return [x,y];
}
window.addEventListener('update', () => {
      shader.clear();
      for (let i = 0; i < 10; i++) {
            const[x,y] = getXY(i, x => Math.log(Math.abs(Math.sin(x + seed) * 3)) * 3);
            shader.buffer[y][x] = '#0FF'
      }
      const curr = performance.now();
      if (curr - now > 100) {
            now = curr;
            seed++;
      }
});