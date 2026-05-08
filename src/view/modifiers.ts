
export const Modifiers = {
      Italic: 1,
      Bold: 2,
      Dim: 4,
      Underline: 8,
      Blink: 16,
      Inverse: 32,
      Hidden: 64,
      Strikethrough: 128
}
export class Modifier {
      public static none(): Modifier {
            return new Modifier(0);
      }
      constructor(public value: number = 0) {}

      isModified() { 
            return this.value != 0; 
      }
      italic() {
            this.value |= Modifiers.Italic;
            return this;
      }
      bold() {
            this.value |= Modifiers.Bold;
            return this;
      }
      dim() {
            this.value |= Modifiers.Dim;
            return this;
      }
      underline() {
            this.value |= Modifiers.Underline;
            return this;
      }
      blink() {
            this.value |= Modifiers.Blink;
            return this;
      }
      inverse() {
            this.value |= Modifiers.Inverse;
            return this;
      }
      strikethrough() {
            this.value |= Modifiers.Strikethrough;
            return this;
      }
      hidden() {
            this.value |= Modifiers.Hidden;
            return this;
      }
      isItalic() {
            return Boolean(this.value & Modifiers.Italic);
      }
      isDim() {
            return Boolean(this.value & Modifiers.Dim);
      }
      isBold() {
            return Boolean(this.value & Modifiers.Bold);
      }
      isUnderline() {
            return Boolean(this.value & Modifiers.Underline);
      }
      isBlink() {
            return Boolean(this.value & Modifiers.Blink);
      }
      isInverse() {
            return Boolean(this.value & Modifiers.Inverse);
      }
      isStrikethrough() {
            return Boolean(this.value & Modifiers.Strikethrough);
      }
      isHidden() {
            return Boolean(this.value & Modifiers.Hidden);
      }
}