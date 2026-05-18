import { createEntity, } from "./entity.ts";

export abstract class Model {
      protected readonly ref = createEntity();

      public inject<T extends K, X extends unknown[], K>(component: Component<T,X,K>, ...args: X) {
            const comp = component.get(this.ref);
            if (comp) {
                  return comp;
            }
            return component.create(this.ref, ...args);
      }
}