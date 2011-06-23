(function($) {

    var settings = {
		/* background color of the message bar */
		background_color: '#003B62',
		/* the position of the message bar: "top" or "bottom" */
		position: 'top',
		/* a CSS class to apply to the content of the message bar */
		content_class: 'messagebar-content',
		/* true to display a drop shadow (only if position is 'top') */
		shadow: true
	};
	
	var methods = {
		init: function(options) {
			return this.each(function() {
				if (options) {
					$.extend(settings, options);
				}
			
				var $this = $(this),
					wrapper = (settings.position == 'top' ? createWrapper($this, 'messagebar messagebar-top') : createWrapper($this, 'messagebar messagebar-bottom'));
					wrapper.addClass(settings.content_class);
					if (settings.shadow) {
						wrapper.addClass('messagebar-shadow');
					}
					wrapper.css({"background-color": settings.background_color});
			});
		},
		
		speak: function(msg) {
			return this.each(function() {
				console.log("hello: " + msg);
			});
		}
	};
	
	var createWrapper = function(el, classes) {
		var wrapper = $('<div class="' + classes + '" />');
		el.prepend(wrapper);
		return wrapper;
	};

    $.fn.messagebar = function(method) {

		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.messagebar' );
		} 	

    };
})(jQuery);