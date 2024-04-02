const path = require('path');

module.exports = {
  outputDir: path.resolve(__dirname, "./dist/backoffice"),
  devServer: {
    port: 3001,
    proxy: {
      '': {
        target: 'http://localhost', // 스프링부트 개발포트
        changeOrigin: true
      }
    }
  }
};
