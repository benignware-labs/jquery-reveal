(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {

  function delayed(delay) {
    var dfd = $.Deferred();
    window.setTimeout(function() {
      dfd.resolve();
    }, delay);
    return dfd.promise();
  }

  // http://stackoverflow.com/questions/4774746/jquery-ajax-wait-until-all-images-are-loaded
  function imagesLoaded(element, options) {
    options = options || {};
    var $element = $(element || this);
    // get all the images (excluding those with no src attribute)
    var $imgs = $element.is('img') ? $(element) : $element.find('img');

    // if there's no images, just return an already resolved promise
    if (!$imgs.length) {return $.Deferred().resolve().promise();}

    // for each image, add a deferred object to the array which resolves when the image is loaded (or if loading fails)
    var dfds = [];
    $imgs.each(function() {
        var dfd = $.Deferred();
        var $this = $(this);
        if (options.lazyLoad && $this.data('src')) {
          $this.attr('src', $this.data('src'));
        }
        var src = $this.attr('src');
        dfds.push(dfd);
        var img = new window.Image();
        img.onload = function() {
          dfd.resolve();
        };
        img.onerror = function() {
          dfd.reject();
        };
        img.src = src;
    });

    // return a master promise object which will resolve when all the deferred objects have resolved
    // IE - when all the images are loaded
    return $.when.apply($,dfds);

  }


  function inView(element, offset) {
    offset = offset || 0;
    var viewTop = $(window).scrollTop();
    var viewBottom = viewTop + $(window).innerHeight();
    var top = $(element).offset().top + offset;
    var bottom = top + $(element).height() - offset;
    return (top >= viewTop && top <= viewBottom || bottom >= viewTop && bottom <= viewBottom);
  }

  var
    elements = [],
    revealed = [],
    scrollTop = $(window).scrollTop(),
    initialUpdate = false,
    queue = [],
    queueIsRunning = false,
    current = null,
    next = function() {
      if (!queue.length) {
        // Finished
        queueIsRunning = false;
        current = null;
        return;
      }

      queue = queue.sort(function(a, b) {
        var
          aTop = Math.floor($(a).offset().top),
          bTop = Math.floor($(b).offset().top);
        return aTop - bTop;
      });
      current = queue.shift();
      var options = $(current).data('reveal').getOptions();
      var delay = options.delay;
      if (!queueIsRunning) {
        // TODO: detect if animations are currently running
        //delay = 0;
        queueIsRunning = true;
      }
      var element = current;
      var delayPromise = options.delay > 0 ? delayed(options.delay) : true;
      var imagePromise = imagesLoaded(element, {lazyLoad: options.lazyLoad});
      if (options.imagesBlock) {
        $.when(delayPromise, imagePromise).done(function() {
          // Apply animation only if the element is still in view
          showElement(element);
          // Shift next element in queue
          next();
        });
      } else {
        $.when(delayPromise, imagePromise).done(function() {
          // Apply animation only if the element is still in view
          showElement(element);
        });
        $.when(delayPromise).done(function() {
          // Shift next element in queue
          next();
        });
      }

    };


  function showElement(element, skip, options) {
    var $element = $(element);
    options = options || $element.data('reveal').getOptions();
    var animatedClass = $element.data('animated-class') || options.animatedClass;
    var pausedClass = $element.data('paused-class') || options.pausedClass;
    if (skip) {
      $element.css('animation-duration', '0s');
    }
    $element.removeClass(pausedClass);
    $element.addClass(animatedClass);
  }

  function update() {
    var viewTop = $(window).scrollTop();
    var viewBottom = viewTop + $(window).innerHeight();
    var scrollDelta = viewTop - scrollTop;
    var initial = false;
    if (scrollDelta === 0 && !initialUpdate) {
      initialUpdate = true;
      initial = true;
    }

    scrollTop = viewTop;
    elements.forEach(function(element, index) {
      var
        options = $(element).data('reveal').getOptions(),
        offset = options.offset || 0,
        bounds = element.getBoundingClientRect(),
        height = bounds.height,
        top = viewTop + bounds.top,
        bottom = top + height;

      if (top >= viewTop && top <= viewBottom || bottom >= viewTop && bottom <= viewBottom) {
        // Element is in view
        if (revealed.indexOf(element) === -1 && ( !options.initialOffset && initial || (top >= viewTop && top <= viewBottom - offset || bottom >= viewTop && bottom <= viewBottom - offset) ) ) {
          // Element is in view - offset and it has not been revealed yet
          revealed.push(element);
          queue.push(element);
          if (!queueIsRunning) {
            next();
          }
        }
      } else {
        var above = viewTop > bottom && height > 0;
        if (viewTop > bottom && height > 0) {
          // Above view, immediately run animation to the end.
          showElement(element, true);
          elements.splice(index, 1);
          // Remove queued element
          var queueIndex = queue.indexOf(element);
          if (queueIndex >= 0) {
            queue.splice(queueIndex, 1);
          }
          if (current === element) {
            next();
          }
        }
      }
    });

  }

  var scrollTimeout = null;
  $(window).on('scroll', function(e) {
    scrollTimeout = window.setTimeout(function() {
      update();
    }, 40);
  });

  /**
   * JQuery Plugin
   */

  function Reveal(element, options) {
    // Init plugin instance
    var
      $element = $(element),
      _this = this,
      revealed = [],
      opts = $.extend(true, {
        "delay": 400,
        "offset": 0,
        "animatedClass": "animated",
        "skipInitial": true,
        "lazyLoad": false,
        "initialOffset": false
      }, options),
      viewTop = $(window).scrollTop(),
      viewBottom = viewTop + $(window).innerHeight(),
      bounds = element.getBoundingClientRect(),
      height = bounds.height,
      top = viewTop + bounds.top,
      bottom = top + height;

    if (elements.indexOf(element) === -1 && (viewBottom < top || !opts.skipInitial)) {
      // The element is up to be revealed
      elements.push(element);
    } else if (top < viewBottom && opts.skipInitial) {
      showElement(element, true, opts);
    }

    this.getOptions = function() {
      return $.extend({}, opts);
    };

    /**
     * Updates the component
     * @param {Object} options
     */
    this.update = function(options) {
      $.extend(opts, options);
      // Update global logic
      update();
    };

    // Initial update
    /*this.update($.extend(true, {
      delay: 0
    }, options, $element.data()));*/
  }

  // Add Plugin to registry
  $.fn.reveal = function() {
    var
      args = [].slice.call(arguments),
      result = this.each(function() {
        return (function(instance) {
          var
            result;
          // Update or init plugin
          $(this).data('reveal', instance = instance ? typeof args[0] === 'object' && instance.update(args[0]) && instance || instance : new Reveal(this, args[0]));
          // Call method
          result = typeof args[0] === 'string' && typeof instance[args[0]] === 'function' ? instance[args[0]].apply(instance, args.slice(1)) : result;
          // Return undefined or chaining element
          return typeof result !== 'undefined' ? result : this;
        }).call(this, $(this).data('reveal'));
      });
    update();
    return result;
  };

}));
