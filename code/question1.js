const { reject } = require("lodash");

// 一、将下面异步代码使用Promise的方式改进
setTimeout(function () {
  var a = "hello";
  setTimeout(function () {
    var b = "lagou";
    setTimeout(function () {
      var c = "I ♥ U";
      console.log(a + b + c);
    }, 10);
  }, 10);
}, 10);

let promise = new Promise(function (resolve, reject) {
  var print = "";
  resolve(value);
  reject(reason);
});
