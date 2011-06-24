describe("MessageBar", function() {

    beforeEach(function() {
		loadFixtures('emptydiv.html');
		jqEl = $('#foo').messagebar({
			content_id: 'content'
		});
	});
	
	describe("visibility", function() {
		it("is not showing", function() {
			expect($('#foo').messagebar('isShowing')).toBeFalsy();
		});
		
		it("is showing", function() {
			$('#foo').messagebar('show');
			expect($('#foo').messagebar('isShowing')).toBeTruthy();
		});
		
		it("is hidden", function() {
			$('#foo').messagebar('show').messagebar('hide');
			expect($('#foo').messagebar('isShowing')).toBeFalsy();
		});

	});
	
	describe("messages", function() {
		it("has zero messages", function() {
			var data = jqEl.data('messagebar');
			expect(data.messages.length).toBe(0);
		});
		
		it("has one message", function() {
			$(jqEl).messagebar('addMessage', 'hello', 'info');
		
			var data = jqEl.data('messagebar');
			expect(data.messages).toBeDefined();
			expect(data.messages.length).toBe(1);
			expect(data.messages[0].content()).toEqual('hello');
			expect(data.messages[0].type()).toEqual('info');
		});
		
		it("has zero messages after clearing", function() {
			$(jqEl).messagebar('addMessage', 'hello', 'info')
			
			// sanity check
			var data = jqEl.data('messagebar');
			expect(data.messages).toBeDefined();
			expect(data.messages.length).toBe(1);
			
			$(jqEl).messagebar('clearMessages');
			
			// verify
			expect(data.messages.length).toBe(0);
		});
		
		it("displays 'hello world' after adding a message and invoking `show`", function() {
			// add the message
			$(jqEl).messagebar('addMessage', 'hello world', 'info');
			
			// verify content element is still empty
			var contentEl = $('span', jqEl).first();
			expect(contentEl.text()).toBe("");
			
			// show the message bar
			$(jqEl).messagebar('show');
			
			// verify content element contains 'hello world'
			expect(contentEl.text()).toBe("hello world");
		});
	});
	
	describe("navigation controls", function() {
		it("displays oldest message by invoking `showNext`", function() {
			// add the messages
			$(jqEl).messagebar('addMessage', 'hello world', 'info')
				   .messagebar('addMessage', 'hello world 2', 'info')
				   .messagebar('addMessage', 'hello world 3', 'info');
				   
			// show the message bar
			$(jqEl).messagebar('show');
			
			// verify content element contains the last message added (e.g. the most recent message)
			var contentEl = $('span', jqEl).first();
			expect(contentEl.text()).toBe("hello world 3");
			
			// move next two times
			$(jqEl).messagebar('showNext').messagebar('showNext');
			
			// verify content elment contains the first message that was added
			expect(contentEl.text()).toBe("hello world");
		});
		
		it("displays middle message", function() {
			// add the messages
			$(jqEl).messagebar('addMessage', 'hello world', 'info')
				   .messagebar('addMessage', 'hello world 2', 'info')
				   .messagebar('addMessage', 'hello world 3', 'info');
				   
			// show the message bar
			$(jqEl).messagebar('show');
			
			// verify content element contains the last message added (e.g. the most recent message)
			var contentEl = $('span', jqEl).first();
			expect(contentEl.text()).toBe("hello world 3");
			
			// move to the oldest message, then back 1 to get to the middle
			$(jqEl).messagebar('showNext').messagebar('showNext').messagebar('showPrevious');
			
			// verify content elment contains the middle message that was added
			expect(contentEl.text()).toBe("hello world 2");
		});
	});
});