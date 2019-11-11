jQuery.fn.extend({
  slideshow: function (slideshowOptions = {}) {
    return this.each(function () {
      var
        $slideshow = $(this).wrapInner('<div class="slides">'),
        $slides = $slideshow.children().children(),
        $paginator = $('<div class="paginator">'),
        options = $.extend({
          activeSlide: 0,
          entranceAnimation: 'slideInRight',
          exitAnimation: 'slideOutLeft',
          interval: 3000,
          keyboard: true,
          pager: true,
          paginator: true,
          reverse: false,
          wrap: true
        }, $slideshow.data(), slideshowOptions);

      // create the pager and paginator buttons
      $paginator.append(
        $slides.toArray().map(function (slide, index) {
          // make a paginator button for each slide
          return $('<button>')
            .append(
              $('<span class="sr-only">')
                .text('Show Slide ' + (index + 1))
            )
            .on('click', function (event) {
              $slideshow.trigger('slideshow:slide.baseline', index);
            });
        })
      );

      // append the paginator
      if (options.paginator) {
        $slideshow.prepend($paginator);
      }

      // append the pager
      if (options.pager) {
        $slideshow.prepend(
          $('<div class="pager">')
            .append(
              $('<button class="previous">')
                .append(
                  $('<span class="sr-only">')
                    .text('Show Previous Slide')
                )
                .on('click', function () {
                  $slideshow.trigger('slideshow:previous.baseline');
                }),
              $('<button class="next">')
                .append(
                  $('<span class="sr-only">')
                    .text('Show Next Slide')
                )
                .on('click', function () {
                  $slideshow.trigger('slideshow:next.baseline');
                })
            )
        );
      }

      $slideshow
        // pause when slideshow has focus/hover/touch
        .on('mouseenter', function () {
          $slideshow.addClass('hovered');
        })
        .on('focusin mouseenter touchstart slideshow:pause.baseline', function () {
          $slideshow.addClass('paused');
        })
        .on('mouseleave', function () {
          $slideshow.removeClass('hovered');
        })
        // unpause when slideshow doesn't have focus/hover
        .on('focusout mouseleave touchend slideshow:resume.baseline', function () {
          if ($slideshow.find(document.activeElement).length < 1 &&
              !$slideshow.hasClass('hovered')) {
            $slideshow.removeClass('paused');
          }
        })
        // show the slide after the active one, wrapping
        .on('keydown slideshow:next.baseline', function (event) {
          var index = $slides.filter('.active').index();

          if (event.key === undefined || options.keyboard && event.key === 'ArrowRight') {
            $slideshow.trigger('slideshow:slide.baseline', (index === $slides.length - 1) ? 0 : index + 1);
          }
        })
        // show the slide before the active one, wrapping
        .on('keydown slideshow:previous.baseline', function (event) {
          var index = $slides.filter('.active').index();

          if (event.key === undefined || options.keyboard && event.key === 'ArrowLeft') {
            $slideshow.trigger('slideshow:slide.baseline', (index === 0) ? $slides.length - 1 : index - 1);
          }
        })
        // show the slide with the given index
        .on('slideshow:slide.baseline', function (event, data = 0) {
          // convert data to an object if one wasn't passed
          data = $.extend({
            animate: true,
            slide: (typeof data === 'number') ? data : data.slide
          }, data);

          var
            $fromSlide = $slides.filter('.active'),
            $toSlide = $slides.eq(+data.slide),
            extraParameters = {
              $fromSlide: $fromSlide,
              $toSlide: $toSlide,
              fromIndex: $fromSlide.index(),
              toIndex: +data.slide
            };

          function onEntranceAnimationEnd () {
            // if the exiting slide had focus, give it to the entering slide
            if ($fromSlide.is(':focus') || $fromSlide.find(':focus').length > 0) {
              if ($toSlide.is(':focusable')) {
                $toSlide.first().focus();
              } else {
                $toSlide.find(':focusable').first().focus();
              }
            }

            $toSlide.removeClass('entering');
            $slideshow
              .removeClass('sliding')
              .trigger('slideshow:slid', extraParameters);
          }

          function onExitAnimationEnd () {
            $fromSlide.removeClass('active exiting');
          }

          // block while sliding
          if (!$slideshow.hasClass('sliding')) {
            $slideshow
              .addClass('sliding')
              .trigger('slideshow:sliding', extraParameters);

            // hide the current slide
            if (data.animate && options.exitAnimation) {
              $fromSlide
                .addClass('exiting')
                .animateCss(options.exitAnimation)
                .one('animationend', onExitAnimationEnd);
            } else {
              onExitAnimationEnd();
            }

            // update the paginator immediately, regardless of animation
            $paginator.children().eq(extraParameters.fromIndex)
              .removeClass('active')
              .prop('disabled', false);

            // show the next slide and update the paginator
            $paginator.children().eq(extraParameters.toIndex)
              .prop('disabled', true)
              .add($toSlide.addClass('entering'))
                .addClass('active');

            // set focus and trigger the slid event
            if (data.animate && options.entranceAnimation) {
              $toSlide
                .animateCss(options.entranceAnimation)
                .one('animationend', onEntranceAnimationEnd);
            } else {
              onEntranceAnimationEnd();
            }
          }
        })
        // show the active slide on page load
        .trigger(
          'slideshow:slide.baseline',
          { animate: false,
            slide: options.activeSlide }
        );

      // start the slideshow
      if (options.interval) {
        options.intervalID = setInterval(function () {
          // don't do anything if the slideshow's paused
          if (!$slideshow.is('.paused')) {
            // stop the interval after one iteration if no-wrap is declared
            if (options.afterFirstInterval && !options.wrap && $slides.filter('.active').index() === +options.activeSlide) {
              clearInterval(options.intervalID);
            // don't change keyboard focus on the user when changing slides
            } else if (options.reverse) {
              $slideshow.trigger('slideshow:previous.baseline')
            } else {
              $slideshow.trigger('slideshow:next.baseline');
            }

            options.afterFirstInterval = true;
          }
        }, options.interval);
      }
    });
  }
});
