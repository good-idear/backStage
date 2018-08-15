var express = require('express');
var common = require('../libs/common');
var mysql = require('mysql');

var router = express.Router();

var db = mysql.createPool({
	host:'localhost',
	user:'root',
	password:'123456',
	database:'students'
})
//      
//先检验登录情况
router.use((req,res,next)=>{
	if(!req.session['admin_id']&&req.url!='/login'){
		res.redirect('/admin/login');
	}else{
		next();
	}
});
router.get('/login',(req,res)=>{
	res.render('index',{});
})
//登录界面
router.post('/login', function(req, res, next) {
  var username = req.body.username;
  var password = common.md5(req.body.password + common.md5_SUFFIX);
  console.log(username,password);
  db.query(`SELECT * FROM admin_table WHERE username='${username}'`,(err,data)=>{
  	if(err){
  		console.error(err);
  		res.status(500).send('database error').end();
  	}else{
  		if(data.length==0){
  			res.status(400).send('不存在这个用户').end();
  		}else{
  			if(data[0].password==password){
  				//成功
  				req.session['admin_id']=data[0].ID;
  				console.log(data[0].ID);
  				res.redirect('/admin');//重定向回首页，重定向是绝对路径
  				
  			}else{
  				res.status(400).send('密码错误').end();
  			}
  		}
  	}
  });
  /*res.render('index');*/
  
});
//这里的根目录是 admin
router.get('/',(req,res)=>{
	res.send('恭喜成功登录！').end();
})

module.exports = router;
