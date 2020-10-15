/*
  async 函数就是 Generator 函数的语法糖
  改进:
    内置执行器, 向执行普通函数一样, asyncReadFile()
    更好的语义, async 表示函数里面有异步操作, await 表示紧跟在后面的表达式需要等待结果(异步操作)
    更广的适用性, async 函数和 await 命令后面, 可以释怀 Promise 对象和原始类型的值(数值 字符串和布尔值), 但这时会自动转成立即 resolved 的 Promise 对象
    返回值是 Promise, 可以用 then 方法指定下一步的操作

    async 函数完全可以看作多个异步操作, 包装成一个 Promise 对象, 而 await 命令就是内部 then 命令的语法糖

*/

/*
  async 函数的基本用法
  当函数执行的时候, 一遇到 await 就会先返回, 等到异步操作完成, 再接着执行函数体后面的语句
*/
async function getStockPriceByName(name) {
  const symbol = await getStockSymbol(name)
  const stockPrice = await getStockPrice(symbol)
  return stockPrice // 返回一个 Promise 对象
}
getStockPriceByName('google').then(function (result) {
  console.log(result)
})

/*
  指定多少毫秒后输出一个值
*/
function timeout(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
async function asyncPoint(value, ms) {
  // 遇到 await 就先返回, 等到同步操作完成, 再接着执行函数体后面的语句
  await timeout(ms)
  console.log(value)
}
asyncPoint('hello world', 50)

/*
  async 多种形式
*/
// 函数声明
async function foo() {}
// 函数表达式
const foo = async function () {}
// 对象方法
let obj = {
  async foo() {},
}
obj.foo().then()

// 箭头函数
const foo = async () => {}

// async 函数内部 return 语句返回的值, 会成为 then 方法回调函数的参数
async function f() {
  return 'hello world'
}
// v 就是 f() 的返回值
f().then((v) => console.log(v))

/* async 函数内部抛出错误, 导致返回的 Promise 对象变为 reject 状态, 抛出的错误对象会被 catch 方法回调函数接收到 */
async function f() {
  throw new Error('出错了!')
}
f().then(
  (v) => console.log(v),
  (e) => console.log(e), // Error: 出错了!
)

/*
  只有 async 函数内部的异步操作执行完, 才会执行 then 方法指定的回调函数
  async 函数返回的 Promise 对象, 必须等到内部所有 await 命令后面的 Promise 对象执行完, 才会发生状态改变, 除非遇到 return 语句
  或者抛出错误
*/

/*
  正常情况下, await 命令后面是一个 Promise 对象, 返回该对象的结果, 如果不是 Promise 对象, 就直接返回对应的值
  await 命令遇到 thenable 对象(定义了 then 方法的对象), 那么 await 会将其等同于 Promise 对象
*/
async function f() {
  // 等同于 return 123
  return await 123
}
f().then((v) => console.log(v)) // 123 非 Promise 直接返回原值

function sleep(interval) {
  return new Promise((resolve) => {
    setTimeout(resolve, interval)
  })
}
async function one2FiveInAsync() {
  for (let i = 0; i < 5; i++) {
    console.log(i)
    await sleep(1000)
  }
}
one2FiveInAsync()

/*
  await 命令后面的 Promise 对象如果变为 rejected 状态, 则 reject 的参数会被 catch 方法的回调函数接收到
*/
async function f() {
  await Promise.reject('出错了!') // 即使没有 return, reject 方法里面的参数依然传入了 catch 方法的回调函数
}
f().then(
  (v) => console.log(v),
  (e) => console.log(e),
) // 出错了

/*
  任何一个 await 语句后面的 Promise 对象变为 rejected 状态, 那么整个 async 函数都会中断执行
*/
async function f() {
  await Promise.reject('出错了!')
  await Promise.resolve('hello world') // 不会执行, async 函数中断执行
}

// 拒绝中断后面的异步操作, 可以将第一个 await 放在 try...catch 结构里面, 不管这个异步操作是否成功, 第二个 await 都会执行
async function f() {
  try {
    await Promise.reject('出错了')
  } catch (e) {}
  // 不会中断
  return await Promise.resolve('hello world')
}
f().then((v) => console.log(v)) // "hello world"

// 或者, await 后面的 Promise 对象再跟着一个 catch 方法, 处理前面可能出现的错误
async function f() {
  await Promise.reject('出错了').catch((e) => console.log(e)) // 出错了
  return await Promise.resolve('hello world')
}
f().then((v) => console.log(v))

/*
  防止出错的方法, 就是将其放在 try...catch 代码块之中
*/
async function main() {
  try {
    const val1 = await firstStep
    const val2 = await secondStep(val1)
    const val3 = await thirdStep(val1, val2)
  } catch (e) {
    console.log(e)
  }
}

/*
  由于 await 命令后面的 Promise 对象, 运行结果可能是 rejected, 所以最好把 await 命令放在 try...catch 代码块中
*/
async function myFunction() {
  try {
    await something()
  } catch (err) {
    console.log(err)
  }
}
// 或者
async function myFunction() {
  // 后面接一个 catch 进行处理
  await something().catch((err) => console.log(err))
}

/*
  如果不存在继发关系, 最好让他们同时触发
*/
// 写成继发关系, 耗时, 只有 getFoo 完成之后, 才会执行 getBar, 完全可以让它们同时触发
let foo = await getFoo()
let bar = await getBar()
// 使用 Promise.all() 同时触发, 缩短程序的执行时间
let [foo, bar] = await Promise.all([getFoo(), getBar()])

/* await 只能用在 async 函数之中, 用在普通函数, 报错 */

/* async 函数可以保留运行堆栈 */
const a = () => {
  b().then(() => c())
} // b() 是一个异步操作, b() 运行的时候, a() 不会中断, 而是继续执行, 等到 b() 执行结束, 可能 a() 已近早就运行结束了, b() 所在的上下文环境已经消失, 如果 b() 或 c() 报出, 错误堆栈将不包括 a()

// 使用 async 可以保留 a() 的运行堆栈
const a = async () => {
  await b() // b() 运行的时候, a() 暂停执行, 上下文环境都保存着, 一旦 b() 或者 c() 报错, 错误堆栈将包括 a()
  c()
}
/* await 命令只能出现在 async 函数内部, 否则都会报错 */
