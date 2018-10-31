var express = require('express')
var app = express();
var request= require('request-json');
const nodemailer = require ('nodemailer');
const xoauth2 =  require ('xoauth2') ;


var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require("body-parser");
var express = require('express');
var cors = require('cors');
var app = express();
// var url = 'mongodb://root:secure@ds161483.mlab.com:61483/asefall17';
var url = 'mongodb://appstest:appstest123@ds137003.mlab.com:37003/apps';
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var client = request.createClient('http://127.0.0.1:5000/');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/kg', function (req, res) {
    var searchKeyword = req.query.query;
    console.log("searchKeyword is XXXXX",searchKeyword);
    client.get("https://kgsearch.googleapis.com/v1/entities:search?query="+searchKeyword+"&key=AIzaSyCZbMz2VUDfsNIawl7W9W64FpZp8gsoh10&limit=1&indent=True", function (error, response, body) {
        res.send(body);
    });
});

app.post('/enroll', function (req, res) {
    MongoClient.connect(url, function(err, client) {
        if(err)
        {
            res.write("Failed, Error while cosnnecting to Database");
            res.end();
        }
        var db= client.db();
        insertDocument(db, req.body, function() {
            res.write("Successfully inserted");
            res.end();
        });
    });
});

app.post('/insdata', function (req, res) {
    MongoClient.connect(url, function(err, client) {
        if(err)
        {
            res.write("Failed, Error while cosnnecting to Database");
            res.end();
        }
        var db= client.db();
        insertSearchDocument(db, req.body, function() {
            res.write("Successfully inserted");
            res.end();
        });
    });
});

app.get('/getData', function (req, res) {
    var searchKeywords = req.query.keywords;
    console.log("Param are "+searchKeywords);
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while cosnnecting to Database");
            res.end();
        }
        if (err) throw err;
        var dbo = db.db("apps");
        var query = { username: searchKeywords };
        dbo.collection("aselab").find(query).toArray(function(err, result) {
            if (err) throw err;
            // console.log(result[0].major);
            db.close();
            res.json(result);
        });
    });
});

app.get('/getHistoryData', function (req, res) {
    var searchKeywords = req.query.keywords;
    console.log("Param are "+searchKeywords);
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while cosnnecting to Database");
            res.end();
        }
        if (err) throw err;
        var dbo = db.db("apps");
        var query = { username: searchKeywords };
        dbo.collection("aselabsearch").find(query).toArray(function(err, result) {
            if (err) throw err;
            // console.log(result[0].major);
            db.close();
            res.json(result);
        });
    });
});


app.get('/updateData', function (req, res) {
    var searchKeywords = req.query.keywords.substring(0,req.query.keywords.indexOf('@@@'));
    var searchKeywords1 = req.query.keywords.substring(req.query.keywords.indexOf('@@@')+3,req.query.keywords.length);
    console.log("Param are searchKeywords"+searchKeywords);
    console.log("Param are searchKeywords"+searchKeywords1);
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("apps");
        var query = { username: searchKeywords };
        var newvalues = { $set: {mobile: searchKeywords1} };
        dbo.collection("aselab").updateOne(query, newvalues, function(err, res) {
            if (err) throw err;
            // console.log(result[0].major);
            console.log("1 document updated");
            db.close();
        });
    });
});

app.get('/deleteData', function (req, res) {
    var searchKeywords = req.query.keywords;
    console.log("Param are searchKeywords"+searchKeywords);
    // console.log("Param are searchKeywords"+searchKeywords1);
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("apps");
        var query = { username: searchKeywords };
        dbo.collection("aselabsearch").deleteMany(query, function(err, obj) {
            if (err) throw err;
            // console.log(result[0].major);
            console.log(obj.result.n +"document updated");
            db.close();
        });
    });
});






var insertDocument = function(db, data, callback) {
    db.collection('aselab').insertOne( data, function(err, result) {
        if(err)
        {
            res.write("Registration Failed, Error While Registering");
            res.end();
        }
        console.log("Inserted a document into the asedemo collection.");
        callback();
    });
};

var insertSearchDocument = function(db, data, callback) {
    db.collection('aselabsearch').insertOne( data, function(err, result) {
        if(err)
        {
            res.write("Registration Failed, Error While Registering");
            res.end();
        }
        console.log("Inserted a document into the asedemo collection.");
        callback();
    });
};

var port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.render('index');
})

app.listen(port, function() {
	console.log('app running')
    console.log("Example app listening at http://:%s", port)
})

app.get('/getDataEmail', function (req, res) {
    var searchKeywords = req.query.searchkey;
    var searchKeywords1 = req.query.searchkey1;
    var searchKeywords2 = req.query.searchkey2;

    console.log("Param are "+searchKeywords);
    console.log("Param mes are "+searchKeywords1);
    console.log("Param mes are "+searchKeywords2);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 's.pallavidesai@gmail.com',
            clientId: '319573095737-2c98cnr7fhjnurbi5es3h907klpd0hpb.apps.googleusercontent.com',
            clientSecret: 'KZ1frHthVQ76hInQK9tjU3Gw',
            refreshToken: '1/ygt_aw7FxteuAfblxMSFrm0wPDRYZT-DNqnnfJLCLwM',
            accessToken: 'ya29.GltFBjWUTyAiDH7USeXj3duqUCq_Opy9N0l2onl-JTmj-Mi1_dN79sb5TVaPSiEjHASA80xoqtJd4DJ79o4JZqPsyW6HiVPmW_DIdVO9ISQlqVqMWPGkfbVR3dZf',
        },
    });
    var mailoption = {
        from : 'Pallavi <s.pallavidesai@gmail.com>',
        to : searchKeywords,
        subject : searchKeywords2,
        text : searchKeywords1
    }
    transporter.sendMail(mailoption, function (err , res) {
        if(err)
        {
            console.log('error' );
        }
        else
        {
            console.log('mail sent' );
        }
    })
});