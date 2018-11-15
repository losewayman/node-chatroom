var express = require('express');
var router = express.Router();
var socket_io = require('socket.io');
var query = require("../mysql.js");

function savemessage(data){
    query("insert into news(useraccount,groupid,time,text,img) values (?,?,?,?,?)",[data.useraccount,data.groupid,data.time,data.text,data.img],function(err,rows){
        if(err){
            console.log(err);
        }
    })
}

router.socket = function(server) {
    var io = socket_io(server);
    io.on('connection', function(socket) {  
        socket.on('sendmes',function(data){  //页面初始化加入房间
            socket.broadcast.to(data.groupid).emit('othersendmes', data);
            savemessage(data);
        });
        socket.on('join',function(data){
            socket.join(data.id);
        })
        socket.on('leave',function(data){
            socket.leave(data.nowgroupid);
        })
    })
}

module.exports = router;