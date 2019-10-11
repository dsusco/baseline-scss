jQuery.fn.extend({
  modal: function (modalOptions = {}) {
    return this.each(function () {
      var
        $modal = $(this),
        options = $.extend({
          closingAnimation: false,
          open: true,
          openingAnimation: false,
          parent: 'body > div:first-of-type'
        }, $modal.data(), modalOptions),
        $control,
        $parent;

      try {
        $control = $(options.control);
      } catch (e) {
        if (options.control.charAt(0) === '#') {
          $control = $(document.getElementById(options.control.substr(1)));
        }
      }

      try {
        $parent = $(options.parent).first()
      } catch (e) {
        if (options.parent.charAt(0) === '#') {
          $parent = $(document.getElementById(options.parent.substr(1)));
        }
      }

      // if no div is present, use the body
      if (!$parent.length) {
        $parent = $('body');
      }

      function close (event) {
        var ariaLabelledby = '';

        // block while closing
        if (!$modal.hasClass('closing')) {
          $modal
            .addClass('closing')
            .trigger('modal:closing');

          $control.addClass('closing-toggle');

          // add an animation if this isn't the intial close and the modal is opened
          if (event !== undefined && $modal.is(':visible') && options.closingAnimation) {
            $modal.animateCss(options.closingAnimation);
          }

          $(document)
            .off('click', closeOnClick)
            .off('keydown', closeOnEsc);

          try {
            // update all controls
            ariaLabelledby = $($modal.attr('aria-labelledby').split(' ').map(function (id) {
                return document.getElementById(id);
              }))
              .removeClass('opened')
              .addClass('closed')
              .attr('aria-expanded', false)
              .toArray().reduce(function (ariaLabelledby, el) {
                return ariaLabelledby + ' ' + el.getAttribute('id');
              }, '');
          } catch (ignore) {}

          // remove controls that are no longer on the page
          $modal.attr('aria-labelledby', ariaLabelledby.trim());

          if ($modal.hasEvent('animationend')) {
            // if there's an animation, let it complete before hiding the modal
            $modal.one('animationend', closeModal);
          } else {
            closeModal();
          }
        }
      }

      function closeModal () {
        $modal.prop('hidden', true);

        // allow focus again on non-modal elements
        $('[data-tabindex]')
          .each(function () {
            var $el = $(this);

            $el
              .attr('tabindex', eval($el.attr('data-tabindex')))
              .attr('data-tabindex', null);
          });

        $parent.removeClass('modal-overlay');

        $($modal.data('last-focus')).focus();

        $control.removeClass('closing-toggle');

        $modal
          .removeClass('closing')
          .trigger('modal:closed');
      }

      function closeOnEsc (event) {
        if (event.key === 'Escape') {
          close(event);
        }
      }

      function closeOnClick (event) {
        var $target = $(event.target);

        // close if the target isn't a child of the modal, or if its a close button
        if ($target.hasClass('close') || !$target.parent().closest($modal).length && !$target.is($control)) {
          close(event);

          // don't follow links
          event.preventDefault();
        }
      }

      function open (event) {
        var
          $document = $(document),
          ariaLabelledby = '';

        // block while opening
        if (!$modal.hasClass('opening')) {
          $modal
            .addClass('opening')
            .trigger('modal:opening');

          $control.addClass('opening-toggle');

          // add an animation if this isn't the intial open and the modal is closed
          if (event !== undefined && $modal.is(':hidden') && options.openingAnimation) {
            $modal.animateCss(options.openingAnimation);
          }

          if (!$document.hasEventHandler('click', closeOnClick)) {
            $document.on('click', closeOnClick);
          }

          if (!$document.hasEventHandler('keydown', closeOnEsc)) {
            $document.on('keydown', closeOnEsc);
          }

          try {
            // update all controls
            ariaLabelledby = $($modal.attr('aria-labelledby').split(' ').map(function (id) {
                return document.getElementById(id);
              }))
              .removeClass('closed')
              .addClass('opened')
              .attr('aria-expanded', true)
              .toArray().reduce(function (ariaLabelledby, el) {
                return ariaLabelledby + ' ' + el.getAttribute('id');
              }, '');
          } catch (ignore) {}

          // remove controls that are no longer on the page
          $modal.attr('aria-labelledby', ariaLabelledby.trim());

          $modal.data('last-focus', document.activeElement);

          $parent.addClass('modal-overlay');

          // remove focus on non-modal elements
          $(':all-focusable')
            .not($(':all-focusable', $modal))
            .not('[tabindex^=-]')
            .each(function () {
              var $el = $(this);

              $el
                .attr('data-tabindex', $el.attr('tabindex') || 'null')
                .attr('tabindex', '-1');
            });

          $modal.prop('hidden', false);

          if ($modal.hasEvent('animationend')) {
            // if there's an animation, let it complete before focusing and scrolling
            $modal.one('animationend', openModal);
          } else {
            openModal()
          }
        }
      }

      function openModal () {
        $modal.find(':focusable').first().focus()

        $modal.find('.modal-body').scrollTop(0);

        $control.removeClass('opening-toggle');

        $modal
          .removeClass('opening')
          .trigger('modal:opened');
      }

      $modal
        .id('modal')
        .addClass('modal');

      $control
        .id('modal_control')
        .addClass('modal-control')
        .attr('aria-controls', function (index, attr) {
          try {
            attr = attr.split(' ')
          } catch (e) {
            attr = [];
          }

          if (attr.indexOf($modal.attr('id')) < 0) {
            attr.push($modal.attr('id'));
          }

          return attr.join(' ').trim();
        })
        .prop('disabled', false);

      $modal
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

      // check the modal for open/close events
      if (!$modal.hasEventHandler('modal:close.baseline', close) ||
          !$modal.hasEventHandler('modal:open.baseline', open)) {
        $modal
          .on('modal:close.baseline', close)
          .on('modal:open.baseline', open)
          .appendTo($parent);
      }

      // check the control for click events
      if (!$control.hasEventHandler('click', open)) {
        $control
          .on('click', open)
          .not('button, [type="button"], [type="image"], [type="reset"], [type="submit"]')
            .on('keypress', function (event) {
              if (event.key === 'Enter') {
                open(event);
              }
            });
      }

      if (options.open) {
        open();
      } else {
        close();
      }
    });
  }
});
