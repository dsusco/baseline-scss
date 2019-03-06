jQuery.fn.extend({
  hasEventHandler: function (event, _function) {
    try {
      return this.hasEvent(event) &&
             !!$._data(this[0], 'events')[event.replace(/\.[^.]+$/, '')].find(function (delegate) {
               return _function.toString() === delegate.handler.toString();
             });
    } catch (e) {
      return false;
    }
  }
});
