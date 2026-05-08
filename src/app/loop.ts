export const loop = (callback: (delta: number) => void) => {
      const IDEAL = 1000/120;
      let delta = IDEAL;

      const func = () => {
            const start = performance.now();
            callback(delta);
            delta = (performance.now() - start);
            setTimeout(func, Math.max(IDEAL - delta, 0));
      };
      func();
};