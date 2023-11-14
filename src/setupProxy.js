const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
  // app.use(
  //   '/blockBrowser',
  //   createProxyMiddleware({
  //     target: 'https://hscan.org/',
  //     changeOrigin: true,
  //     pathRewrite: {'^': ''},
  //   }),
  // );

//   createProxyMiddleware('/api1',{//预见/api1前缀的就会触发该代理配置
//     target:"http://localhost:5001",//请求转发给谁
//     changeOrigin:true,//控制服务器收到的请求头中host字段的值  来自 5001端口了
//     pathRewrite:{'^/api1':""} //重写请求路径 只要带有/api1开头的路径才会走这个代理
// }), 

  app.use(
    '/chainBrowser',
    createProxyMiddleware({
        // target: 'http://52.221.177.10:11010/chainBrowser/',
        target: 'http://47.104.157.94:11010/chainBrowser/',
        changeOrigin: true,
        pathRewrite: {'^/chainBrowser': ''}
    })
  );   
  // app.use(
  //   '/nodemonitor',
  //   createProxyMiddleware({
  //       target: 'https://hscan.org/nodemonitor/',
  //       changeOrigin: true,
  //       pathRewrite: {
  //           '^/nodemonitor': '',
  //       }
  //   })
  // );  
  //  app.use(
  //   '/nodelogapi',
  //   createProxyMiddleware({
  //       target: 'http://54.64.228.108:9091/',
  //       changeOrigin: true,
  //       pathRewrite: {
  //           '^/nodelogapi': '',
  //       }
  //   })
  // ); 

};
