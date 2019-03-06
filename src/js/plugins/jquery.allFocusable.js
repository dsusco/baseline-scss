jQuery.extend(jQuery.expr.pseudos, {
  'all-focusable': function (el) {
    var
      $el = $(el),
      hasTabindex = $el.attr('tabindex') !== undefined && +$el.attr('tabindex') > -1,
      map,
      mapName,
      nodeName = el.nodeName.toLowerCase(),
      returnValue = false;

    if ('a' === nodeName ) {
      returnValue = el.href || hasTabindex;
    } else if ('area' === nodeName) {
      map = el.parentNode;
      mapName = map.name;

      if (el.href && mapName && map.nodeName.toLowerCase() === 'map') {
        returnValue = $("img[usemap='#" + mapName + "']")[0];
      }
    } else if (/^(button|input|object|select|textarea)$/.test(nodeName)) {
      returnValue = true;
    } else {
      returnValue = hasTabindex;
    }

    return returnValue;
	}
});
