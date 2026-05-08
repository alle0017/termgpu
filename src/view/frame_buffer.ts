import { Serde } from "./serde.ts";
import { Modifier } from './modifiers.ts';
import type { Surface } from "./surface.d.ts";
import type { Color } from './index.d.ts';

export class FrameBuffer {
      public static readonly Stride: number = 5;
      public static readonly Char: number = 0;
      public static readonly Foreground: number = 1;
      public static readonly Background: number = 2;
      public static readonly Depth: number = 3;
      public static readonly Modifiers: number = 4;
      

      private readonly buffer: Uint32Array;
      private dirty = true;

      constructor(public readonly width: number, public readonly height: number) {
            this.buffer = new Uint32Array(width*height*FrameBuffer.Stride);
            this.clear();
      }
      /**
       * 
       * @param {number} base 
       * @param {number} color 
       */
      private blend(base: number, color: number): number {
            const mask = 0xF;
            const r1 = (base >> 12) & mask;
            const g1 = (base >> 8)  & mask;
            const b1 = (base >> 4)  & mask;
            const a1 =  base        & mask;

            const r2 = (color >> 12) & mask;
            const g2 = (color >> 8)  & mask;
            const b2 = (color >> 4)  & mask;
            const a2 =  color        & mask;

            // Normalize alpha (0–15 → 0–1)
            const alpha = a2 / 15;

            // Alpha blend (foreground over background)
            const r = Math.round(r2 * alpha + r1 * (1 - alpha)) & mask;
            const g = Math.round(g2 * alpha + g1 * (1 - alpha)) & mask;
            const b = Math.round(b2 * alpha + b1 * (1 - alpha)) & mask;

            // Result alpha (standard over operator)
            const a = Math.round(a2 + a1 * (1 - alpha)) & mask;

            // Repack into 16-bit RGBA
            return (r << 12) | (g << 8) | (b << 4) | a;
      }
      public clear(): this {
            const char = ' '.codePointAt(0) || 0;
            for (let i = 0; i < this.buffer.length; i ++) {
                  if (i%FrameBuffer.Stride == FrameBuffer.Char) {
                        this.buffer[i] = char;
                  } else {
                        this.buffer[i] = 0;
                  }
            }
            this.dirty = true;
            return this;
      }

      public set(
            x: number, 
            y: number, 
            z: number, 
            char: string, 
            fg: Color = '#0000', 
            bg: Color = '#0000',
            modifiers: Modifier = Modifier.none()
      ): this {
            // cut the overflow
            if (x >= this.width || y >= this.height || x < 0 || y < 0) {
                  return this;
            }
            z = Math.round(z);
            const base = y * this.width * FrameBuffer.Stride + x * FrameBuffer.Stride;
            
            if (this.buffer[base + FrameBuffer.Depth] <= z) {
                  // new object is in front
                  this.buffer[base + FrameBuffer.Char] = Serde.fromChar(char);
                  this.buffer[base + FrameBuffer.Foreground] = this.blend(this.buffer[base + FrameBuffer.Background], Serde.fromHex(fg));
                  this.buffer[base + FrameBuffer.Background] = this.blend(this.buffer[base + FrameBuffer.Background], Serde.fromHex(bg));
                  this.buffer[base + FrameBuffer.Depth] = z;
                  this.buffer[base + FrameBuffer.Modifiers] = modifiers.value;
            } else {
                  // blend as if it was on the back
                  const code = Serde.fromHex(bg);
                  this.buffer[base + FrameBuffer.Foreground] = this.blend(code, this.buffer[base + FrameBuffer.Foreground]);
                  this.buffer[base + FrameBuffer.Background] = this.blend(code, this.buffer[base + FrameBuffer.Background]);
            }
            
            this.dirty = true;
            return this;
      }
      draw(view: Surface) {   
            if (!this.dirty) {
                  return;
            }
            this.dirty = false;

            const raw = this.buffer;
            const modifier = Modifier.none();
            view.clear();

            for (let y = 0; y < this.height; y++) {
                  const baseRow = y * FrameBuffer.Stride * this.width;
                  let fg = raw[baseRow + FrameBuffer.Foreground];
                  let bg = raw[baseRow + FrameBuffer.Background];
                  let str = Serde.toChar(raw[baseRow + FrameBuffer.Char]);
                  modifier.value = raw[baseRow + FrameBuffer.Modifiers];
                  
                  for (let x = 1; x < this.width; x++) {
                        const base = baseRow + FrameBuffer.Stride * x;
                        const fg1 = raw[base + FrameBuffer.Foreground];
                        const bg1 = raw[base + FrameBuffer.Background];
                        const modifiers1 = raw[base + FrameBuffer.Modifiers];
                        const char = Serde.toChar(raw[base + FrameBuffer.Char]);

                        if (fg1 != fg || bg1 != bg || modifier.value != modifiers1) {
                              view.drawText(str, Serde.toHex(fg), Serde.toHex(bg), modifier);
                              fg = fg1;
                              bg = bg1;
                              modifier.value = modifiers1;
                              str = char;
                        } else {
                              str += char;
                        }
                  }
                  if (str.length > 0) {
                        view.drawText(str, Serde.toHex(fg), Serde.toHex(bg), modifier);
                  }
                  view.newLine();
            }
            view.commit();
      }
}