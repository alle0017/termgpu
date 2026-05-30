import { EventDispatcher } from "../events/event_dispatcher.ts";
import { FrameBuffer } from "../view/frame_buffer.ts";
import { Surface } from "../view/surface.d.ts";
import { TermSurface } from "../view/term_surface.ts";
import { PtyEventSource, EventSource } from "./input.ts";
import { loop } from "./loop.ts";

export class App extends EventDispatcher<{ draw: App }> {
      private static app: App;
      public static width = 20;
      public static height = 20;


      public static size(width: number, height: number): typeof App {
            App.width = width;
            App.height = height;
            return this;
      }

      public static new() {
            if (!App.app) {
                  App.app = new App();
            }
            return App.app;
      }

      public readonly frameBuffer: FrameBuffer;
      public readonly surface: Surface;
      public readonly events: EventSource;


      private constructor() {
            super();
            this.frameBuffer = new FrameBuffer(App.width, App.height);
            this.events = new PtyEventSource();
            this.surface = new TermSurface();

            loop(() => {
                  this.frameBuffer.clear();
                  this.dispatch('draw', this);
                  this.frameBuffer.draw(this.surface);
            });
      }
}