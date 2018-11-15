var express = require('express');
var router = express.Router();
var query = require("../mysql.js");
const path = require("path");
const fs = require('fs');


// 创建一个群后把创建人与群加入关系表
function createjoin(useraccount,groupid){
    query("insert into relation (useraccount,groupid) values (?,?)",[useraccount,groupid],function(err,rows,fields){
        if(err){
            console.log(err);
        }
    })
}
//创建群后需要把新插入的一条群组信息查询并返回
function secreate(req,res){
    query("select * from groups where groupname = ?",[req.body.groupname],function(err,rows,fields){
        if(err){
            var obj={
                'status':0,
                'msg':'查询出错',
                'err':err
            }
            res.send(obj);
        }else{
            var obj = {
                'status':200,
                'data':rows
            }
            createjoin(rows[0].creater,rows[0].id);
            res.send(obj);
        }
    })
}
//将创建的群组插入群组表
function increate(req,res){
    query("insert into groups (groupname,creater) values (?,?)",[req.body.groupname,req.body.creater],function(err,rows,fields){
        if(err){
            var obj={
                'status':0,
                'msg':'查询出错',
                'err':err
            }
            res.send(obj);
        }else{
            secreate(req,res);
        }
    })
}









router.post('/groupmes',function(req,res,next){
    query("select a.useraccount,a.groupid,a.time,a.text,a.img , b.username,b.headimg from news a left join user b on a.useraccount = b.account where a.groupid = ? order by id limit 15",[req.body.groupid],function(err,rows,fields){
        if(err){
            var obj={
                'status':0,
                'msg':'查询出错',
                'err':err
            }
            res.send(obj);
        }else{
            var obj = {
                'status':200,
                'data':rows
            }
            res.send(obj);
        }
    })
})

router.post('/groupinf',function(req,res){
    query("select b.account,b.username,b.headimg from relation a left join user b on a.useraccount = b.account where a.groupid = ?",[req.body.groupid],function(err,rows){
        if(err){
            var obj={
                'status':0,
                'msg':'查询出错',
                'err':err
            }
            res.send(obj);
        }else{
            var obj = {
                'status':200,
                'data':rows
            }
            res.send(obj);
        }
    })
})


router.post('/searchmes',function(req,res,next){
    query("SELECT * FROM groups WHERE id NOT IN (SELECT groupid FROM relation WHERE useraccount= ? ) AND groupname LIKE concat('%',?,'%')",[req.body.account,req.body.searchvalue],function(err,rows,fields){   
        if(err){
            var obj={
                'status':0,
                'msg':'查询出错',
                'err':err
            }
            res.send(obj);
        }else{
            var obj = {
                'status':200,
                'data':rows
            }
            res.send(obj);
        }
    })
})

router.post('/join',function(req,res,next){
    query("insert into relation (useraccount,groupid) values (?,?)",[req.body.useraccount,req.body.groupid],function(err,rows,fields){
        if(err){
            var obj={
                'status':0,
                'msg':'查询出错',
                'err':err
            }
            res.send(obj);
        }else{
            var obj = {
                'status':200,
                'data':rows
            }
            res.send(obj);
        }
    })
})

//查询群名是否已存在，没有则插入
router.post('/create',function(req,res,next){
    query("select * from groups where groupname = ?",[req.body.groupname],function(err,rows){
        if(err){
            var obj={
                'status':0,
                'msg':'查询出错',
                'err':err
            }
            res.send(obj);
        }else if(rows.length>0){
            var obj={
                'status':100,
                'msg':'此群已存在',
            }
        }else{
            increate(req,res);
        }
        
    })
})

router.post('/groupout',function(req,res){
    query("delete from relation where useraccount = ? and groupid = ?",[req.body.account,req.body.groupid],function(err,rows){
        if(err){
            var obj={
                'status':0,
                'msg':'删除失败',
                'err':err
            }
            res.send(obj);
        }else{
            var obj={
                'status':200
            }
            res.send(obj);
        }
    })
})

router.post('/headup',function(req,res,next){
    var newname = req.files[0].path + path.parse(req.files[0].originalname).ext;
    var imgname = 'http://45.40.199.227:8110/' + newname;
    fs.rename(req.files[0].path, newname, function(err) {
        query("update user set headimg = ? where account = ?",[imgname,req.body.account],function(err,rows){
            if(err){
                var obj ={
                    'status':0,
                    'msg':'更新头像失败',
                    'err':err
                }
                res.send(obj);
            }else{
                res.send(imgname);
            }
        })
    })
})


router.post('/groupup',function(req,res,next){
    var newname = req.files[0].path + path.parse(req.files[0].originalname).ext;
    var imgname = 'http://45.40.199.227:8110/' + newname;
    fs.rename(req.files[0].path, newname, function(err) {
        query("update groups set groupimg = ? where id = ?",[imgname,req.body.nowgroupid],function(err,rows){
            if(err){
                var obj ={
                    'status':0,
                    'msg':'更新头像失败',
                    'err':err
                }
                res.send(obj);
            }else{
                res.send(imgname);
            }
        })
    })
})


module.exports = router;
