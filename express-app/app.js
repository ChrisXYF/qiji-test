// 引入express
const express = require("express");

const cors = require("cors");

// 创建服务器的实例对象
const app = express();
app.use(cors()); //使用cors中间件
 
// 配置解析表单数据的中间件  内置中间件，只能解析application/x-www-form-urlencoded格式的数据
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
/**
 * 还有自定义中间，自定义中间件最后必须加next()方法
 */
 
// 封装res.send() ,必须在路由之前封装
/**
 * 不管是输出正确的数据还是错误的信息，每次都需要写这么多东西
 * res.send({ state: 0, message: "查询成功", data: result })
 * 封装之后不需要写这么多
 */
app.use((req, res, next) => {
  // 定义一个输出的函数
  res.output = function(err, status = 1, data) {
      res.send({
          status,
          message: err instanceof Error ? err.message : err,
          data
      })
  }
  next();
})
 
// 导入并使用路由模块
const inforRouter = require('./router/userInfor')
app.use(inforRouter)
 
// 启动服务器
app.listen(3007, () => {
  console.log("Server running at http://127.0.0.1:3007");
});