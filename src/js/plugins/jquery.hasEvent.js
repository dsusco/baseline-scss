jQuery.fn.extend({
  hasEvent: function (event) {
    var namespace = '';

    event = event.split('.');

    if (event.length > 1) {
      namespace = event.pop();
      event = event.join('.');
    } else {
      event = event.pop();
    }

    try {
      return !!$._data(this[0], 'events')[event].find(function (delegate) {
        return (namespace === '' || namespace === delegate.namespace);
      });
    } catch (e) {
      return false;
    }
  }
});
