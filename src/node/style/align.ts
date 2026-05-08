import type { Style, Styled } from "./style.ts";

export type AlignStrategy = (style: Style, children: Styled[]) => void;

export const HorizontalAlign: Readonly<Record<'Left' | 'Right' | 'Center', AlignStrategy>> = {
      Left: () => {},
      Right: (self, children) => {
            for (let i = 0; i < children.length; i++) {
                  children[i].style._left += self.width - children[i].style.width;
            }
      },
      Center: (self, children) => {
            for (let i = 0; i < children.length; i++) {
                  children[i].style._left += Math.trunc((self.width - children[i].style.width)/2);
            }
      }
}

export const VerticalAlign: Readonly<Record<'Top' | 'Bottom' | 'Center', AlignStrategy>> = {
      Top: () => {},
      Bottom: (self, children) => {
            for (let i = 0; i < children.length; i++) {
                  children[i].style._top += self.height - children[i].style.height;
            }
      },
      Center: (self, children) => {
            for (let i = 0; i < children.length; i++) {
                  children[i].style._top += Math.trunc((self.height - children[i].style.height)/2);
            }
      }
}