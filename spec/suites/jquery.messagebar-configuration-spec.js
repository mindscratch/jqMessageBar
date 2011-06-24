describe("MessageBar configuration", function() {

    beforeEach(function() {
		loadFixtures('emptydiv.html');
		jqEl = $('#foo').messagebar({
			content_id: 'content',
			position: 'bottom',
			message_types: {
				'foobar' : {barClass: 'apple', contentClass: 'banana'}
			}
		});
	});

	it("has 'content' set as the ID for the content element", function() {
		var messagebar = $('#foo');
		expect($('span', messagebar)).toHaveAttr('id', 'content');
	});
	
	it("is positioned at the bottom of the page", function() {
		var messagebar = $('#foo'),
			barClass = $('div', messagebar).attr('class');
			match = barClass.match(/bottom/i);
		expect(match).toContain('bottom');
	});
	
	it("styles the bar and content elements based on a particular type of message" , function() {
		// add a message whose type is 'foobar' and show the message bar
		$(jqEl).messagebar('addMessage', 'hello world', 'foobar').messagebar('show');
		
		// verify the message bar and content elements have the correct CSS classes applied
		expect($('.messagebar', jqEl).attr('class')).toContain('apple');
		expect($('.messagebar', jqEl).attr('class')).not.toContain('peach');
		
		expect($('span', jqEl).attr('class')).toContain('banana');
		expect($('span', jqEl).attr('class')).not.toContain('blueberry');
	});
	
	it("does not alter styles of the bar and content elements for a message with no type defined" , function() {
		// add a message whose type is not defined and show the message bar
		$(jqEl).messagebar('addMessage', 'hello world', 'baz').messagebar('show');
		
		// verify the message bar and content elements have the correct CSS classes applied
		expect($('.messagebar', jqEl).attr('class')).not.toContain('apple');
		expect($('span', jqEl).attr('class')).not.toContain('banana');
	});
});