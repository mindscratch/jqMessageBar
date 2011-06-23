(function($) {

    var settings = {
		background_color: '#003B62',
		position: 'top',
		content_class: 'messagebar-content',
		content_id: 'messagebar-content',
		shadow: true,
		message_types: {
			info: {barClass: 'messagebar-info', contentClass: 'messagebar-content-info'},
			error: {barClass: 'messagebar-error', contentClass: 'messagebar-content-error'},
		}
	};
	
	var api = {
		init: function(options) {
			// summary:
			//			create the message bar
			// options: {Object}
			//			Options used to configure the message bar
			//			background_color: {String}
			//					the background color of the message bar
			//			position: {String}
			//					the position of the message bar, either "top" or "bottom"
			//			content_class: {String}
			//					the CSS class to apply to the content of the message bar
			//			content_id: {String}
			//					the DOM id of the element that will contain the message bar content
			//			shadow: {Boolean}
			//					true to add a drop shadow to the message bar (only applied if position is "top")
			//			message_types: {Object}
			//					define message types and associate CSS classes for the bar and content elements when a message
			//					of a particular type is displayed. (see the default settings).
			return this.each(function() {
				var opts = $.extend({}, settings, options);
			
				var $this = $(this),
				data = $this.data('messagebar');
				
				if (!data) {
					var wrapper = createWrapper(opts),
					content = createContent(opts);
					
					wrapper.bind('click.messagebar', {plugin: $this}, handleMessageBarClick);
					
					$this.prepend(wrapper);
					wrapper.append(content);
					
					$this.data('messagebar', {
						messages: [],
						opts: opts
					});
				}
			});
		},
		
		show: function() {
			// summary: 
			// 			show the message bar
			return this.each(function() {
				var data = $(this).data('messagebar'),
				bar = $('.messagebar', this),
				content = $('#' + data.opts.content_id, this);
				
				if (data.messages.length > 0) {
					var message = data.messages[0],
					msg_type_config  = data.opts.message_types[message.type()],
					barClass = msg_type_config.barClass,
					contentClass = msg_type_config.contentClass;
					
					content.addClass(contentClass).text(message.content());
					bar.addClass(barClass);
				}
				
				bar.show();
			});
		},
		
		hide: function() {
			// summary: 
			// 			hide the message bar
			return this.each(function() {
				$(".messagebar", this).hide();
			});
		},
		
		addMessage: function(message, type) {
			// summary: 
			// 			add a message to the message bar
			// message: {String}
			//			the message to add
			// type: {String}
			//			the type of message (should be based on the 'message_types' defined during configuration)
			return this.each(function() {
				var $this = $(this),
				data = $this.data('messagebar');
				
				data.messages.unshift(createMessage(message, type));
			});
		}
	};
	
	var createMessage = function(message, messageType) {
		return (function() {
			var msg = message,
			type = messageType;
			
			return {
				content: function() {
					return msg;
				},
				
				type: function() {
					return type;
				}
			};
		})();
	};
	
	var handleMessageBarClick = function(event) {
		console.log("data:");
		var plugin = event.data.plugin;
		console.dir(plugin.data('messagebar'));
	};
	
	var createWrapper = function(settings) {
		var classes = ['messagebar', 'messagebar-' + settings.position, settings.content_class];
		if (settings.shadow && settings.position == 'top') {
			classes.push('messagebar-shadow');
		}
	
		return $('<div />').addClass(classes.join(' ')).css({"background-color": settings.background_color});
	};
	
	var createContent = function(settings) {
		return $("<span />").attr('id', settings.content_id).addClass(settings.content_class);
	};

    $.fn.messagebar = function(method) {

		// Method calling logic
		if ( api[method] ) {
			return api[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return api.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.messagebar' );
		} 	

    };
})(jQuery);