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
      private readonly frameBuffer: FrameBuffer;
      private readonly surface: Surface;
      public readonly document: Document;
      public readonly events = new WebAdapter(new PtyEventSource());

      constructor(public width: number = 20, public height: number = 20, surface: Surface = new TermSurface()) {
            super();
            this.surface = surface;
            this.frameBuffer = new FrameBuffer(width, height);
            this.document = new Document(width, height);

            loop(() => {
                  this.frameBuffer.clear();
                  this.document.body.draw(this.frameBuffer);
                  this.frameBuffer.draw(this.surface);
                  this.dispatch('update', new Event('update'));
            });
            
            this.dispatch('load', new Event('load'))
      }
}
