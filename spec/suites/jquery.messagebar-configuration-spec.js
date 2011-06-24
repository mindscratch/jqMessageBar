describe("MessageBar configuration", function() {

    beforeEach(function() {
		loadFixtures('emptydiv.html');
		jqEl = $('#foo').messagebar({
			content_id: 'content'
		});
	});

	it("has 'content' set as the ID for the content element", function() {
		var messagebar = $('#foo');
		expect($('span', messagebar)).toHaveAttr('id', 'content');
	});
});