var express = require('express');
var app = express();
var fs = require("fs");
var url = require('url');
var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();
var body = [];
var pouchdb = require('pouchdb');
var http = require('http');
app.get('/listMeeting', function (req, res) {
   fs.readFile( __dirname + "/" + "meeting.json", 'utf8', function (err, data) {
       console.log( data );
       res.end(data);
   });
});
app.get('/list', function(req, res){
  if (process.env.VCAP_SERVICES) {
		  // Running on Bluemix. Parse out the port and host that we've been assigned.
		  var env = JSON.parse(process.env.VCAP_SERVICES);
		  var host = process.env.VCAP_APP_HOST;
		  var port = process.env.VCAP_APP_PORT;
		  console.log('VCAP_SERVICES: %s', process.env.VCAP_SERVICES);

		  // Also parse out Cloudant settings.
		  cloudant = env['cloudantNoSQLDB'][0]['credentials'];
	}
  var db = new pouchdb('meeting'),
   remote =cloudant.url + '/meeting';
  opts = {
    continuous: true
    };
  console.log(remote);
  db.replicate.to(remote, opts);
  db.replicate.from(remote, opts);

  var docs = db.allDocs(function(err, result){
    console.log("result" + result);
    res.write(result.toString());
  });
  db.get('meetingRoom', function(err, response){
    console.log("response" + response);
    // var details = JSON.stringify(doc.data);
    // res.write(details);
    // res.end();
    // console.log(details);
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
app.get('/addDb', function(req, res){
  if (process.env.VCAP_SERVICES) {
    if (process.env.VCAP_SERVICES) {
  		  // Running on Bluemix. Parse the port and host that we've been assigned.
  		  var env = JSON.parse(process.env.VCAP_SERVICES);
  		  var host = process.env.VCAP_APP_HOST;
  		  var port = process.env.VCAP_APP_PORT;

  		  console.log('VCAP_SERVICES: %s', process.env.VCAP_SERVICES);
  		  // Also parse Cloudant settings.
  		  cloudant = env['cloudantNoSQLDB'][0]['credentials'];
  	}

  	var db = new pouchdb('meeting'),
  	 remote =cloudant.url + '/meeting';
  	opts = {
  	  continuous: true
  	  };
       // Replicate the DB to remote
  	console.log(remote);
  	db.replicate.to(remote, opts);
  	db.replicate.from(remote, opts);

  	// Put 3 documents into the DB
    db.put({
      data:
      {
      "2357" : {
        "address" : "SO4 1F",
        "roomName" : "SO4 1 Floor 106",
        "meetings" : [
          {
            "meetingTitle" : "Meeting with *IIP* Client.",
            "startTime" : "09:00",
            "endTime" : "10:00",
            "bookBy" : "Vincent",
            "meetingDes" : "",
            "meetingID" : 1,
            "meetingEmail": "a@cn.ibm.com"
          },
          {
            "meetingTitle" : "Meeting with *CIO* Client.",
            "startTime" : "14:00",
            "endTime" : "15:00",
            "bookBy" : "Gary",
            "meetingDes" : "",
            "meetingID" : 2,
            "meetingEmail": "a@cn.ibm.com"
          },
          {
            "meetingTitle" : "Meeting with *CTO* Client.",
            "startTime" : "16:00",
            "endTime" : "16:30",
            "bookBy" : "Mohamed",
            "meetingDes" : "",
            "meetingID" : 3,
            "meetingEmail": "a@cn.ibm.com"
          }
        ],
        "type" : 1,
        "description" : "Available now",
        "meetingroomID" : "12345"
        },
      "2359" : {
        "address" : "SO3 3F",
        "roomName" : "SO3 3 Floor 302",
        "meetings" : [
          {
            "meetingTitle" : "Meeting with *WeChat* Client.",
            "startTime" : "09:00",
            "endTime" : "10:00",
            "bookBy" : "Ivy",
            "meetingDes" : "",
            "meetingID" : 1,
            "meetingEmail": "a@cn.ibm.com"
          },
          {
            "meetingTitle" : "Meeting with *Tecent* Client.",
            "startTime" : "14:00",
            "endTime" : "15:00",
            "bookBy" : "Frank",
            "meetingDes" : "",
            "meetingID" : 2,
            "meetingEmail": "a@cn.ibm.com"
          },
          {
            "meetingTitle" : "Meeting with *Baidu* Client.",
            "startTime" : "16:00",
            "endTime" : "16:30",
            "bookBy" : "Summer",
            "meetingDes" : "",
            "meetingID" : 3,
            "meetingEmail": "a@cn.ibm.com"
          }
        ],
        "type" : 1,
        "description" : "available at 3pm",
        "meetingroomID" : "12346"
        }
      }
    },'meetingRoom',function(err, response){
      console.log(err || response);
    });
  	 res.writeHead(200, {'Content-Type': 'text/plain'});
  	 res.write("3 documents is inserted");
  	 res.end();
   }
});
// var Cloudant = require('cloudant');
// var cloudant_url = "https://ad285c78-4c43-4991-b450-f83d44d41915-bluemix:1a89de1499720eeb90c6d8edf0538f9b48e292d651618c4faaa5ab3df466d800@ad285c78-4c43-4991-b450-f83d44d41915-bluemix.cloudant.com";
// var cloudant = Cloudant({url: cloudant_url});
// var dbname = 'meeting';
// var db;
// app.get('/addDb', function(req, res){
//   cloudant.db.create(dbname, function(err, data) {
//   if(err){
//     console.log("error!");
//   }
//   else{
//     console.log("Created database.");
//   }
//   db = cloudant.db.use(dbname);
//   db.insert(
//  {
//       _id: "_design/meeting",
//       views: {
//             "meeting":
//              {
//                 "map": "function (doc) {\n  emit(doc._id, [doc._rev, doc.new_name]);\n}"
//              }
//                }
//    },
//  function(err, data) {
//       if(err)
//           console.log("View already exsits. Error: ", err); //NOTE: A View can be created through the GUI interface as well
//       else
//         res.end('Success!');
//  });
// });
// });
app.post('/test', function(req, res){
  req.on('data', function(chunk){
    var jsondata = JSON.parse(chunk);
    res.end(jsondata.test);
  });
});
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
