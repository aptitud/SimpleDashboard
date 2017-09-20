var aptitud = aptitud || {}

aptitud.dashboard = (function() {
	var pub = {},
		tplDashboard = Handlebars.compile($('#tpl-dashboard').html()),
		tplDashboardCustomers = Handlebars.compile($('#tpl-dashboard-customers').html());

	pub.init = function() {
		updateDashboard();
		updateDashboardCustomers();
	};

	var updateDashboard = function() {
		$.getJSON( "/consultants", function( data ) {
			var dashboardData = {
				employees: arrangeProjects(data),
				monthNames: getMonthNames()
			};
			$('#Employees').html(tplDashboard(dashboardData));
			setTimeout(updateDashboard, 60000);
		});
	}

	var updateDashboardCustomers = function() {
		$.getJSON( "/customers", function( data ) {
			var dashboardData = {
				customers: data,
				monthNames: getMonthNames()
			};
			$('#Customers').html(tplDashboardCustomers(dashboardData));
			setTimeout(updateDashboardCustomer, 60000);
		});
	}

	var getMonthNames = function() {
		var monthNames = ['Jan','Feb','Mar','Apr','Maj','Jun','Jul','Aug','Sep','Okt','Nov','Dec'],
			months = [],
			index = (new Date()).getMonth();
		for (var i=0;i<12;i++) {
			months.push(monthNames[index]);
			index = index+1==12 ? 0 : index+1;
		}
		return months;
	};

	var arrangeProjects = function(data) {
		var newAssignmentPeriods,prevAssignment,prevAssigned,assignmentSpan;
		for(var i=0, ilen=data.length; i<ilen; i++) {
			newAssignmentPeriods = [];
			prevAssignment = data[i].monthViewAssignment[0].project ? data[i].monthViewAssignment[0].project.company : null;
			prevAssigned =  data[i].monthViewAssignment[0].hasAssignment;
			assignmentSpan = 0;
			for(var j=0, jlen=data[i].monthViewAssignment.length; j<jlen; j++) {
				if(data[i].monthViewAssignment[j].hasAssignment === prevAssigned && (!data[i].monthViewAssignment[j].project || data[i].monthViewAssignment[j].project.company === prevAssignment)) {
					assignmentSpan++;
					if (j===jlen-1) newAssignmentPeriods.push({assigned:data[i].monthViewAssignment[j].hasAssignment,span:assignmentSpan,project:data[i].monthViewAssignment[j].project});
				} else {
					newAssignmentPeriods.push({assigned:prevAssigned,span:assignmentSpan,project:data[i].monthViewAssignment[j===0?0:j-1].project});
					assignmentSpan = 1;
				}
				prevAssigned = data[i].monthViewAssignment[j].hasAssignment;
				prevAssignment = data[i].monthViewAssignment[j].project ? data[i].monthViewAssignment[j].project.company : null;
			}
			data[i].assignmentPeriods = newAssignmentPeriods;
		}
		return data;
	};

	return pub;
})();

$(document).ready(aptitud.dashboard.init);