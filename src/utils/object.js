const hasOwnProperty = Object.prototype.hasOwnProperty;
const propIsEnumerable = Object.prototype.propertyIsEnumerable;

const objectOperation = {
  isObject: function(x) { 
    var type = typeof x;
    return x !== null && (type === 'object' || type === 'function');
  },
   
  toObject: function(val) {
    if (val === null || val === undefined) {
      return {}
    }
   
    return Object(val);
  },
   
  assignKey: function(to, from, key) {
    var val = from[key];
   
    if (val === undefined || val === null) {
      return null;
    }
   
    if (hasOwnProperty.call(to, key)) {
      if (to[key] === undefined || to[key] === null) {
        throw new TypeError('Cannot convert undefined or null to object (' + key + ')');
      }
    }
   
    if (!hasOwnProperty.call(to, key) || !this.isObject(val)) {
      to[key] = val;
    } else {
      to[key] = this.assign(Object(to[key]), from[key]);
    }
  },
   
  assign: function(to, from) {
    if (to === from) {
      return to;
    }
   
    from = Object(from);
    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        this.assignKey(to, from, key);
      }
    }
   
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(from);
   
      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from, symbols[i])) {
          this.assignKey(to, from, symbols[i]);
        }
      }
    }
   
    return to;
  },

  deepAssign: function(target) {
    target = this.toObject(target);
   
    for (var s = 1; s < arguments.length; s++) {
      this.assign(target, arguments[s]);
    }
   
    return target;
  }
}

export default objectOperation
