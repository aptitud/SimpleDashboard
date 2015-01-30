var aptitud = aptitud || {}

aptitud.dashboard = (function() {
	var pub = {},
		tplDashboard = Handlebars.compile($('#tpl-dashboard').html());

	pub.init = function() {
		console.log("Init dashboard");

		$.getJSON( "/consultants", function( data ) {
			console.log(data);
			$('#Dashboard').append(tplDashboard(data));
		});

	};


	return pub;
})();

jQuery(document).ready(aptitud.dashboard.init);