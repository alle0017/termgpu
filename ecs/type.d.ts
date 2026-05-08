type AbstractComponent<T> = {
    addSubclass<K extends T>(component: Component<K, unknown[], K>): void
}

type Component<T extends K, X extends unknown[], K> = {
    pool: (T | undefined)[];
    parents: Component<K, unknown[], K>[]
    get(entity: Ref<number>): T | undefined;
    create(entity: Ref<number>, ...args: X): T;
    remove(entity: Ref<number>): void;
}

type Loop = {
    run(cb: () => void): void;
    stop(): void;
}

type Ref<T> = {
    id: T,
    clones: Readonly<number>,
    version: Readonly<number>,
    clone(): Ref<T>,
    delete(): void,
}