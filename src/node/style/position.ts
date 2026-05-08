import type { Style, Styled } from "./style.ts";

export type PositionStrategy = (self: Style, children: Styled[]) => void;

export const Position: Readonly<Record<'Vertical' | 'Horizontal' | 'None',PositionStrategy>> = {
      Vertical: (self, children) => {
            const left = self._left + self.left;
            let top = self._top + self.top;

            for (let i = 0; i < children.length; i++) {
                  children[i].style._left = left;
                  children[i].style._top = top;
                  top += Math.max(children[i].style.top, 0) + children[i].style.height;
            }
      },
      Horizontal: (self, children) => {
            let left = self._left + self.left;
            const top = self._top + self.top;

            for (let i = 0; i < children.length; i++) {
                  children[i].style._left = left;
                  children[i].style._top = top;
                  left += Math.max(children[i].style.left, 0) + children[i].style.width;
            }
      },
      None: (self, children) => {
            const left = self._left + self.left;
            const top = self._top + self.top;

            for (let i = 0; i < children.length; i++) {
                  children[i].style._left = left;
                  children[i].style._top = top;
            }
      },
}