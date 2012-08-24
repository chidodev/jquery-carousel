;(function($, window, document, undefined) {
  var Carousel = function(wrapper, options) {
    this.wrapper = wrapper;
    this.options = $.extend({}, Carousel.defaults, options);
    // Wait until all images are loaded
    var carousel = this;
    var left = $(this.wrapper).find('img').load(function() {
      if (!--left) {
        carousel.init();
      }
    }).length;
  };
  Carousel.defaults = {};
  Carousel.prototype.init = function() {
    var carousel = this;
    this.list = $(this.wrapper).find('ul');
    // Set list fixed width to it current automatic width
    this.list.width(this.list.width());
    // Define the children property as a method in order for it
    // to update its child order every time it changes
    this.children = function() {
      return carousel.list.find('> li');
    };
    // Set click events on arrow buttons
    this.arrow = $(this.wrapper).find('.arrow').click(function(e) {
      e.preventDefault();
      carousel.move($(this).data('direction'));
    });
    // Set first element as current
    this.current = this.children().first();
    // Mask carousel ready
    $(this.wrapper).addClass('ready');
    // Update carousel for the first time
    this.update();
  };
  Carousel.prototype.move = function(direction) {
    // Return if not ready
    if (!$(this.wrapper).hasClass('ready')) {
      return;
    }
    // Stop any animation from continuing
    this.list.stop();
    var next;
    if (direction == 'prev') {
      if (this.current.is(':first-child')) {
        // Move last children to the beggining of the list and
        // reset position
        this.list.prepend(this.children().last());
        this.resetPosition();
      }
      next = this.current.prev();
    } else {
      if (this.current.is(':last-child')) {
        // Move first children to the end of the list and
        // reset position
        this.list.append(this.children().first());
        this.resetPosition();
      }
      next = this.current.next();
    }
    this.slide(this.current = next);
    this.update();
  };
  Carousel.prototype.resetPosition = function() {
    this.list.css('marginLeft', -this.current.position().left);
  };
  Carousel.prototype.slide = function() {
    this.list.animate({
      marginLeft: -this.current.position().left
    });
  };
  Carousel.prototype.update = function() {
    // show display
    if (typeof(this.options.callback) == 'function') {
      this.options.callback.call(this, this.current.find('img'));
    }
  };
  $.fn.carousel = function(options) {
    this.each(function() {
      // Ignore if already initialized
      if ($.data(this, 'carousel')) {
        return;
      }
      $.data(this, 'carousel', new Carousel(this, options));
    });
    return this;
  };
})(jQuery, window, document);