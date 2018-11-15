var express = require('express');
var router = express.Router();
var query = require("../mysql.js");

//注册接口函数
function signinsert(req,res){
    query("insert into user (account,username,password) values (?,?,?)",[req.body.account,req.body.username,req.body.password], function (err, rows, fields) {
        if(err){
            var obj = {
                'status': 0,
                'msg': "注册失败",
                'err': err
            }
            res.send(obj);
        }else{
            var obj = {
                'status': 200,
                'msg': "注册成功"
            }
            res.send(obj);
        }
        
    })
}

//登录接口函数

function loginselect(req,res,rows){

    query("select b.* from relation a left join groups b on a.groupid = b.id where a.useraccount = ?",[rows.account],function(err,result,fields){
        if(err){
            var obj = {
                'status': 0,
                'msg': "登录失败",
                'err': err,
                'islogin':false
            }
            res.send(obj);
        }else{
            var obj = {
                'user':rows,
                'group':result,
                'status':200,
                'islogin':true
            }
            req.session.useraccount = rows.account;
            res.send(obj);
        }
    })
}









router.post('/sign',function(req,res,next){
    query("select * from user where account = ? or username = ?",[req.body.account,req.body.username], function (err, rows, fields) {
        if(err){
              var obj = {
                  'status': 0,
                  'msg': "注册失败",
                  'err': err
              }
              res.send(obj);
        }else if(rows.length>0){
            var obj = {
                'status': 100,
                'msg': "账号或昵称已存在",
            }
            res.send(obj);
        }else{
            signinsert(req,res);
        }
      })
})


router.post('/login',function(req,res,next){
  query("select account,username,headimg,autograph from user where account = ? and password = ?",[req.body.account,req.body.password], function (err, rows, fields) {
    if(err){
          var obj = {
              'status': 0,
              'msg': "登录失败",
              'err': err
          }
          res.send(obj);
    }else if(rows.length>0){
        loginselect(req,res,rows[0]);
    }else{
      var obj = {
        'status': 0,
        'msg': "此账号不存在",
      }
      res.send(obj);
    }
  })
})

router.post('/islogin',function(req,res,next){
  if(req.session.useraccount =='' || req.session.useraccount==null){
      var obj={
          'status':100,
          'islogin':false,
          'msg':'用户未登录'
      }
      res.send(obj);
  }else{
    query("select account,username,headimg,autograph from user where account = ?",[req.session.useraccount],function(err,rows,fields){
        if(err){
            var obj={
                'status':100,
                'islogin':false,
                'msg':'用户未登录'
            }
            res.send(obj);
        }else{
            loginselect(req,res,rows[0]);
        }
    })

     
  }
})

function updatepass(req,res){
    query("update user set password = ? where account = ? and password = ?",[req.body.newpass,req.body.account,req.body.oldpass],function(err,rows){
        if(err){
            var obj = {
                'status': 0,
                'msg': "更改失败",
            }
            res.send(obj);
        }else{
            var obj = {
                'status': 200,
                'msg': "更改成功",
            }
            res.send(obj);
        }
    })
}

router.post('/updatepass',function(req,res,next){
    query("select * from user where account = ? and password = ?",[req.body.account,req.body.oldpass],function(err,rows){
        if(err){
            var obj = {
                'status': 0,
                'msg': "更改失败",
            }
            res.send(obj);
        }else{
            if(rows.length!=1){
                var obj = {
                    'status': 100,
                    'msg': "原密码错误",
                }
                res.send(obj);
            }else{
                updatepass(req,res);
            }
        }
        
    })
})

module.exports = router;
