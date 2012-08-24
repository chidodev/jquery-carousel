;(function($, window, document, undefined) {
  var Carousel = function(wrapper, options) {
    this.wrapper = wrapper
    // Store options while extending defaults
    this.options = $.extend({}, Carousel.defaults, options);
    this.init();
  };
  Carousel.defaults = {};
  Carousel.prototype = {
    init: function() {
      var carousel = this;
      this.list = $(this.wrapper).find('ul');
      // Define the children property as a method in order for it
      // to update its child order every time it changes
      this.children = function() {
        return carousel.list.find('> li');
      };
      // Get first element if previously set
      this.current = this.children().filter('.current').first();
      // Set first element as current otherwise
      if (!this.current.length) {
        this.current = this.children().first().addClass('current');
      }
      // Re-set carousel height every time an image is loaded
      this.children().find('img').load(function() {
        if($(this).parent('li').hasClass('current')) {
          carousel.slide(true);
        }
      });
      // Save order index as their position is going to change
      this.children().each(function(i) {
        // Ignore if already set
        if ($(this).data('index') == null) {
          $(this).data('index', i);
        }
      });
      // Setup and show nav only if more than one child
      if (this.children().length > 1) {
        $(this.wrapper).find('.nav').show();
        // Bind click events on arrow buttons
        $(this.wrapper).find('.arrow').unbind('click').click(function(e) {
          e.preventDefault();
          carousel.move($(this).data('direction'));
        });
      } else {
        $(this.wrapper).find('.nav').hide();
      }
      // Init only if at least on child
      if (this.children().length) {
        this.slide(true);
        this.update();
      }
    },
    move: function(direction) {
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
      // Replace current element and move CSS class to it
      this.children().removeClass('current')
        .filter(this.current = next).addClass('current');
      this.slide();
      this.update();
    },
    resetPosition: function() {
      this.list.stop().css('marginLeft', -this.current.position().left);
    },
    slide: function(direct) {
      this.list.stop().animate({
        marginLeft: -this.current.position().left
      }, direct ? 0 : 400);
      $(this.wrapper).find('.mask').stop().animate({
        height: this.current.outerHeight()
      }, direct ? 0 : 400);
    },
    update: function() {
      // Populate navigation variables
      $(this.wrapper).find('.nav .total').html(this.children().length);
      $(this.wrapper).find('.nav .current').html(this.current.data('index') + 1);
      // Run user callback, if present
      if (typeof(this.options.callback) == 'function') {
        this.options.callback.call(this, this.current.find('img'));
      }
    }
  };
  $.fn.carousel = function(options) {
    this.each(function() {
      $.data(this, 'carousel', new Carousel(this, options));
    });
    return this;
  };
})(jQuery, window, document);