import { EventDispatcher } from "../events/event_dispatcher.ts";

const ENABLE_CURSOR = '\x1b[?25h';
const MOUSE_ENABLE  = '\x1b[?1003h\x1b[?1015h\x1b[?1006h'; // SGR + any-event mode
const MOUSE_DISABLE = '\x1b[?1003l\x1b[?1006l';
export interface EventSource {
      on(callback: (key: string) => void): void;
      remove(callback: (key: string) => void): void;
}
export class PtyEventSource implements EventSource {
      private readonly watchers = new Set<(key: string) => void>();
      constructor() {
            process.stdout.write(MOUSE_ENABLE);
            process.stdin.setRawMode(true);
            process.stdin.resume();
            process.stdin.setEncoding('utf8');
            process.on('exit', () => {
                  process.stdout.write(MOUSE_DISABLE);
                  process.stdout.write(ENABLE_CURSOR);
                  process.stdin.setRawMode(false);
            })

            process.stdin.on('data', keyBuffer => {
                  const key = keyBuffer.toString();
                  if (key === '\u0003') {
                        process.exit();
                  }
                  this.watchers.forEach(f => f(key));
            });
      }

      on(callback: (key: string) => void) {
            this.watchers.add(callback);
      }
      remove(callback: (key: string) => void) {
            this.watchers.delete(callback);
      }
}
const WebKeyMapping = new Map([
      ['\u001b[A', 'ArrowUp'],
      ['\u001b[B', 'ArrowDown'],
      ['\u001b[D', 'ArrowLeft'],
      ['\u001b[C', 'ArrowRight'],
      // Home / End / Insert / Delete
      ['\u001b[H', 'Home'],
      ['\u001b[F', 'End'],
      ['\u001b[2~', 'Insert'],
      ['\u001b[3~', 'Delete'],

      // Page Up / Page Down
      ['\u001b[5~', 'PageUp'],
      ['\u001b[6~', 'PageDown'],

      // Function keys F1–F12
      ['\u001bOP',    'F1'],
      ['\u001bOQ',    'F2'],
      ['\u001bOR',    'F3'],
      ['\u001bOS',    'F4'],
      ['\u001b[15~',  'F5'],
      ['\u001b[17~',  'F6'],
      ['\u001b[18~',  'F7'],
      ['\u001b[19~',  'F8'],
      ['\u001b[20~',  'F9'],
      ['\u001b[21~',  'F10'],
      ['\u001b[23~',  'F11'],
      ['\u001b[24~',  'F12'],

      // Whitespace
      ['\r',   'Enter'],
      ['\t',   'Tab'],
      [' ',    ' '],

      // Backspace / Escape
      ['\u007f', 'Backspace'],
      ['\u001b', 'Escape'],
])
export type EventMap = {
      'click': MouseEvent,
      'move': MouseEvent,
      'drag': MouseEvent,
      'dragstart': MouseEvent,
      'dragend': MouseEvent,
      'scroll': MouseEvent,
      'keydown': KeyEvent,
}
export class Event {}
export class KeyEvent extends Event {
      constructor(public readonly key: string) { super() }
}
export class MouseEvent extends Event {
      constructor(
            public readonly left: number,
            public readonly top: number,
      ) {
            super();
      }
}

export class WebAdapter extends EventDispatcher<EventMap> {
      private dragging: boolean = false;
      constructor(private readonly events: EventSource) {
            super();
            events.on((key : string) => {
                  const str = key.substring(key.indexOf('[') + 2);
                  if (!str.match(/\d(\d(\d)?)?;\d(\d(\d)?)?;\d(\d(\d)?)?m/ig)) {
                        this.dispatch('keydown', new KeyEvent(WebKeyMapping.get(key) || key));
                        return;             
                  }
                  const arr = str.split(';');
                  const released = key.includes('m');
                  const event = new MouseEvent(
                        Number.parseInt(arr[1]), 
                        Number.parseInt(arr[2]),
                  )
                  switch (arr[0]) {
                        case '35': 
                              this.dispatch('move', event);
                        break;
                        case '32':
                              if (this.dragging) {
                                    this.dispatch('drag', event);
                              } else {
                                    this.dragging = true;
                                    this.dispatch('dragstart', event);
                              }
                        break;
                        case '0': 
                              if (released) {
                                    this.dragging = false;
                                    this.dispatch('dragend', event);
                              }
                              this.dispatch('click', event);
                        break;
                        case '65': 
                        case '64':  
                              this.dispatch('scroll', event);
                        break;
                        default: this.dispatch('keydown', new KeyEvent(WebKeyMapping.get(key) || key));
                  }
            })
      }
}