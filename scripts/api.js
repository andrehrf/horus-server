/**
 * Api Interaction with Horus
 * @author André Ferreira <andrehrf@gmail.com>
 */

var fs = require("fs"),//File System
    _ = require("lodash"),//Utils framework
    http = require("http"),
    https = require("https"),
    path = require("path"),
    cp = require('child_process'),
    url = require("url")
    md5 = require("md5"),//Usage to generate MD5 
    crc32 = require("crc-32");//Usage to generate CRC32 to string
    
module.exports = function(dirname, settings, app, mongodb){  
    //Starting monitoring service
    var pathname = path.join(dirname, "eyes.js");
    var thread = cp.fork(pathname, null, {silent: false});
    
    thread.send({"cmd": "settings", database: {
        type: "mongodb",
        connstring: settings.mongodb
    }});

    thread.on('message', function(data){
        switch(data.type){
            case "error": console.log(data.msg); break;
        }
    });
    
    thread.on('close', function(){
        thread = cp.fork(pathname, null, {silent: false});
    });
    
    app.get("/", function(req, res){
       var link = req.query.link; 
       
        if(typeof link === "string"){
            var id = Math.abs(crc32.str(md5(link)));

            mongodb.collection("links").find({"_id": id}, {lastmodified: 1, lastwatch: 1, etag: 1}).limit(1).toArray(function(err, docs){
                if(err){ 
                    res.status(400).send(JSON.stringify({"status": "error", "msg": err, "code": 400}));
                }
                else{
                    if(docs.length > 0){
                        if("lastmodified" in docs[0]){
                            var lastModified = new Date(docs[0]["lastmodified"]);
                            res.setHeader("Last-Modified", lastModified.toGMTString());
                        }
                        else{
                            var lastModified = new Date();
                            res.setHeader("Last-Modified", lastModified.toGMTString());
                        }

                        res.send(JSON.stringify({"status": "ok", "lastmodified": docs[0]["lastmodified"], "lastwatch": docs[0]["lastwatch"], "etag": docs[0]["etag"]}));
                    }
                    else{
                        res.status(404).send(JSON.stringify({"status": "error", "msg": "Could not find the link in the database", "code": 404}));
                    }
                }
            }); 
        }
        else{
            res.status(400).send(JSON.stringify({"status": "error", "msg": "Invalid link", "code": 400}));
        }
    });
    
    app.post("/set", function(req, res){
        var now = new Date().getTime();
        bulk = mongodb.collection("links").initializeUnorderedBulkOp();
                
        //if(req.body.length > 0){
            for(var key in req.body){
                var id = Math.abs(crc32.str(md5(req.body[key])));
                bulk.find({_id: id}).upsert().update({$set: {link: req.body[key], datetime: now}});
                thread.send({"cmd": "set", "id": id, "link": req.body[key]});
            }

            if(bulk.s.currentIndex > 0){
                bulk.execute(function(err, result) { 
                    if(err) res.status(400).send(JSON.stringify({"status": "error", "msg": err, "code": 400}));
                    else res.send(JSON.stringify({"status": "ok", "code": 200}));
                });
            }
            else{
                res.status(400).send(JSON.stringify({"status": "error", "msg": "No records to insert", "code": 400}));
            }
        /*}
        else{
            res.status(400).send(JSON.stringify({"status": "error", "msg": "No records to insert", "code": 400}));
        }*/
    });
        
    app.delete("/delete/:id", function(req, res){
        var id = parseInt(req.params.id);
           
        if(id > 0){
            mongodb.collection("links").remove({"_id": id}, function(err){
                if(err) res.status(400).send(JSON.stringify({"status": "error", "msg": err, "code": 400}));
                else res.send(JSON.stringify({"status": "ok", "code": 200}));
                thread.send({"cmd": "delete", "id": id});
            });        
        }
        else{
            res.status(400).send(JSON.stringify({"status": "error", "msg": "Invalid ID", "code": 400}));
        }
    });
};