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
	
	/*
	* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	*
	* Public API
	*
	* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	*/
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
				console.log("messagebar#init -- invoked");
				
				var opts = $.extend({}, settings, options);
			
				var $this = $(this),
				data = $this.data('messagebar');
				
				if (!data) {
					// create the elements
					var bar = createBar(opts),
					content = createContent(opts),
					navigation = createNavigation(opts),
					upArrow = $('div', navigation).first(),
					downArrow = $('div', navigation).last();
					
					// add listeners
					bar.bind('click.messagebar', {plugin: $this}, handleMessageBarClick);
					upArrow.bind('click.messagebar', {plugin: $this}, handleNavigationUpClick);
					downArrow.bind('click.messagebar', {plugin: $this}, handleNavigationDownClick);
					
					// add to DOM
					$this.prepend(bar);
					bar.append(navigation).append(content);
					
					// initialize data
					$this.data('messagebar', {
						messages: [],
						index: 0,
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
				content = $('#' + data.opts.content_id, this),
				upArrow = $('.messagebar-navigation div', $(this)).first(),
				downArrow = $('.messagebar-navigation div', $(this)).last(),
				msgCount = data.messages.length;
				
				// reset the styles on the bar and content elements
				restoreBarStyle($(this), data.opts);
				restoreContentStyle($(this), data.opts);
				
				// always showing the most recent message so hide the 'up' arrow to start with
				upArrow.addClass('arrow-up-hidden');
				
				// show the most recent message
				if (msgCount > 0) {
					// show the 'down' arrow when there are messages
					if (msgCount > 1) {
						downArrow.removeClass('arrow-down-hidden');
					}
					else {
						downArrow.addClass('arrow-down-hidden');
					}
					
					// get the message
					var message = data.messages[data.index],
					// lookup the config (from message_types)
					msg_type_config  = data.opts.message_types[message.type()],
					// get the css class references for the bar and content elements
					barClass = msg_type_config.barClass,
					contentClass = msg_type_config.contentClass;
					
					content.addClass(contentClass).text(message.content());
					bar.addClass(barClass);
				}
				else {
					// hide the down arrow if there are no messages
					downArrow.addClass('arrow-down-hidden');
					content.text('');
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
				
				// the first message in the array is always the newest
				data.messages.unshift(createMessage(message, type));
				
				// change the index b/c we always want to view the most recent message
				data.index = 0;
			});
		},
		
		clearMessages: function() {
			return this.each(function() {
				$(this).data('messagebar').messages.length = 0;
			});
		},
		
		showNext: function() {
			return this.each(function() {
				var $this = $(this),
				data = $this.data('messagebar'),
				messages = data.messages,
				msgCount = messages.length,
				index = data.index;
				
				if (index < (msgCount - 1)) {
					// increment
					index += 1;
					var message = messages[index];
					//TODO show the next message -- a lot of this needs to be cleaned up, just copy/paste to quickly try before stopping today
					// lookup the config (from message_types)
					var msg_type_config  = data.opts.message_types[message.type()],
					// get the css class references for the bar and content elements
					barClass = msg_type_config.barClass,
					contentClass = msg_type_config.contentClass;
					
					var bar = $('.messagebar', this),
					content = $('#' + data.opts.content_id, this);
					
					// reset the styles on the bar and content elements
					restoreBarStyle($(this), data.opts);
					restoreContentStyle($(this), data.opts);
					
					content.addClass(contentClass).text(message.content());
					bar.addClass(barClass);
					
					data.index = index;
					
					// check to see if we're at the end
					if (index == (msgCount - 1)) {
						//TODO hide the 'down'/'next' arrow
					}
				}
			});
		}
	};
	
	/*
	* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	*
	* Internal Methods
	*
	* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	*/	
	var createBar = function(settings) {
		var classes = ['messagebar', 'messagebar-' + settings.position, settings.content_class];
		if (settings.shadow && settings.position == 'top') {
			classes.push('messagebar-shadow');
		}
	
		return setBarDefaultStyle($('<div />'), settings);
	};
	
	var setBarDefaultStyle = function(barEl, settings) {
		var classes = ['messagebar', 'messagebar-' + settings.position, settings.content_class];
		if (settings.shadow && settings.position == 'top') {
			classes.push('messagebar-shadow');
		}
	
		return barEl.attr('class', classes.join(' ')).css({"background-color": settings.background_color});
	};
	
	var restoreBarStyle = function(pluginEl, settings) {
		setBarDefaultStyle($('.messagebar', pluginEl), settings);
	};
	
	var createContent = function(settings) {
		return $("<span />").attr('id', settings.content_id).addClass(settings.content_class);
	};
	
	var restoreContentStyle = function(pluginEl, settings) {
		$('#' + settings.content_id, pluginEl).attr('class', settings.content_class);
	};
	
	var createNavigation = function(settings) {
		var container = $('<div />');
		container.addClass("messagebar-navigation messagebar-navigation-" + settings.position);
		container.append('<div class="arrow-up" />').append('<div class="arrow-down" />');
		return container;
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
		var plugin = event.data.plugin;
	
		// clear the messages
		$(plugin).messagebar('clearMessages');
		
		// hide the message bar
		$(plugin).messagebar('hide');
	};
	
	var handleNavigationUpClick = function(event) {
		event.stopPropagation();		
		if ($(event.target).attr('class').match(/hidden/i)) {
			// if the arrow is 'hidden' then don't do anything
			return;
		}
		
		var plugin = event.data.plugin;
	};
	
	var handleNavigationDownClick = function(event) {
		event.stopPropagation();
		if ($(event.target).attr('class').match(/hidden/i)) {
			// if the arrow is 'hidden' then don't do anything
			return;
		}
		var plugin = event.data.plugin;
		$(plugin).messagebar('showNext');
	};
	
	/*
	* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	*
	* Plugin Definition
	*
	* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	*/
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