// const EventEmitter = require('events');

// const event = new EventEmitter();

class EventEmitter {
  constructor(maxListeners) {
    this.eventsMap = {};
    this.maxListeners = maxListeners || 10;
  }

  on(type, cb) {
    const cbs = this.eventsMap[type];

    if(!cbs) {
      this.eventsMap[type] = []
    }

    if(this.eventsMap[type].length >= this.maxListeners) {
      console.warn(`${type} event max listeners is ${this.maxListeners}`);
      return this;
    }

    this.eventsMap[type].push(cb);
  }

  emit(type, ...args) {
    const cbs = this.eventsMap[type];
    if(!cbs) {
      console.warn(`${type} event is not exist`);
    } else {
      cbs.forEach(func => func.apply(this, args));
    }
    return this;
  }

  once(type, cb) {
    const func = (...args) => {
      this.off(type, func);
      cb.apply(this, args);
    }
    this.on(type, func);
    return this;
  }

  off(type, cb) {
    const cbs = this.eventsMap[type];

    if(!cbs) {
      console.warn(`${type} event is not exist`);
    } else {
      cbs.splice(cbs.indexOf(cb) >>> 0, 1);
    }

    return this;
  }

}