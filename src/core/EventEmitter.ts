export class EventEmitter {
  private events: { [key: string]: Function[] } = {};

  on(event: string, callback: Function) {
    if (this.events?.[event]) {
      this.events?.[event].push(callback);
    } else {
      this.events[event] = [];
      this.events?.[event].push(callback);
    }
  }

  off(event: string) {
    delete this.events[event];
  }

  emit(event: string, payload?: any) {
    this.events[event]?.forEach((callback) => callback(payload));
  }
}
