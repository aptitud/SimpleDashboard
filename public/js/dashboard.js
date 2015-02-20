var aptitud = aptitud || {}

aptitud.dashboard = (function() {
	var pub = {},
		tplDashboard = Handlebars.compile($('#tpl-dashboard').html());

	pub.init = function() {
		updateDashboard();
	};

	var updateDashboard = function() {
		$.getJSON( "/consultants", function( data ) {
			data = arrangeProjects(data);
			$('#Dashboard').html(tplDashboard(data));
			setTimeout(updateDashboard, 60000);
		});
	}

	var arrangeProjects = function(data) {
		var newProjs, startMonth, endMonth, prevEnd;
		for(var i=0, ilen=data.length; i<ilen; i++) {
			newProjs = [];
			for(var j=0, jlen=data[i].projects.length; j<jlen; j++) {
				startMonth = data[i].projects[j].startDate ? (new Date(data[i].projects[j].startDate)).getMonth() : 0;
				endMonth = data[i].projects[j].endDate ? (new Date(data[i].projects[j].endDate)).getMonth() : 11;

				if ((new Date()).getYear() > (new Date(data[i].projects[j].startDate)).getYear()) startMonth = 0;
				if ((new Date()).getYear() < (new Date(data[i].projects[j].endDate)).getYear()) endMonth = 11;

				if(prevEnd && prevEnd < (startMonth+1)) {
					newProjs.push({company:'',startMonth:prevEnd+1,monthSpan:startMonth-prevEnd-1});
				}
				prevEnd = endMonth;

				// Add initial project if first project is not started in January
				if (!newProjs.length && startMonth>0) {
					newProjs.push({company:'',startMonth:0,monthSpan:startMonth});
				}
				data[i].projects[j].startMonth = startMonth;
				data[i].projects[j].monthSpan = endMonth-startMonth+1;
				newProjs.push(data[i].projects[j]);

				// Add ending project if last project is not ended in December
				if (j+1==jlen && endMonth<11) {
					newProjs.push({company:'',startMonth:endMonth+1,monthSpan:11-endMonth});
				}
			}
			data[i].projects = newProjs;
		}
		return data;
	};

	return pub;
})();

$(document).ready(aptitud.dashboard.init);