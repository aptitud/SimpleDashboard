var aptitud = aptitud || {}

aptitud.dashboard = (function() {
	var pub = {},
		tplDashboard = Handlebars.compile($('#tpl-dashboard').html());

	pub.init = function() {
		$.getJSON( "/consultants", function( data ) {
			console.log(data);
			$('#Dashboard').append(tplDashboard(data));
		});
	};

	return pub;
})();

$(document).ready(aptitud.dashboard.init);