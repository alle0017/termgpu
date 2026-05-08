import { EventDispatcher } from "../../events/event_dispatcher.ts";
import { loop } from "../loop.ts";
import { Document } from "./document.ts";
import { FrameBuffer } from '../../view/frame_buffer.ts';
import { Surface } from "../../view/surface.d.ts";
import { TermSurface } from "../../view/term_surface.ts";
import { WebAdapter, PtyEventSource } from "../input.ts";

type WindowEventMap = {
      error: ErrorEvent
      load: Event,
      beforeunload: Event,
      unload: Event,
      update: Event
}

export class Window extends EventDispatcher<WindowEventMap> {
      public readonly document: Document = new Document(20, 20);
      private readonly frameBuffer: FrameBuffer = new FrameBuffer(20, 20);
      private readonly surface: Surface;
      public readonly events = new WebAdapter(new PtyEventSource());

      constructor(surface: Surface = new TermSurface()) {
            super();
            this.surface = surface;
            loop(() => {
                  this.frameBuffer.clear();
                  this.document.body.draw(this.frameBuffer);
                  this.frameBuffer.draw(this.surface);
                  this.dispatch('update', new Event('update'));
            });
            this.dispatch('load', new Event('load'))
      }
}
