jQuery.extend(jQuery.expr.pseudos, {
  focusable: function (el) {
    var
      $el = $(el),
      fieldset,
      hasTabindex = $el.attr('tabindex') !== undefined && +$el.attr('tabindex') > -1,
      map,
      mapName,
      nodeName = el.nodeName.toLowerCase(),
      returnValue = false;

    function visible ($el) {
      var visibility = $el.css('visibility');

      while (visibility === 'inherit') {
        $el = $el.parent();

        visibility = $el.css('visibility');
      }
      return visibility !== 'hidden';
    }

    if ('a' === nodeName ) {
      returnValue = el.href || hasTabindex;
    } else if ('area' === nodeName) {
      map = el.parentNode;
      mapName = map.name;

      if (el.href && mapName && map.nodeName.toLowerCase() === 'map') {
        returnValue = $("img[usemap='#" + mapName + "']")[0];
      }
    } else if (/^(button|input|object|select|textarea)$/.test(nodeName)) {
      returnValue = !el.disabled;

      if (returnValue) {
        fieldset = $el.closest('fieldset')[0];

        if (fieldset && !$el.closest('legend')[0]) {
          returnValue = !fieldset.disabled;
        }
      }
    } else {
      returnValue = hasTabindex;
    }

    return returnValue && $el.is(':visible') && visible($el);
	}
});
