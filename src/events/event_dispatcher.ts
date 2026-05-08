type Callback<T> = (ev: T) => void
const SetConstructor = () => new Set<any>()
export abstract class EventDispatcher<T extends Record<string, {}>> {
      private readonly map: Map<string, Set<Callback<unknown>>> = new Map();
      addEventListener<K extends keyof T>(event: K, callback: Callback<T[K]>) {
            this.map.getOrInsertComputed(event as string, SetConstructor).add(callback as Callback<unknown>);
      }
      removeEventListener<K extends keyof T>(event: K, callback: Callback<T[K]>) {
            this.map.getOrInsertComputed(event as string, SetConstructor).delete(callback as Callback<unknown>);
      }
      dispatch<K extends keyof T>(event: K, msg: T[K]) {
            this.map.getOrInsertComputed(event as string, SetConstructor).forEach(f => f(msg));
      }
}