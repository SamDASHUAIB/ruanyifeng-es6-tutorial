/*
  Promise 是一种异步编程解决方案
  Promise 是一个容器, 保存着某个未来才会结束的事件(一个异步操作)的结果
  Promise 是一个对象, 可以从它获取异步操作的消息

  Promise 对象的特点
    1.对象的状态不受外界影响, pending fulfilled rejected 只有异步操作的结果, 可以决定当前是哪一种状态, 任何其他操作都无法改变这个状态
    2.一旦状态改变, 就不会再变 pending => fulfilled pending => rejected 一旦这两种状态发生, 状态就凝固了, 不会再变了, 会一直保持这个结果

    避免了 "回调地狱", Promise 对象提供统一的接口, 使得控制异步操作更加容易
  缺点:
    Promise 也有一些缺点, 无法取消 Promise, 一旦新建它就会立即执行, 无法中途取消
    如果不设置回调函数, Promise 内部抛出的错误, 不会立即反应到外部
    处于 pending 状态时, 无法得知目前进展到哪一个阶段
*/

// new Promise(), Promise 对象是一个构造函数, 用来生成 Promise 实例
const promise = new Promise(function (resolve, reject) {
  // some code
  if (condition) {
    resolve(value)
  } else {
    reject(value)
  }
})
/*
  pending => fulfilled resolve()函数, 异步操作成功时调用, 并将异步操作的结果, 作为参数传递出去
  pending => rejected reject()函数, 异步操作失败时调用, 并将异步操作报出的错误, 作为参数传递出去

  使用 then 方法分别制定 resolved 状态和 rejected 状态的回调函数, 这两个回调函数都接收 Promise 对象传出的值作为参数
*/
promise.then(
  function (value) {
    // success
  },
  function (error) {
    // failure
  },
)

function timeout(ms) {
  return new Promise((resolve, reject) => {
    // 过了指定的时间 ms 以后, Promise 实例的状态变为了 resolved, 因此触发 then 绑定的回调函数(resolve 将传递一个 'done' 字符串参数给 then 指定的回调函数)
    // setTimeout 的第三个参数开始, 一旦定时器到期，它们会作为参数传递给 function (回调函数) 本例中就是 resolve 函数
    setTimeout(resolve, ms, 'done')
  })
}
// value 就是 resolve 方法传递出来的 "done"
timeout(100).then((value) => console.log(value)) // done

/* Promise 新建后就会立即执行 */
let promise = new Promise(function (resolve, reject) {
  console.log('Promise')
  resolve()
})
promise.then(function () {
  console.log('resolved.')
})
console.log('hi')
/*
  Promise
  hi
  resolved.

  最先输出 Promise, 说明 Promise 新建后立即执行
  then 方法指定的回调函数在同步任务完成之后执行, 所以 resolved 最后输出
*/

/* 用 Promise 对象实现 Ajax 操作的例子 */
// getJSON 是对 XMLHttpRequest 对象的封装, 用于发送一次针对 JSON 数据的 HTTP 请求, 并且返回一个 Promise 对象
const getJSON = function (url) {
  const promise = new Promise(function (resolve, reject) {
    const handler = function () {
      if (this.readyState !== 4) {
        return
      }
      if (this.status === 200) {
        resolve(this.response)
      } else {
        reject(new Error(this.statusText))
      }
    }
    // 设置发送的 HTTP 报文
    const client = new XMLHttpRequest()
    client.open('GET', url)
    client.onreadystatechange = handler
    client.responseType = 'json'
    client.setRequestHeader('Accept', 'application/json')
    client.send()
  })
  // 返回一个 Promise 对象
  return promise
}
// 如果 resolve 函数和 reject 函数都带有参数, 那么它们的参数将会被传递给回调函数

getJSON('/posts.json').then(
  function (json) {
    console.log('Contents: ' + json)
  },
  function (error) {
    console.log(error)
  },
)

// resolve 函数的参数除了正常的值以外, 还可能是另一个 Promise 实例
const p1 = new Promise(function (resolve, reject) {
  // ...
})

const p2 = new Promise(function (resolve, reject) {
  // ... resolve 的参数可能是另一个 Promise 实例
  // 此时，p1 的状态也会传递给 p2 p1 的状态决定了 p2 的状态
  // p1 pending 那么 p2 继续等待 p1 的状态发生改变, 如果 p1 的状态已经是 resolved 或者 rejected 那么 p2 的回调函数将会立刻执行
  resolve(p1)
})

const p1 = new Promise(function (resolve, reject) {
  // 3 秒钟后, 状态变为 rejected
  setTimeout(() => reject(new Error('fail')), 3000)
})

const p2 = new Promise(function (resolve, reject) {
  // 一秒钟后, 状态变为 resolved, 且 resolve 方法返回的是 p1
  // 由于 p2 返回的是另一个 Promise, 导致 p2 自己的状态无效了, 由 p1 决定 p2 的状态
  setTimeout(() => resolve(p1), 1000)
})
// 此时的 then 方法针对的其实是 p1, 又过了 2 秒, p1 变为 rejected, 导致触发 catch 方法指定的回调函数
p2.then((result) => console.log(result)).catch((error) => console.log(error))
// Error: fail

/*
  调用 resolve 或者 reject 函数并不会终结 Promise 的参数函数的执行
*/
new Promise((resolve, reject) => {
  resolve(1)
  // 还是会执行, 并且是立即执行
  console.log(2)
}).then((r) => {
  console.log(r)
})
/*
  2
  1
  resolved 的 Promise 是在本轮事件循环的末尾执行, 总是晚于本轮事件循环的同步任务
  最好加上 return 语句以防 Promise 继续执行
*/
new Promise((resolve, reject) => {
  return resolve(1)
  // 永远不会执行
  console.log(2)
})

/*
Promise.prototype.then() 为 Promise 实例添加状态改变时的回调函数
第一个参数 => resolved
第二个参数(可选) => rejected

then 方法返回的是一个新的 Promise 实例, 因此可以采用链式写法
*/
getJSON('/posts.json')
  .then(function (json) {
    return json.post
  })
  .then(function (post) {
    // ...
  })

// 采用链式写法, 可以指定一组按照次序调用的回调函数

/*
  Promise.prototype.catch() 用于指定发生错误时的回调函数, 是 then(null, reject) 或者 then(undefined, reject) 的别名
  then 方法指定的回调函数, 如果运行中抛出错误, 也会被 catch() 方法捕获
*/
p.then((val) => console.log('fulfilled: ' + val)).catch((err) =>
  console.log('rejected: ' + err),
)

/* reject() 方法的作用, 等同于抛出错误 */
const promise = new Promise(function (resolve, reject) {
  // 状态凝固, 无法改变, 一旦 Promise 的状态发生改变, 就永久保存该状态, 不会再变了
  resolve('ok')
  // 无效的抛出
  throw new Error('test')
})
promise.then((val) => console.log(val)).catch((err) => console.log(err)) // "ok"

/* 建议总是使用 catch() 方法, 而不要使用定义第二个参数的 then() 方法 */

const promise = new Promise((resolve, reject) => {
  resolve('ok')
  // 下一轮事件循环再抛出错误, 到了那时, Promise 的运行已经结束了, 所以这个错误是在 Promise 函数体外部抛出, 最后冒泡到最外层, 成了未捕获的错误
  setTimeout(() => {
    throw new Error('test')
  }, 0)
})
promise.then((val) => console.log(val)) // Error: test
/* 一般总是建议, Promise 对象后面要跟 catch() 方法, 这样可以处理 Promise 内部发生的错误, catch() 方法返回的还是一个 Promise 对象, 可以在后面接着调用 then() */

/*
Promise.prototype.finally() 方法用于指定不管 Promise 对象最后状态如何, 都会执行的操作
finally 方法的回调函数不接受任何参数, 这意味着没有办法知道, 前面的 Promise 状态到底是 fulfilled 还是 rejected
这说明 finally 方法里面的操作, 应该是与状态无关的, 不依赖于 Promise 的执行结果
*/
promise
  .then((r) => console.log(r))
  .catch((err) => console.log(err))
  .finally(() => {})

/*
Promise.all() 将多个 Promise 实例, 包装成一个新的 Promise 实例
all 方法的参数可以不是数组, 但必须具有 Iterator 接口, 且返回的每个成员都是 Promise 实例
*/
// p 的状态由 p1 p2 p3 决定,
// p1 p2 p3 状态都变成了 fulfilled p 的状态才会变成 fulfilled, 此时 p1 p2 p3 的返回值组成一个数组, 传递给 p 的回调函数
// p1 p2 p3 之中有一个被 rejected, p 的状态变成 rejected, 此时第一个被 reject 的实例的返回值, 传递给 p 的回调函数
const p = Promise.all([p1, p2, p3])

const promises = [2, 3, 5, 7, 11, 13].map((id) => {
  return getJSON('/post/' + id + '.json')
})
Promise.all(promises)
  .then((posts) => {})
  .catch((rea) => {})

/* 如果作为参数的 Promise 实例, 自己定义了 catch 方法, 那么它一旦被 rejected 并不会触发 Promise.all() 的 catch() 方法 */
const p1 = new Promise((resolve, reject) => {
  resolve('hello')
})
  .then((result) => result)
  .catch((e) => e)
const p2 = new Promise((resolve, reject) => {
  throw new Error('报错了!')
})
  .then((result) => result)
  /* catch 方法触发, 返回的是一个新的 Promise 实例, p2 指向的实际上是这个新的 Promise, 该实例执行完 catch 方法后, 也会变成 resolved
  导致 all() 方法参数里面的两个实例都会 resolved 因此调用 then 方法指定的回调函数, 而不是 catch 方法指定的回调函数 */
  .catch((e) => e)

Promise.all([p1, p2])
  .then((result) => console.log(result))
  .catch((e) => console.log(e))
/*
  [
  'hello',
  Error: 报错了!
  ]
*/

/*
  Promise.race() 同样是将多个 Promise 实例, 包装成一个新的 Promise 实例
  p1 p2 p3 之中有一个实例率先改变状态, p 的状态跟着改变, 那个率先改变的 Promise 实例的返回值, 就传递给 p 的回调函数
*/
const p = Promise.race([p1, p2, p3])

// 指定时间内没有获得结果, 就将 Promise 的状态变为 reject 否则变为 resolve
const p = Promise.race([
  fetch('/resource-that-may-take-a-while'),
  // fetch 方法 5 秒钟内无法返回结果, 变量 p 的状态就会变为 rejected, 从而触发 catch 方法指定的回调函数
  new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('request timeout')), 5000)
  }),
])

p.then(console.log).catch(console.error)

/* Promise.resolve() 方法将现有的对象转为 Promise 对象 */
const jsPromise = Promise.resolve($.ajax('/whatever.json'))
// 等价于
// Promise.resolve('foo)
// new Promise(resolve => resolve('foo'))

/*
  1.参数是一个 Promise 对象, 原封不动地返回这个实例, 不做任何修改
  2.参数是一个 thenable 对象, 具有 then 方法的对象
    转为 Promise 对象, 立即执行 then 方法
  3.参数不具有 then 方法的对象, 或者根本不是对象
    返回一个新的 Promise 对象, 状态为 resolved
  4.不带任何参数
    直接返回一个 resolved 状态的 Promise 对象

*/
let thenable = {
  then: function (resolve, reject) {
    resolve(42)
  },
}
let p1 = Promise.resolve(thenable)
p1.then((val) => console.log(val)) // 42 将原对象转为 Promise 对象, 并且立即执行原对象定义的 then 方法, 此时 p1 的状态变为了 resolved 从而立即执行 p1 的 then 中定义的回调函数

const p = Promise.resolve('Hello')
p.then((s) => console.log(s)) // 'Hello' 返回的 Promise 对象一开始就是 resolved, 所以回调函数会立即执行, 注意 Promise.resolve(arg) 中的参数 arg 会传递给 then 的回调函数

const p = Promise.resolve()
p.then(() => {}) // 直接返回一个 resolved 状态的 Promise 对象,

// 立即 resolve() 的 Promise 对象, 在本轮事件循环的末尾时执行而非下一轮事件循环的开始时
setTimeout(() => {
  console.log('three')
}, 0) // 下一轮事件循环执行
Promise.resolve().then(() => {
  console.log('two')
}) // 本轮事件循环的末尾
console.log('one') // 同步任务, 最先执行
/*
one
two
three
*/

/*
  Promise.reject() 也会返回一个新的 Promise 实例, 该实例的状态为 rejected
*/
const p = Promise.reject('出错了') // 生成一个 Promise 对象的实例 p 状态为 rejected 回调函数立即执行(then 指定或者 catch)
// 等同于
const p = new Promise((resolve, reject) => {
  reject('出错了')
})
p.then(
  (null,
  function (s) {
    console.log(s)
  }),
)

/* Promise 异步编程的一种解决方案 */
/* Promise 容器, 保存着某个未来才会结束的事件(异步操作)的结果 */
/*
  特点:
  对象的状态不受外界影响, pending fulfilled rejected 三种状态, 只有异步操作的结果可以决定当前是哪一种状态
  一旦状态改变, 就不会再变, "凝固" resolved
    改变已经发生 => 对 Promise 对象添加回调函数, 也会立即得到这个结果
    事件: 一旦错过了, 再去监听, 得不到结果
  避免了层层嵌套的回调函数, Promise 对象提供统一的接口, 使得控制异步操作更加容易
  缺点
    无法取消 Promise, 一旦新建立即执行, 无法中途取消
    如果不设置回调函数, Promise 内部抛出的错误, 不会反应到外部
    pending 时, 无法得知目前进展到哪一个阶段(刚刚开始, 还是即将完成)
*/
const promise = new Promise((resolve, reject) => {
  if (/* 异步找错成功 */ true) {
    resolve(value)
  } else {
    reject(value)
  }
})

/*
  resolve: 未完成 => 成功 pending => resolved 异步操作的结果, 作为参数传递出去
  reject: 未完成 => 失败 pending => rejected 异步操作报出的错误, 作为参数传递出去
*/
promise.then(
  (value) => {
    /* success */
  },
  (err) => {
    /* failure */
  },
)

function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms, 'done')
  })
}
timeout(100).then((value) => {
  console.log(value)
})

/* promise 新建后就会立即执行 */
let promise = new Promise((resolve, reject) => {
  console.log('Promise')
  resolve()
})
promise.then(function () {
  console.log('resolve')
})
console.log('Hi')
/*
  Promise 说明 Promise 新建后会立即执行
  Hi 同步代码
  resolve 回调函数, then 方法指定的回调函数, 将在当前脚本所有同步任务执行完才会执行, 所以 resolved 最后输出
*/

/* 如果 resolve 和 reject 函数带有参数, 那么它们的参数会被传递给回调函数 */
/* 调用 resolve 或者 reject 并不会终结 Promise 的参数函数的执行 */
new Promise((resolve, reject) => {
  return resolve(1) /* 本轮事件循环的末尾执行, 总是晚于本轮循环的同步任务, 添加 return 就不会有意外了 */
  console.log(2) /* 继续执行, 添加了 return 不执行 */
})
  .then((result) => {
    console.log(result)
  })

/* Promise.prototype.then 为 Promise 实例添加状态改变时的回调函数 */
/* then 方法返回的是一个新的 Promise 实例, 链式写法, 上一个 then 会将结果作为参数, 传入第二个回调函数 */

/* Promise 内部的错误不会影响到 Promise 外部的代码 */

/* Promise.all() 方法将多个 Promise 实例, 包装成一个新的 Promise 实例 */
const p = Promise.all([p1, p2, p3])
/* p1, p2, p3 的状态都变成 fulfilled p => fulfilled, 此时 p1 p2 p3的返回值组成一个数组, 传递给 p 的回调函数 */
