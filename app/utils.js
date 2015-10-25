var fs = require('fs');
var http = require('http');
var mongojs = require('mongojs');

var makeTransactionReference = function() {
    var number = 0;
    for (var i = 0; i < 19; i++) {
        number += (1 + Math.floor(Math.random() * 9)) * Math.pow(10, i);
    }
    return number;
}

var moveMoneyBetweenCards = function(frm_profile, to_profile, amount) {
    var deferred = q.defer();
    var doc = fs.readFileSync('./app/request_body.xml').toString();

    var replacements = {
        '%TRANSACTIONREFERENCE%': makeTransactionReference(),
        '%SENDERNAME%': frm_profile.username,
        '%SENDERACCOUNTNUMBER%': frm_profile.card.toString(),
        '%RECEIVERNAME%': to_profile.username,
        '%RECEIVERACCOUNTNUMBER%': to_profile.card.toString(),
        '%AMOUNT%': amount + (Math.floor(Math.random() * 50) * 10)
    };

    var formatted_doc = doc.replace(/%\w+%/g, function(all) {
       return replacements[all] || all;
    });

    var options = {
        host: 'dmartin.org',
        path: '/moneysend/v2/transfer?format=XML',
        port: '8024',
        headers: {'Content-Type': 'application/xml'},
        method: 'POST'
    };
    
    console.log("OK");
    var req = http.request(options, function(response) {
        var res = "";
        response.on('data', function(chunk) {
            res += chunk;
        });
        response.on('end', function(chunk) {
            var reg = /RequestId>(\d+)<\//
            var requestIdMatch = res.match(reg)
            if (requestIdMatch) {
                var requestid = requestIdMatch[1];
            } else {
                var requestid = null;
            }
            deferred.resolve(requestid);
        });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });
    req.write(formatted_doc);
    req.end()
    return deferred.promise;
}

var mongojs = require('mongojs');
var db = mongojs('p2p', ['user']);
var q = require('q');

db.user.find({}, function(err, items) {
    var sender = items[0];
    var receiver = items[1];
    var amount = 2882;
    moveMoneyBetweenCards(sender, receiver, amount).then(function(res) {
        console.log(res);
    });
});

