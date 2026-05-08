import { Modifier } from "./modifiers.ts";
import type { Color } from './index.d.ts';
export interface Surface {
      drawText(text: string, fg: Color, bg: Color, modifiers: Modifier): void;
      newLine(): void;
      commit(): void;
      clear(): void;
}