var express = require('express');
var router = express.Router();

var common = require('../libs/common');
var mysql = require('mysql');

var db = mysql.createPool({
	host:'localhost',
	user:'root',
	password:'123456',
	database:'students'
});

router.get('/',(req,res)=>{
	res.render('register');
	
});

router.get('/login',(req,res)=>{
	res.render('login',{});
});
//注册页面
router.post('/login',(req,res)=>{
	var username = req.body.username;
	var password = common.md5(req.body.password + common.md5_SUFFIX);
	console.log(username,password);
	db.query(`SELECT * FROM login_table WHERE username='${username}'`,(err,data)=>{
		if(err){
			res.status(500).send('数据有误').end();
		}else{
			if(data.length==0){
				//成功
				console.log('继续');
				db.query(`INSERT INTO login_table VALUES(0,'${username}','${password}');`,(err,data)=>{
					if(err){
						/*res.status(500).send('数据有误').end();*/
						console.log(err);
					}else{
						console.log('插入成功');
						//res.redirect('/register');    在这里重定向失效，会报错误status = 304 意思是get请求已经成功，但是文件错误
						// ajax 就是这样，不会进行重定向,但可以在前端的ajax进行重定向 window.location.href=' 地址 ';
					}
				});
				
			}else{
				if (data[0].password == password) {
					res.status(400).send('用户已存在');
				}else{
					res.status(203).send('账号相同,但是密码不一样');//这里发出的status会在前端的ajax的 error 中jqXHR.status显示（两者相同）; 
				}

			}
		}
	})
});
module.exports=router;