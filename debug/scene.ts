import { Window } from "../src/app/web/window.ts";
import { Text } from "../src/node/node.ts";
import { FrameBuffer } from "../src/view/frame_buffer.ts";
export class Scene extends Text {
      constructor(private readonly window: Window) {
            super();
            this.style.width = 30;
            this.style.height = 30;
            window.document.body.append(this);
      }
      public override draw(buffer: FrameBuffer): void {
            this.content = this.window.document.body.toString();
            super.draw(buffer);
      }
      public override toString() {
            return '';
      }
}