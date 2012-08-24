;(function($, window, document, undefined) {
  var Carousel = function(wrapper, options) {
    this.wrapper = wrapper;
    this.options = $.extend({}, Carousel.defaults, options);
    // Wait until all images are loaded
    var carousel = this, left = $(this.wrapper).find('img').load(function() {
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
    // Mark carousel ready
    $(this.wrapper).addClass('ready');
    // Define the children property as a method in order for it
    // to update its child order every time it changes
    this.children = function() {
      return carousel.list.find('> li');
    };
    // Disable carousel if it has less than two items
    if (this.children().length < 2) {
      // Hide navigation
      $(this.wrapper).find('.nav').hide();
      return;
    }
    // Save order index as their position is going to change
    this.children().each(function(i) {
      $(this).data('index', i);
    });
    // Set click events on arrow buttons
    this.arrow = $(this.wrapper).find('.arrow').click(function(e) {
      e.preventDefault();
      carousel.move($(this).data('direction'));
    });
    // Set first element as current
    this.current = this.children().first();
    // Slide and update carousel for the first time
    this.slide();
    this.update();
  };
  Carousel.prototype.move = function(direction) {
    // Return if not ready
    if (!$(this.wrapper).hasClass('ready')) {
      return;
    }
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
    this.list.stop().css('marginLeft', -this.current.position().left);
  };
  Carousel.prototype.slide = function() {
    this.list.stop().animate({
      marginLeft: -this.current.position().left
    });
    $(this.wrapper).find('.mask').stop().animate({
      height: this.current.outerHeight()
    });
  };
  Carousel.prototype.update = function() {
    // Populate navigation variables
    $(this.wrapper).find('.total').html(this.children().length);
    $(this.wrapper).find('.current').html(this.current.data('index') + 1);
    // Run user callback, if present
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