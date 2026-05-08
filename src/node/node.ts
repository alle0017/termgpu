import { Style } from "./style/style.ts";
import { FrameBuffer } from '../view/frame_buffer.ts';

export abstract class Node {
      readonly style: Style = new Style();
      public id: string = '';
      public classNames: Set<string> = new Set();
      public zIndex: number = 0;

      public draw(buffer: FrameBuffer) {
            if (this.style._height == 0) {
                  return;
            }
            if (this.style._width == 0) {
                  return;
            }
            for (let y = this.style._top; y < this.style._height; y++) {
                  for (let x = this.style._left; x < this.style._width; x++) {
                        buffer.set(x + this.style.left, y + this.style.top, this.zIndex, ' ', this.style.color, this.style.backgroundColor, this.style._modifiers);
                  }
            }
      }
      public toString() {
            const tag = Object.getPrototypeOf(this).constructor.name;
            return `<${tag}${this.id ? ` #${this.id}`: ''}${this.classNames.size > 0 ? [' ', ...this.classNames].join('.'): ''}/>`
      }
      public abstract cloneNode(deep: boolean): Node;
}
export class Element extends Node {
      public children: Node[] = [];

      public override draw(buffer: FrameBuffer) {
            super.draw(buffer);
            this.style.positionChildren(this.children);
            for (let i = 0; i < this.children.length; i++) {
                  this.children[i].draw(buffer);
            }
      }
      public append(el: Node): void {
            this.children.push(el);
      }
      public replace(target: Node, replacement: Node): void {
            this.children = this.children.map(el => el == target ? replacement: el);
      }
      public remove(target: Node): void {
            this.children = this.children.filter(el => el != target);
      }
      public override cloneNode(deep: boolean = true): Node {
            const copy = new Element();

            this.classNames.forEach(copy.classNames.add);
            copy.style.from(this.style);
            copy.zIndex = this.zIndex;

            if (deep) {
                  for (let i = 0; i < this.children.length; i++) {
                        copy.children.push(this.children[i].cloneNode(true));
                  }
            }
            return copy;
      }
      public override toString() {
            const tag = Object.getPrototypeOf(this).constructor.name;
            return `<${tag}${this.id ? ` #${this.id}`: ''}${this.classNames.size > 0 ? [' ', ...this.classNames].join('.'): ''}>${this.children.map(c => c.toString()).join('')}</${tag}>`
      }
}

export class Text extends Node {
      constructor(public content: string = '') {
            super();
            this.style.width = content.length;
      }
      public override draw(buffer: FrameBuffer): void {
            const children = this.content.split('\n');
            super.draw(buffer);
            for (let i = 0; i < children.length; i++) {
                  const y = this.style._top + i;
                  for (let j = 0; j < children[i].length; j++) {
                        const x = this.style._left + j;
                        if (x > this.style._width) {
                              break;
                        }

                        buffer.set(x + this.style.left, y + this.style.top, this.zIndex, children[i][j], this.style.color, this.style.backgroundColor, this.style._modifiers);
                  }
                  if (y > this.style._height) {
                        break;
                  }
            }
      }
      public override toString(): string {
          return `#text('${this.content}')`;
      }
      public override cloneNode(deep: boolean): Node {
            const cpy = new Text(this.content);
            this.classNames.forEach(cpy.classNames.add);
            cpy.style.from(this.style);
            cpy.zIndex = this.zIndex;
            return cpy;
      }
}