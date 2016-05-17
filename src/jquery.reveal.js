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
      window.setTimeout(function() {
        // Apply
        $(current).css('visibility', '');
        $(current).addClass(options['class']);
        // TODO: detect animation end and set animating flag
        next();
      }, delay);
    };
  
  function update() {
    
    var viewTop = $(window).scrollTop();
    var viewBottom = viewTop + $(window).innerHeight();
    
    var scrollDelta = viewTop - scrollTop;
    scrollTop = viewTop;
    
    if (scrollDelta === 0) {
      return;
    }
    
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
        top = top + offset;
        bottom = bottom - offset;
        if (revealed.indexOf(element) === -1 && (top >= viewTop && top <= viewBottom || bottom >= viewTop && bottom <= viewBottom)) {
          // Element has not been revealed yet
          revealed.push(element);
          queue.push(element);
          if (!queueIsRunning) {
            next();
          }
        }
      } else {
        var above = viewTop > bottom && height > 0;
        if (viewTop > bottom && height > 0) {
          // Above view, abort
          $(element).removeClass(options['class']);
          $(element).css('visibility', '');
          elements.splice(index, 1);
          // Remove queued element
          var queueIndex = queue.indexOf(element);
          if (queueIndex >= 0) {
            queue.splice(queueIndex, 1);
          }
          if (current === element) {
            next();
          }
        } else {
          //$(element).css('visibility', 'hidden');
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
    console.log("init reveal");
    // Init plugin instance
    var
      $element = $(element),
      _this = this,
      revealed = [],
      opts = $.extend(true, {
        "delay": 200,
        "offset": 0,
        "class": "animated"
      }, options),
      viewTop = $(window).scrollTop(),
      viewBottom = viewTop + $(window).innerHeight(),
      bounds = element.getBoundingClientRect(),
      height = bounds.height,
      top = viewTop + bounds.top,
      bottom = top + height;
    
    if (viewBottom < top && elements.indexOf(element) === -1) {
      $(element).css('visibility', 'hidden');
      elements.push(element);
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
      // Update logic
      update();
    };
    
    /**
     * Example method
     * @param {String} bar
     */
    this.foo = function(bar) {
      $.extend(opts, options);
      // Method logic
      //$element.html(bar || opts.foo);
    };
    
    // Initial update
    this.update($.extend(true, {
      // Plugin Defaults:
      foo: 'Bar'
    }, options, $element.data()));
  }
  
  // Add Plugin to registry
  $.fn.reveal = function() {
    var
      args = [].slice.call(arguments);
    return this.each(function() {
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
  };

}));