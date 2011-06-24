(function($) {

    // default settings
	var settings = {
		background_color: '#003B62',
		position: 'top',
		content_class: 'messagebar-content-default',
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
			// options: Object
			//			Options used to configure the message bar
			//			background_color: String
			//					the background color of the message bar
			//			position: String
			//					the position of the message bar, either "top" or "bottom"
			//			content_class: String
			//					the CSS class to apply to the content of the message bar
			//			content_id: String
			//					the DOM id of the element that will contain the message bar content
			//			shadow: Boolean
			//					true to add a drop shadow to the message bar (only applied if position is "top")
			//			message_types: Object
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
						opts: opts,
						showing: false
					});
				}
			});
		},
		
		isShowing: function() {
			// summary:
			//			is the message bar being shown or not
			// return: Boolean
			//			true if the message bar is being shown, false if it is not
			var data = this.data('messagebar');
			if (data && typeof(data.showing) === 'boolean') {
				return data.showing;
			}
			return false;
		},
		
		show: function() {
			// summary: 
			// 			show the message bar
			return this.each(function() {
				var data = $(this).data('messagebar');
				var bar = $('.messagebar', this),
				content = $('#' + data.opts.content_id, this),
				upArrow = $('.messagebar-navigation div', this).first(),
				downArrow = $('.messagebar-navigation div', this).last(),
				msgCount = data.messages.length;
				
				// always showing the most recent message so hide the 'up' arrow to start with
				hideArrow(upArrow);
				
				// show the most recent message
				if (msgCount > 0) {
					// show the 'down' arrow when there are messages
					(msgCount > 1 ? showArrow(downArrow) : hideArrow(downArrow));
					
					displayMessage(data.messages[data.index], data.opts, this, bar, content);
				}
				else {
					// hide the down arrow if there are no messages
					hideArrow(downArrow);
				
					// reset the styles on the bar and content elements
					restoreBarStyle(this, data.opts);
					restoreContentStyle(this, data.opts);	
					content.text('');
				}
				
				if (!data.showing) {
					bar.fadeIn('fast');
					data.showing = true;
				}
			});
		},
		
		hide: function(clearMessages) {
			// summary: 
			// 			hide the message bar, optionally clear the messages
			// clearMessages: Boolean
			//			true to clear the messages, false otherwise
			return this.each(function() {
				var $this = $(this),
				data = $this.data('messagebar');
				
				// clear the messages
				if (clearMessages === true) {
					$this.messagebar('clearMessages');
				}
				
				if (data.showing) {
					$(".messagebar", this).fadeOut('fast');
					data.showing = false;
				}
			});
		},
		
		addMessage: function(message, type) {
			// summary: 
			// 			add a message to the message bar
			// message: String
			//			the message to add
			// type: String
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
			// summary:
			//			clear the messages
			return this.each(function() {
				$(this).data('messagebar').messages.length = 0;
			});
		},
		
		showNext: function() {
			// summary:
			//			show the next message, if available
			return this.each(function() {
				var $this = $(this),
				data = $this.data('messagebar'),
				messages = data.messages,
				msgCount = messages.length,
				index = data.index,
				bar = $('.messagebar', this),
				content = $('#' + data.opts.content_id, this),
				upArrow = $('.messagebar-navigation div', this).first(),
				downArrow = $('.messagebar-navigation div', this).last();
				
				if (index < (msgCount - 1)) {
					// show up arrow
					showArrow(upArrow);
				
					// increment
					index += 1;
					
					// show the message
					displayMessage(messages[index], data.opts, this, bar, content);
					
					// update pointer
					data.index = index;
					
					// check to see if we're at the end
					if (index === (msgCount - 1)) {
						// hide the 'down'/'next' arrow
						hideArrow(downArrow);
					}
				}
			});
		},
		
		showPrevious: function() {
			// summary:
			//			show the previous message, if available
			return this.each(function() {
				var $this = $(this),
				data = $this.data('messagebar'),
				messages = data.messages,
				msgCount = messages.length,
				index = data.index,
				bar = $('.messagebar', this),
				content = $('#' + data.opts.content_id, this),
				upArrow = $('.messagebar-navigation div', this).first(),
				downArrow = $('.messagebar-navigation div', this).last();
				
				if (index > 0) {
					// show down arrow
					showArrow(downArrow);
				
					// decrement
					index -= 1;
					
					// show the message
					displayMessage(messages[index], data.opts, this, bar, content);
					
					// update pointer
					data.index = index;
					
					// check to see if we're at the beginning
					if (index === 0) {
						// hide the 'up'/'previous' arrow
						hideArrow(upArrow);
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
		return setContentDefaultStyle($("<span />").attr('id', settings.content_id), settings);
	};
	
	var setContentDefaultStyle = function(contentEl, settings) {
		return contentEl.attr('class', 'messagebar-content ' + settings.content_class);
	};
	
	var restoreContentStyle = function(pluginEl, settings) {
		setContentDefaultStyle($('#' + settings.content_id, pluginEl), settings);
	};
	
	var createNavigation = function(settings) {
		var container = $('<div />');
		container.addClass("messagebar-navigation messagebar-navigation-" + settings.position);
		container.append('<div class="messagebar-arrow-up" />').append('<div class="messagebar-arrow-down" />');
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
	
	var displayMessage = function(message, settings, jqPluginEl, jqBarEl, jqContentEl) {
		// summary:
		//			perform all the work to display a message
		// message: Object
		//			the message to display
		// settings: Object
		//			the plugin options/settings
		// jqPluginEl: jQuery element
		//			the element that the message bar plugin is attached to
		// jqBarEl: jQuery element
		//			the message bar element
		// jqContentEl: jQuery element
		//			the element that contains the content
		
		// reset the styles on the bar and content elements
		restoreBarStyle(jqPluginEl, settings);
		restoreContentStyle(jqPluginEl, settings);
		
		// lookup the config (from message_types)
		if (settings.message_types[message.type()]) {
			var msg_type_config  = settings.message_types[message.type()],
			// get the css class references for the bar and content elements
			barClass = msg_type_config.barClass,
			contentClass = msg_type_config.contentClass;
			
			jqBarEl.addClass(barClass);
			jqContentEl.addClass(contentClass);
		}
		
		jqContentEl.text(message.content());
	};
	
	var _toggleArrow = function(arrow, up, hide) {
		// summary:
		//			hide or show an arrow
		// arrow: jQuery element
		// up: Boolean
		//			true if working with the up arrow, false if working with the down arrow
		// hide: Boolean
		//			true to hide the arrow, false to show it
		if (arrow) {
			var base = 'messagebar-arrow-' + (up ? 'up' : 'down');
			if (hide) {
				arrow.attr('class', base + ' ' + base + '-hidden');
			}
			else {
				arrow.attr('class', base);
			}
		}
	};
	
	var showArrow = function(arrow) {
		var isUpArrow = !!arrow.attr('class').match(/up/i);
		_toggleArrow(arrow, isUpArrow, false);
	};
	
	var hideArrow = function(arrow) {
		var isUpArrow = !!arrow.attr('class').match(/up/i);
		_toggleArrow(arrow, isUpArrow, true);
	};
	
	var handleMessageBarClick = function(event) {
		var plugin = event.data.plugin;
	
		// hide the message bar
		$(plugin).messagebar('hide', true);
	};
	
	var handleNavigationUpClick = function(event) {
		event.stopPropagation();		
		if ($(event.target).attr('class').match(/hidden/i)) {
			// if the arrow is 'hidden' then don't do anything
			return;
		}
		
		var plugin = event.data.plugin;
		$(plugin).messagebar('showPrevious');
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