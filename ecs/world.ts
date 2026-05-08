type TickCallback =(dt: number) => void;
export class World {
      private timestamp = performance.now();
      private readonly systems: TickCallback[] = [];
      private readonly cleaners: TickCallback[] = [];

      public update() {
            const now = performance.now();
            const dt = now - this.timestamp;
            this.timestamp = now;

            for (let i = 0; i < this.systems.length; i++) {
                  this.systems[i](dt);
            }
            for (let i = 0; i < this.cleaners.length; i++) {
                  this.cleaners[i](dt);
            }
      }

      public onUpdate(cb: TickCallback) {
            this.systems.push(cb);
            return this;
      }
      public onEndUpdate(cb: TickCallback) {
            this.cleaners.push(cb);
            return this;
      }
}