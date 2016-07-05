var express = require('express');
var app = express();
var fs = require("fs");
var url = require('url');
var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();
app.get('/listMeeting', function (req, res) {
   fs.readFile( __dirname + "/" + "meeting.json", 'utf8', function (err, data) {
       console.log( data );
       res.end(data);
   });
});
app.get('/addMeeting', function (req, res) {
  var options = {encoding:'utf8',flag:'w'};
  fs.readFile( __dirname + "/" + "meeting.json", 'utf8', function (err, data) {
       data = JSON.parse(data);
       var urlObj = url.parse(req.url, true, false);
       var bID = urlObj.query.bID;
       var flag = data[bID];
       if(!(flag === undefined || flag === null)){
         var meetingTitle = urlObj.query.meetingTitle;
         var startTime = urlObj.query.startTime;
         var endTime = urlObj.query.endTime;
         var bookBy = urlObj.query.bookBy;
         var meetingDes = urlObj.query.meetingDes;
         var meetingID = urlObj.query.meetingID;
         var meetingEmail = urlObj.query.meetingEmail;
         var meeting = {
           "meetingTitle":meetingTitle,
           "startTime": startTime,
           "endTime": endTime,
           "bookBy": bookBy,
           "meetingDes": meetingDes,
           "meetingID": meetingID,
           "meetingEmail": meetingEmail
         };
         console.log(bID);
         var meetingDetail = data[bID].meetings;
         meetingDetail[meetingDetail.length] = meeting;
         console.log(meeting);
         fs.writeFile(__dirname + "/" + "meeting.json",JSON.stringify(data),options, function(err){
           if(err){
             console.log("Failed!");
           }
           else{
             console.log("Success!");
           }
         });
     }
     else{
       //list meeting
     }

      //  var jsonDetail = JSON.parse(meetingDetail);
      //  meetingDetail = JSON.parse(meetingDetail);
      res.end(JSON.stringify(data));

   });
});
// var pouchdb = require('pouchdb');
// var http = require('http');
// app.get('/addDb', function(req, res){
//   if (process.env.VCAP_SERVICES) {
//     if (process.env.VCAP_SERVICES) {
//   		  // Running on Bluemix. Parse the port and host that we've been assigned.
//   		  var env = JSON.parse(process.env.VCAP_SERVICES);
//   		  var host = process.env.VCAP_APP_HOST;
//   		  var port = process.env.VCAP_APP_PORT;
//
//   		  console.log('VCAP_SERVICES: %s', process.env.VCAP_SERVICES);
//   		  // Also parse Cloudant settings.
//   		  cloudant = env['cloudantNoSQLDB'][0]['credentials'];
//   	}
//
//   	var db = new pouchdb('books'),
//   	 remote =cloudant.url + '/books';
//   	opts = {
//   	  continuous: true
//   	  };
//        // Replicate the DB to remote
//   	console.log(remote);
//   	db.replicate.to(remote, opts);
//   	db.replicate.from(remote, opts);
//
//   	// Put 3 documents into the DB
//   	db.put({
//   		  author: 'John Grisham',
//   		  Title : 'The Firm'
//   		}, 'book1', function (err, response) {
//   		  console.log(err || response);
//   		});
//   	 db.put({
//   		  author: 'Authur C Clarke',
//   		  Title : '2001: A Space Odyssey'
//   		}, 'book2', function (err, response) {
//   		  console.log(err || response);
//   		});
//   	 db.put({
//   		  author: 'Dan Brown',
//   		  Title : 'Digital Fortress'
//   		}, 'book3', function (err, response) {
//   		  console.log(err || response);
//   		});
//   	 res.writeHead(200, {'Content-Type': 'text/plain'});
//   	 res.write("3 documents is inserted");
//   	 res.end();
//    }
// });
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
