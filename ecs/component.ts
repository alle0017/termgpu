export const createComponent = <X extends unknown[], K, T extends K>(factory: (...args: X) => T, ...parents: Component<K, unknown[], K>[]): Component<T, X, K> => {
      const pool: (T | undefined)[] = [];
      return {
            pool,
            parents,
            create(entity: Ref<number>, ...args: X) {
                  if (pool[entity.id]) {
                        throw new Error('double insertion of component for the same entity');
                  }
                  const component = factory(...args);
                  entity.clone();
                  pool[entity.id] = component;

                  let stack = [...parents];

                  while (stack.length > 0) {
                        const parent = stack.pop();

                        if (parent && parent.pool[entity.id] == undefined) {
                              parent.pool[entity.id] = component;
                              entity.clone();
                              stack = stack.concat(parent.parents);
                        }
                  }
                  return component; 
            },
            remove(entity: Ref<number>) {
                  if (!pool[entity.id]) {
                        return;
                  }
                  pool[entity.id] = undefined;
                  entity.delete();

                  let stack = [...parents];

                  while (stack.length > 0) {
                        const parent = stack.pop();
                        if (parent?.pool[entity.id]) {
                              parent.pool[entity.id] = undefined;
                              entity.delete();
                              stack = stack.concat(parent.parents);
                        }
                  }
            },
            get(entity) {
                  return pool[entity.id];
            }
      };
}

export const update = <T>(update: (v: T, entityId: number) => T, component: Component<T,unknown[],any>) => {
      for (let i = 0; i < component.pool.length; i++) {
            const curr = component.pool[i];
            if (curr == undefined) {
                  continue;
            }
            component.pool[i] = update(curr, i);
      }
} 

export const queryAll = <T>(update: (v: T, entityId: number) => void, component: Component<T,unknown[],any>) => {
      for (let i = 0; i < component.pool.length; i++) {
            const curr = component.pool[i];
            if (curr == undefined) {
                  continue;
            }
            update(curr, i);
      }
} 

export const query = <T>(entity: number, component: Component<T, unknown[],any>) => component.pool[entity];  