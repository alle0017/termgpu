import { AlignStrategy, HorizontalAlign, VerticalAlign } from "./align.ts";
import { Position, type PositionStrategy } from "./position.ts";
import type { Color } from "../../view/index.d.ts";
import { Modifier } from "../../view/modifiers.ts";
export interface Styled {
      style: Style;
}


export class Style {
      backgroundColor: Color = '#FFF0';
      color: Color = '#FFFF';
      paddingLeft: number = 0;
      paddingTop: number = 0;

      width: number = 0;
      height: number = 0;

      left: number = 0;
      top: number = 0;
      _width: number = 0;
      _height: number = 0;
      _left: number = 0;
      _top: number = 0;
      _modifiers: Modifier = Modifier.none();

      verticalAlign: AlignStrategy = VerticalAlign.Top;
      horizontalAlign: AlignStrategy = HorizontalAlign.Left;
      position: PositionStrategy = Position.None;
      overflowX: boolean = true;
      overflowY: boolean = true;

      private truncateX(children: Styled[]): void {
            if (this._width == 0) {
                  this._left = 0;
                  this._width = this.width;
            }
            if (this.overflowX) {
                  for (let i = 0; i < children.length; i++) {
                        const childWidth = children[i].style._left + children[i].style.width;
                        children[i].style._width = childWidth;
                  }
            } else {
                  for (let i = 0; i < children.length; i++) {
                        const childWidth = children[i].style._left + children[i].style.width;
                        const width = this.width + this._left;
                        children[i].style._width = Math.min(childWidth, width);
                  }
            }
      }

      private truncateY(children: Styled[]): void {
            if (this._height == 0) {
                  this._top = 0;
                  this._height = this.height;
            }
            if (this.overflowY) {
                  for (let i = 0; i < children.length; i++) {
                        const childHeight = children[i].style._top + children[i].style.height;
                        children[i].style._height = childHeight;
                  }
            } else {
                  for (let i = 0; i < children.length; i++) {
                        const childHeight = children[i].style._top + children[i].style.height;
                        const height = this.height + this._top;
                        children[i].style._height = Math.min(childHeight, height);
                  }
            }
      }

      public positionChildren(children: Styled[]): void {
            this.position(this, children);
            this.horizontalAlign(this, children);
            this.verticalAlign(this, children);
            this.truncateX(children);
            this.truncateY(children);
      }
      public from(style: Style) {
            const entries = Object.entries(style);
            for (let i = 0; i < entries.length; i++) {
                  //@ts-ignore
                  this[entries[i][0]] = entries[i][1];
            }
      }
}