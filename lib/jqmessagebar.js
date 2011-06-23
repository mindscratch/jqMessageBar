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
			// summary: create the message bar
			// options: {Object}
			//			Options used to configure the message bar
			//			background_color: {String}
			//					the background color of the message bar
			//			position: {String}
			//					the position of the message bar, either "top" or "bottom"
			//			content_class: {String}
			//					the CSS class to apply to the content of the message bar
			//			shadow: {Boolean}
			//					true to add a drop shadow to the message bar (only applied if position is "top")
			return this.each(function() {
				if (options) {
					$.extend(settings, options);
				}
			
				var $this = $(this),
				wrapper = createWrapper($this, settings);
			});
		},
		
		show: function() {
			// summary: show the message bar
			return this.each(function() {
				$(".messagebar", this).show();
			});
		},
		
		hide: function() {
			// summary: hide the message bar
			return this.each(function() {
				$(".messagebar", this).hide();
			});
		},
	};
	
	var createWrapper = function(el, settings) {
		var classes = ['messagebar', 'messagebar-' + settings.position, settings.content_class];
		if (settings.shadow && settings.position == 'top') {
			classes.push('messagebar-shadow');
		}
	
		var wrapper = $('<div />').addClass(classes.join(' ')).css({"background-color": settings.background_color});
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