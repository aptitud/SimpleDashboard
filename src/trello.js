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
            var endDate = e.substring(n + 1).trim();

            result[name] = {endDate: endDate};
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
                                var status = "UNKNOWN";

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

                                    consultants.push(consultantName);

                                    projectSpecs.push({
                                        name: consultantName,
                                        status: "Aktiv",
                                        projects: [{
                                            company: customerName,
                                            startDate: null,
                                            endDate: (projectDescriptions[consultantName] ? projectDescriptions[consultantName].endDate : null)
                                        }]
                                    });
                                });
                            });

                            break;
                    }
                }

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