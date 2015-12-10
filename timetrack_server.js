// JavaScript Document
var http = require('http');
var work = require('./lib/timetrack');
var mysql = require('mysql');


//连接mysql
var db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	port: 3306,             
	database: 'nodejs'	
});
db.connect();

//http请求路由
var server = http.createServer(function(req, res) {
	switch (req.method) {
		case 'POST':                 //HTTP Post请求路由
			switch(req.url) {
				case '/':
					work.add(db, req, res);
					break;
				case '/archive':
					work.archive(db, req, res);
					break;
				case '/deletes':
					work.deletes(db, req, res);
					break;
			}
			    break;
			 case 'GET':                  //http get请求路由
			 	switch(req.url) {
					case '/':
						work.show(db, res);
						break;
					case '/archived':
						work.showArchived(db, res);	
				}
				break;						
	}	
});

//创建数据库表
db.query(
	"CREATE TABLE IF NOT EXISTS work ("
	+"id INT(10) NOT NULL AUTO_INCREMENT, "
	+"hours DECIMAL(5,2) DEFAULT 0, "
	+"date DATE, "
	+"archived INT(1) DEFAULT 0, "
	+"description LONGTEXT, "
	+"PRIMARY KEY(id))",
	function(err) {
		if (err) throw err;
		console.log('Server started...');
		server.listen(3001);	
	}	
);
