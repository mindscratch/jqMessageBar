describe("MessageBar", function() {

    beforeEach(function() {
		loadFixtures('emptydiv.html');
		$('#foo').messagebar({
			content_id: 'content'
		});
	});

	it("is not showing", function() {
		expect($('#foo').messagebar('isShowing')).toBeFalsy();
	});
	
	it("is showing", function() {
		$('#foo').messagebar('show');
		expect($('#foo').messagebar('isShowing')).toBeTruthy();
	});

	it("has 'content' set as the ID for the content element", function() {
		var messagebar = $('#foo');
		expect($('span', messagebar)).toHaveAttr('id', 'content');
	});
});