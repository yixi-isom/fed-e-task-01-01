// 四、手写实现MyPromse源码

const { all } = require("lodash/fp");
const { setTime } = require("ngx-bootstrap/chronos/utils/date-setters");

//三种状态
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(executor) {
    try {
      executor(this.resolve, this.reject);
    } catch (e) {
      this.reject(e);
    }
  }
  //初始状态为pending
  status = PENDING;
  value = undefined;
  reason = undefined;
  successCallback = [];
  failCallback = [];

  //resolve函数
  resolve = (value) => {
    //如果状态不为pending直接返回
    if (this.status !== PENDING) {
      return;
    }
    //更改状态为成功
    this.status === FULFILLED;
    //赋值给值
    this.value = value;
    while (this.successCallback.length) {
      this.successCallback.shift()(this.value);
    }
  };

  //reject函数
  reject = (reason) => {
    //如果状态不为pending直接返回
    if (this.status !== PENDING) {
      return;
    }
    //更改状态为失败
    this.status === REJECTED;
    //赋值给值
    this.reason = reason;
    while (this.failCallback.length) {
      this.failCallback.shift()(this.reason);
    }
  };

  //then函数，根据状态返回对应的promise
  then(successCallback, failCallback) {
    // 可选参数
    successCallback = successCallback ? successCallback : (value) => value;
    failCallback = failCallback
      ? failCallback
      : (reason) => {
          throw reason;
        };
    let promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = successCallback(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            failCallback(this.reason);
          } catch (e) {
            reject(e);
          }
        }, 0);
      } else {
        this.successCallback.push(() => {
          successCallback();
          setTimeout(() => {
            try {
              let x = successCallback(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.failCallback.push(() => {
          failCallback();
          setTimeout(() => {
            try {
              let x = failCallback(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });
    return promise2;
  }
  static all(array) {
    let result = [];
    let index = 0;
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(
      new TypeError("Chaining cycle detected for promise #<Promise>")
    );
  }
  if (x instanceof MyPromise) {
    x.then(resolve, reject);
  } else {
    resolve(x);
  }
}
