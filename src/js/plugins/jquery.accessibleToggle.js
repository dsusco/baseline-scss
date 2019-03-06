jQuery.fn.extend({
  accessibleToggle: function (accessibleToggleOptions = {}) {
    return this.each(function () {
      var
        $toggle = $(this),
        options = $.extend({
          hidingAnimation: false,
          showingAnimation: false
        }, $toggle.data(), accessibleToggleOptions),
        $control = $(options.control),
        $parent = $(options.parent).first();

      function hide (event = null, extraParameters = {}) {
        var ariaLabelledby = '';

        // block while hiding
        if (!$toggle.hasClass('hiding')) {
          $toggle
            .addClass('hiding')
            .trigger('accessibleToggle:hiding');

          if ($toggle.is(':visible') && options.hidingAnimation) {
            $toggle.animateCss(options.hidingAnimation);
          }

          try {
            // update all controls
            ariaLabelledby = $('#' + $toggle.attr('aria-labelledby').split(' ').join(', #'))
              .removeClass('shown-toggle')
              .addClass('hidden-toggle')
              .attr('aria-expanded', false)
              .toArray().reduce(function (ariaLabelledby, el) {
                return ariaLabelledby + ' ' + el.getAttribute('id');
              }, '');
          } catch (ignore) {}

          // remove controls that are no longer on the page
          $toggle.attr('aria-labelledby', ariaLabelledby.trim());

          if ($toggle.hasEvent('animationend')) {
            // if there's an animation, let it complete before hiding
            $toggle.one('animationend', hideToggle);
          } else {
            hideToggle();
          }

          if (extraParameters.stopPropagation === true) {
            event.stopPropagation();
          }
        }
      }

      function hideToggle () {
        $toggle
          .prop('hidden', true)
          .removeClass('hiding')
          .trigger('accessibleToggle:hidden');
      }

      function show (event = null, extraParameters = {}) {
        var ariaLabelledby = '';

        // block while showing
        if (!$toggle.hasClass('showing')) {
          $toggle
            .addClass('showing')
            .trigger('accessibleToggle:showing');

          if ($toggle.is(':hidden') && options.showingAnimation) {
            $toggle.animateCss(options.showingAnimation);
          }

          try {
            // if a parent is defined, hide all other toggles in it
            $($parent.data('accessible-toggle-children').join(',')).not($toggle)
              .trigger('accessibleToggle:hide.baseline', { stopPropagation: true });
          } catch (ignore) {}

          try {
            // update all controls
            ariaLabelledby = $('#' + $toggle.attr('aria-labelledby').split(' ').join(', #'))
              .removeClass('hidden-toggle')
              .addClass('shown-toggle')
              .attr('aria-expanded', true)
              .toArray().reduce(function (ariaLabelledby, el) {
                return ariaLabelledby + ' ' + el.getAttribute('id');
              }, '');
          } catch (ignore) {}

          // remove controls that are no longer on the page
          $toggle.attr('aria-labelledby', ariaLabelledby.trim());

          $toggle
            .prop('hidden', false)
            .removeClass('showing')
            .trigger('accessibleToggle:shown');

          if (extraParameters.stopPropagation === true) {
            event.stopPropagation();
          }
        }
      }

      function toggleClick (event) {
        $toggle.is(':visible') ? hide(event) : show(event);
      }

      $toggle
        .id('accessible_toggle')
        .addClass('accessible-toggle');

      $control
        .id('accessible_toggle_control')
        .attr('aria-controls', function (index, attr) {
          try {
            attr = attr.split(' ')
          } catch (e) {
            attr = [];
          }

          if (attr.indexOf($toggle.attr('id')) < 0) {
            attr.push($toggle.attr('id'));
          }

          return attr.join(' ').trim();
        })
        .prop('disabled', false);

      $parent
        .data('accessible-toggle-children', ($parent.data('accessible-toggle-children') || []).concat('#' + $toggle.attr('id')));

      $toggle
        .attr('aria-labelledby', function (index, attr) {
          try {
            attr = attr.split(' ')
          } catch (e) {
            attr = [];
          }

          $control.each(function () {
            var controlID = $(this).attr('id');

            if (attr.indexOf(controlID) < 0) {
              attr.push(controlID);
            }
          });

          return attr.join(' ').trim();
        });

      // check the toggle for show/hide events
      if (!$toggle.hasEventHandler('accessibleToggle:hide.baseline', hide) ||
          !$toggle.hasEventHandler('accessibleToggle:show.baseline', show) ) {
        $toggle
          .on('accessibleToggle:hide.baseline', hide)
          .on('accessibleToggle:show.baseline', show);

        $(window)
          .on('load resize', function () {
            var hidden = options.hidden === undefined ? $toggle.is(':hidden') : eval(options.hidden);

            $toggle
              .prop('hidden', hidden);

            $control
              .removeClass('shown-toggle hidden-toggle')
              .addClass(hidden ? 'hidden-toggle' : 'shown-toggle')
              .attr('aria-expanded', !hidden);
          });
      }

      // check the control for click events
      if (!$control.hasEventHandler('click', toggleClick)) {
        $control
          .on('click', toggleClick)
          .not('button, [type="button"], [type="image"], [type="reset"], [type="submit"]')
            .on('keypress', function (event) {
              if (event.key === 'Enter') {
                toggleClick(event);
              }
            });
      }
    });
  }
});
