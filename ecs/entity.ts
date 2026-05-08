type ReferenceCounter = { 
      ref: Ref<number>, 
      usable: boolean, 
      version: number 
}
export const [createEntity, getEntity] = (() => {
      let ID = 0;
      const pool: ReferenceCounter[] = [];
      return [
      
      (): Ref<number> => {
            let id = -1;
            // do not delete unused entities
            for (let i = 0; i < pool.length; i++) {
                  if (pool[i].usable) {
                        pool[i].usable = false;
                        pool[i].version++;
                        id = i;
                        break;
                  }
            }

            if (id < 0) {
                  id = ID++;
                  //@ts-ignore
                  pool[id] = { ref: undefined, usable: false, version: 0 };

            }
            const ref: Ref<number> = {
                  id,
                  version: pool[id].version,
                  clone() {
                        if (pool[id].version !== this.version) {
                              throw new Error('clone of free reference');
                        }
                        this.clones++;
                        pool[this.id].usable = false;
                        return this;
                  },
                  delete() {
                        if (pool[id].version !== this.version) {
                              throw new Error('delete of free reference');
                        }
                        if (this.clones === 0) {
                              return;
                        }
                        this.clones--;
                        pool[this.id].usable = this.clones == 0;
                  },
                  clones: 0
            }
            pool[id].ref = ref;
            return ref;
      }, (id: number) => pool[id].ref];
})()