var aptitud = aptitud || {}

aptitud.dashboard = (function() {
	var pub = {},
		tplDashboard = Handlebars.compile($('#tpl-dashboard').html());

	pub.init = function() {
		$.getJSON( "/consultants", function( data ) {
			data = arrangeProjects(data);
			$('#Dashboard').append(tplDashboard(data));
		});
	};

	arrangeProjects = function(data) {
		var newProjs, startMonth, endMonth;
		for(var i=0, ilen=data.length; i<ilen; i++) {
			newProjs = [];
			for(var j=0, jlen=data[i].projects.length; j<jlen; j++) {
				startMonth = data[i].projects[j].startDate ? (new Date(data[i].projects[j].startDate)).getMonth() : 0;
				endMonth = data[i].projects[j].endDate ? (new Date(data[i].projects[j].endDate)).getMonth() : 11;

				console.log(startMonth, endMonth);

				// Add initial project if first project is not started in January
				if (!newProjs.length && startMonth>0) {
					console.log('Add startproj');
					newProjs.push({company:'',startMonth:0,monthSpan:startMonth});
				}
				data[i].projects[j].startMonth = startMonth;
				data[i].projects[j].monthSpan = endMonth-startMonth+1;
				newProjs.push(data[i].projects[j]);

				// Add ending project if last project is not ended in December
				if (j+1==jlen && endMonth<11) {
					console.log('Add endproj');
					newProjs.push({company:'',startMonth:endMonth+1,monthSpan:11-endMonth});
				}

				console.log(data[i].projects[j]);
			}
			data[i].projects = newProjs;
		}
		return data;
	};

	return pub;
})();

$(document).ready(aptitud.dashboard.init);