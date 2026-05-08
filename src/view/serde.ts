import type { Color } from './index.d.ts';

export class Serde {

      private static readonly HexValues = '0123456789ABCDEF';
      private static readonly ColorComponentNumber = 4;

      private constructor() {}
      
      public static toHex(value: number): Color {
            let color = '';

            for (let i = 0; i < Serde.ColorComponentNumber; i++) {
                  color = Serde.HexValues[value % Serde.HexValues.length] + color;
                  value = Math.trunc(value / Serde.HexValues.length);
            }
            //@ts-expect-error
            return '#' + color;
      }
      /**
       * 
       * @param {Color} color 
       */
      public static fromHex(color: Color) {
            if (color.length < Serde.ColorComponentNumber + 1) {
                  color += 'F';
            }
            const str = color.replace('#','');
            let value = 0;
            
            for (let i = 0; i < 4; i++) {
                  value = value*Serde.HexValues.length + Serde.HexValues.indexOf(str[i]);
            }
            return value;
      }  

      /**
       * 
       * @param {number} value 
       */
      public static toChar(value: number) {
            return String.fromCodePoint(value);
      }

      /**
       * 
       * @param {string} char 
       */
      public static fromChar(char: string) {
            return char.codePointAt(0) || 0;
      }    
      /**
       * 
       * @param {Color} hex 
       */
      public static hexToRgb(hex: Color) {
            const r = Serde.HexValues.indexOf(hex[1]);
            const g = Serde.HexValues.indexOf(hex[2]);
            const b = Serde.HexValues.indexOf(hex[3]);
            return [r,g,b];
      }
}