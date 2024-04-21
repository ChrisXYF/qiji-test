// 引入mysql
const mysql = require("mysql");
// 建立一个连接池
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "asd123",
  database: "qijitest",
});

// 检测数据库是否连接成功
db.query("select 1", (err, results) => {
  if (err) return console.log(err);
  console.log(results);
});

 
// 将文件暴露出去
module.exports = db