import { EventDispatcher } from "../../events/event_dispatcher.ts";
import { Document } from "./document.ts";
import { WebAdapter, } from "../input.ts";
import { App } from "../app.ts";

type WindowEventMap = {
      error: ErrorEvent
      load: Event,
      beforeunload: Event,
      unload: Event,
      update: Event
}

export class Window extends EventDispatcher<WindowEventMap> {
      public readonly document: Document;
      public readonly events: WebAdapter;
      public width: number = 20; 
      public height: number = 20;

      constructor() {
            super();
            const app = App.new();
            this.document = new Document(App.width, App.height);
            this.events = new WebAdapter(app.events);

            app.addEventListener('draw', () => this.document.body.draw(app.frameBuffer));
            
            this.dispatch('load', new Event('load'))
      }
}
