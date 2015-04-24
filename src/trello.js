var https = require("https");

const CONFIG = {
    KEY: "f0bc8bfd0f2215a643266ab274148cff",
    TOKEN: "f14018afff82af6ac254e1876464524f1c140e8db188327db90af7eee8332af9",
    STATUS_BOARD: "IyKmEaxe"
};

module.exports.parseProjectDuration = function (text) {
    var elements = text.split("\n");
    var result = {};

    elements.forEach(function (e) {
        var n = e.indexOf('-');

        if (n != -1) {
            var name = e.substring(0, n).trim();
            var dateSpec = e.substring(n + 1).trim();
            var n = dateSpec.indexOf(" - ");

            var endDate = null;
            var startDate = null;

            if (n == -1) {
                endDate = dateSpec;
            } else {
                startDate = dateSpec.substring(0, n).trim();
                endDate = dateSpec.substring(n + 3).trim();
            }

            if (result[name]) {
                result[name].push({startDate: startDate, endDate: endDate});
            } else {
                result[name] = [{startDate: startDate, endDate: endDate}];
            }
        }
    })

    return result;
};

module.exports.retrieveConsultants = function (retrieveConsultansCallback) {
    var trello = module.exports.create(CONFIG.KEY, CONFIG.TOKEN);

    trello.openBoard(CONFIG.STATUS_BOARD).getLists(function (lists) {
        trello.getCardsByListId(lists, function (cardsByList) {
            var memberReferences = [];

            for (var i = 0; i < lists.length; i++) {
                var cards = cardsByList[lists[i].id];

                for (var j = 0; j < cards.length; j++) {
                    var card = cards[j];

                    card.idMembers.forEach(function (memberId) {
                        memberReferences.push(memberId);
                    })
                }
            }

            trello.getMembers(memberReferences, function (members) {
                var projectSpecs = [];

                for (var i = 0; i < lists.length; i++) {
                    var list = lists[i];
                    var cards = cardsByList[list.id];

                    switch (list.id) {
                        case "50372bbdec645cb1363eb7d5": /* På väg in */
                            break;
                        case "50372bbdec645cb1363eb7d4": /* Utan uppdrag */
                            cards.forEach(function (card) {
                                var name = card.name;
                                var n = name.indexOf('-');
                                var status;

                                if (n != -1) {
                                    status = name.substring(n + 1).trim();
                                    name = name.substring(0, n).trim();
                                }

                                projectSpecs.push({
                                    name: name,
                                    status: status,
                                    projects: []
                                });
                            });
                            break;
                        case "54b39b033116e865c9a4a3f1": /* Pågående uppdrag */

                            cards.forEach(function (card) {
                                var consultants = [];
                                var customerName = card.name;
                                var projectDescriptions = module.exports.parseProjectDuration(card.desc);

                                card.idMembers.forEach(function (memberId) {
                                    var consultantName = members[memberId].fullName;
                                    var projects = [];

                                    consultants.push(consultantName);

                                    var projectDescriptionForConsultant = projectDescriptions[consultantName];

                                    console.log('Loaded project descriptions for consultant ' + consultantName + ' at customer ' + customerName 
                                        + ': ' + JSON.stringify(projectDescriptionForConsultant));

                                    if (!projectDescriptionForConsultant || projectDescriptionForConsultant.length === 0) {
                                        projects.push({company: customerName, startDate: null, endDate: null});
                                    } else {
                                        projectDescriptionForConsultant.forEach(function(projectDescription) {
                                            projects.push({
                                                company: customerName,
                                                startDate: projectDescription.startDate,
                                                endDate: projectDescription.endDate
                                            });
                                        });
                                    }

                                    var existingProjectSpec = null;

                                    for (var i = 0; i < projectSpecs.length && existingProjectSpec == null; i++) {
                                        if (projectSpecs[i].name === consultantName) {
                                            existingProjectSpec = projectSpecs[i];
                                        }
                                    }

                                    function maxEndDate(projects) {
                                        var max;
                                        projects.forEach(function(p) {
                                            if (p.endDate) {
                                                if (!max) {
                                                    max = new Date(p.endDate);
                                                } else if (max.getTime() < new Date(p.endDate).getTime()) {
                                                    max = new Date(p.endDate);
                                                }
                                            }
                                        });
                                        return max;
                                    };

                                    if (existingProjectSpec == null) {
                                        projectSpecs.push({
                                            name: consultantName,
                                            status: "Aktiv",
                                            projects: projects
                                        });    
                                    } else {
                                        if (existingProjectSpec.projects == null) {
                                            existingProjectSpec.projects = projects;
                                        } else {
                                            projects.forEach(function(project) {
                                                existingProjectSpec.projects.push(project);
                                            });
                                        }
                                    }

                                });
                            });

                            break;
                    }
                }

                function maxEndDate(projects) {
                    var max;
                    projects.forEach(function(p) {
                        if (p.endDate) {
                            if (!max) {
                                max = new Date(p.endDate);
                            } else if (max.getTime() < new Date(p.endDate).getTime()) {
                                max = new Date(p.endDate);
                            }
                        }
                    });
                    return max;
                };
                function hasAssignment(c, date) {
                    if (!c.projects || c.projects.length == 0) {
                        return false;
                    }
                    var hasAssignment = false;
                    for(var i = 0; i < c.projects.length; i++) {
                        var p = c.projects[i];
                        var s = p.startDate && new Date(p.startDate);
                        var e = p.endDate && new Date(p.endDate);
                        if (s && e) {
                            hasAssignment = date.getTime() >= s.getTime() && date.getTime() <= e.getTime();
                        } else if (s) {
                            hasAssignment = date.getTime() >= s.getTime();
                        } else if (e) {
                            hasAssignment = date.getTime() <= e.getTime();
                        }
                        if (hasAssignment) {
                            break;
                        }
                    };
                    return hasAssignment;
                };
                projectSpecs.forEach(function(c) {
                    c.maxEndDate = maxEndDate(c.projects);
                    var date = new Date();
/*                    date.setMilliseconds(0);
                    date.setSeconds(0);
                    date.setMinutes(0);
                    date.setHours(0);
                    date.setDate(0);*/
                    var startMonth = date.getMonth();
                    c.monthViewStartDate = new Date();
                    c.monthViewEndDate = new Date();
                    c.monthViewEndDate.setMonth(c.monthViewEndDate.getMonth() + 11);
                    c.monthViewAssignment = [];
                    for(var i = 0; i < 12; i++) {
                        date.setMonth(i + startMonth);
                        c.monthViewAssignment.push(hasAssignment(c, date));
                    }
                    //console.log(c.name + " " + c.monthViewAssignment);
                });
                function byNoAssignmentFirstAndEndDate(c1, c2) {
                    if (c1.status == 'Aktiv' && c2.status == 'Aktiv') {
                        var m1 = c1.maxEndDate;
                        var m2 = c2.maxEndDate;
                        //console.log(c1.name +  ' ' + m1 + '; ' + c2.name + ' ' + m2);
                        if (m1 && m2) {
                            return m1.getTime() - m2.getTime();
                        }
                        if (m1) {
                            return -1;
                        }
                        return 1;
                    }
                    if (c1.status == 'Aktiv') {
                        if (c2.status == 'Tjänstledig') {
                            return -1;
                        }
                        return 1;
                    }
                    if (c1.status == 'Tjänstledig') {
                        return 1;
                    }
                    return -1;
                }
                projectSpecs.sort(byNoAssignmentFirstAndEndDate);
                retrieveConsultansCallback(projectSpecs);
            });
        });
    });
};

module.exports.create = function (key, token) {
    var urlOf = function (resource) {
        return "https://trello.com/1/" + resource + "?key=" + key + "&token=" + token;
    };

    return {
        openBoard: function (id) {
            return {
                getLists: function (callback) {
                    https.get(urlOf("boards/" + id + "/lists"), function (result) {
                        result.on("data", function (data) {
                            callback(JSON.parse(data.toString()));
                        });
                    })
                }
            };
        },

        getCards: function (listId, callback) {
            https.get(urlOf("lists/" + listId + "/cards"), function (result) {
                var json = "";

                result.on("data", function (data) {
                    json += data.toString();
                });

                result.on("end", function () {
                    callback(JSON.parse(json));
                });
            });
        },

        getCardsByListId: function (lists, callback) {
            var cardsByList = {};
            var responseCount = 0;
            var self = this;

            for (var i = 0; i < lists.length; i++) {
                (function (index) {
                    self.getCards(lists[i].id, function (card) {
                        cardsByList[lists[index].id] = card;

                        if (++responseCount == lists.length) {
                            callback(cardsByList);
                        }
                    });
                })(i);
            }
        },

        getCardDetails: function (cardId, callback) {
            https.get(urlOf("cards/" + cardId), function (result) {
                var json = "";

                result.on("data", function (data) {
                    json += data.toString();
                });

                result.on("end", function () {
                    callback(JSON.parse(json));
                });
            });
        },

        getMember: function (memberId, callback) {
            https.get(urlOf("members/" + memberId), function (result) {
                var json = "";

                result.on("data", function (data) {
                    json += data.toString();
                });

                result.on("end", function () {
                    callback(JSON.parse(json));
                });
            });
        },

        getMembers: function (memberIds, callback) {
            var result = {};
            var responseCount = 0;
            var self = this;

            for (var i = 0; i < memberIds.length; i++) {
                (function (index) {
                    self.getMember(memberIds[i], function (member) {
                        result[memberIds[index]] = member;

                        if (++responseCount == memberIds.length) {
                            callback(result);
                        }
                    })
                })(i);
            }
        }
    }
};