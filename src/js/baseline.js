//= require_tree .

$(function () {
  $('body.no-js')
    .toggleClass('js no-js');

  $('a[href^="mailto:"]')
    .each(function () {
      var $a = $(this);

      $a
        .attr(
          'href',
          $a.attr('href')
            .replace(/\s*\[at\]\s*/ig, '@')
            .replace(/\s*\[dot\]\s*/ig, '.')
        )
        .html(
          $a.html()
            .replace(/\s*\[at\]\s*/ig, '@')
            .replace(/\s*\[dot\]\s*/ig, '.')
        );
    });
});
