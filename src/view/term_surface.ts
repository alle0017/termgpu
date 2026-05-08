import { Modifier } from "./modifiers.ts";
import { Serde } from "./serde.ts";
import type { Surface } from "./surface.d.ts";
import type { Color } from './index.d.ts';

const ESC = '\x1b';
export class TermSurface implements Surface {
      private text = '';
      private prev = '';
      toColorId(hex: Color): number {
            const rgb = Serde.hexToRgb(hex);
            return 16 + 36 * Math.trunc(rgb[0]/3) + 6 * Math.trunc(rgb[1]/3) + Math.trunc(rgb[2]/3);
      }
      drawText(text: string, fg: Color, bg: Color, modifiers: Modifier): void {
            let formatted = `${ESC}[38;5;${this.toColorId(fg)}m${ESC}[48;5;${this.toColorId(bg)}m${text}${ESC}[0m`;
            if (!modifiers.isModified()) {
                  this.text += formatted;
                  return;
            }
            if (modifiers.isBold()) {
                  formatted = `${ESC}[1m${formatted}`;
            }
            if (modifiers.isDim()) {
                  formatted = `${ESC}[2m${formatted}`;
            }
            if (modifiers.isItalic()) {
                  formatted = `${ESC}[3m${formatted}`;
            }
            if (modifiers.isUnderline()) {
                  formatted = `${ESC}[4m${formatted}`;
            }
            if (modifiers.isBlink()) {
                  formatted = `${ESC}[5m${formatted}`;
            }
            if (modifiers.isInverse()) {
                  formatted = `${ESC}[7m${formatted}`;
            }
            if (modifiers.isHidden()) {
                  formatted = `${ESC}[8m${formatted}`;
            }
            if (modifiers.isStrikethrough()) {
                  formatted = `${ESC}[9m${formatted}`;
            }
            this.text += formatted;
      }
      newLine(): void {
            this.text += '\n';
      }
      commit(): void {
            if (this.prev == this.text) {
                  return;
            }
            this.prev = this.text;
            console.log(`${ESC}[=19h${ESC}[?25l${ESC}[H${this.text}`);
      }
      clear(): void {
            this.text = `${ESC}[2J${ESC}[H`;
      }
}