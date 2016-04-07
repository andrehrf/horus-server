/**
 * Main File Application
 * @author André Ferreira <andrehrf@gmail.com>
 */

'use strict';

var fs = require("fs"),//File System
    argv = require('optimist').argv,//Usage to parte console params
    requireDirectory = require('require-directory'),//Usage to require all files in directory
    cluster = require("cluster"),//Usage Cluster of Node.js
    express = require("express"),//Starting Express  
    app = express(),//Creating Application
    http = require("http"),//Creating HTTP Server
    bodyParser = require("body-parser"),//Module for processing HTTP requests in Express
    compression = require("compression"),//Gzip compression module for Express
    async = require("async"),//Run serie rotines
    MongoServer = require("mongodb").MongoClient,//MongoDB Client
    mongodb = null;
        
//process.on('uncaughtException', function(err){ console.log(err); });//Ignore exceptions
var settings = JSON.parse(fs.readFileSync(__dirname + "/settings.json"));
var httpServer = http.createServer(app);

if(cluster.isMaster){//Create cluster
    for(var i = 0; i < settings.clusters; i++)
        cluster.fork();
    
    cluster.on('exit', function (worker) {
        console.log('Worker %d died :(', worker.id);
        cluster.fork();
    });
}
else{
    app.use(compression());
    app.use(bodyParser.urlencoded({extended: false, limit: '10mb'}));
    app.use(bodyParser.json());
    
    app.use(function(req, res, next){ //Cors      
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST");
        res.setHeader("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
        next();
    });
                
    async.series([
        function(cb){
            //Connecting MongoDB Service
            MongoServer.connect(settings.mongodb, function(err, db){
                mongodb = db;

                if(err) console.log("MongoDB: "+err);
                else cb();
            });
        }
    ], function(){
        requireDirectory(module, "scripts/", {
            visit: function(obj){ 
                new obj(__dirname, settings, app, mongodb);
            } 
        });
        
        var port = (typeof argv.port === "number") ? argv.port : settings.port;
        
        httpServer.listen(port, function(){
            console.log("http://localhost:"+port+" (cluster "+cluster.worker.id+")");
        });
    });
}