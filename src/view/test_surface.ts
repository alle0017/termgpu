import { Modifier } from "./modifiers.ts";
import type { Surface } from "./surface.d.ts";
import type { Color } from './index.d.ts';
import { EventDispatcher } from "../events/event_dispatcher.ts";

const ESC = '\x1b';
export class TestSurface extends EventDispatcher<{ 'change': string }> implements Surface {
      private text = '';
      private prev = '';
      drawText(text: string, fg: Color, bg: Color, modifiers: Modifier): void {
            const mod: string[] = [];
            if (modifiers.isBold()) {
                  mod.push('bold')
            }
            if (modifiers.isDim()) {
                  mod.push('dim');
            }
            if (modifiers.isItalic()) {
                  mod.push(`italic`);
            }
            if (modifiers.isUnderline()) {
                  mod.push('underline');
            }
            if (modifiers.isBlink()) {
                  mod.push('blink')
            }
            if (modifiers.isInverse()) {
                  mod.push('inverse')
            }
            if (modifiers.isHidden()) {
                  mod.push('hidden')
            }
            if (modifiers.isStrikethrough()) {
                  mod.push(`strikethrough>`);
            }
            const formatted = `<frag color=${fg} background=${bg}${mod.length > 0? ' ' + mod.join(' '): ''}>${text}</frag>`;
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
            this.dispatch('change', this.text);
      }
      clear(): void {
            this.text = ``;
      }
}