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
  
  /**
   * JQuery Plugin
   */
    
  function Plugin(element, options) {
    // Init plugin instance
    var
      $element = $(element),
      opts = $.extend(true, {}, options, {
        // Plugin Defaults:
      }, $element.data());
    
    /**
     * Updates the component
     * @param {Object} options
     */
    this.update = function(options) {
      $.extend(opts, options);
    };
    
    // Initial update
    this.update();
  }
  
  // Add Plugin to registry
  $.fn.plugin = function(options) {
    return this.each(function() {
      return ($(this).data('plugin') && $(this).data('plugin').update(options) || $(this).data('plugin', new Plugin(this, options)));
    });
  };

}));