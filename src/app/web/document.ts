import { EventDispatcher } from "../../events/event_dispatcher.ts";
import { Element, Text, } from "../../node/node.ts";

type DocumentEventMap = {};
type ElementsMap = {
      div: HTMLDivElement
      a: HTMLAnchorElement
      u: HTMLUnderlineElement
      b: HTMLBoldElement
}

export class HTMLDivElement extends Element {}
export class HTMLBodyElement extends Element {}
export class HTMLUnderlineElement extends Element {
      constructor() {
            super();
            this.style._modifiers.underline();
      }
}
export class HTMLBoldElement extends Element {
      constructor() {
            super();
            this.style._modifiers.bold();
      }
}
export class HTMLAnchorElement extends HTMLUnderlineElement {}


export class Document extends EventDispatcher<DocumentEventMap> {
      private static readonly Map = {
            div: HTMLDivElement,
            a: HTMLAnchorElement,
            u: HTMLUnderlineElement,
            b: HTMLBoldElement,
      }
      public readonly body: Element;

      constructor(width: number, height: number) {
            super();
            this.body = new HTMLBodyElement();
            this.body.style.width = width;
            this.body.style.height = height;
      }

      createElement<K extends string>(name: K): K extends keyof ElementsMap?  ElementsMap[K]: Text {
            const constructor = Document.Map[name as keyof ElementsMap] ?? Text;
            //@ts-ignore
            return new constructor()
      }
      createTextNode(txt: string) {
            return new Text(txt);
      }
}