// var 的缺陷
var a = []
for (var i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i)
  }
}
a[6]() // 10

/*

变量 i 是全局变量(只有一个), 每一次循环, 变量 i 的值都会发生变化
console.log(i) 中的 i 就是指向全局的 i, 所有数组 a 的成员里面的 i 指向同一个 i, 导致运行时输出的最后一轮的 i 的值, 10

*/
// let 的优点
var a = []
for (let i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i)
  }
}
a[6]() // 6 正确

/*
  i 只在本轮循环中有效, 每一次循环的 i 其实都是一个新的变量
*/

/*
  for + let 的特殊之处
*/
// 父作用域
for (let i = 0; i < 3; i++) {
  // 子作用域, 循环内部是一个单独的子作用域, 因此两个 i 不会冲突
  // 牢记: 循环变量 i 和函数内部的 i 不是同一个作用域
  let i = 'abc'
  console.log(i)
}

// 没有变量提升
// 声明在前, 使用在后, 否则报错
console.log(foo) // undefined
var foo = 2

console.log(bar)
let bar = 2 //ReferenceError: Cannot access 'bar' before initialization

// 暂时性死区 TDZ 在代码块中, 使用 let 声明变量之前, 该变量都是不可用的(尽管有同名全局变量)
// 如果区块中存在 let 和 const 命令, 这个区块对这些命令声明的变量, 从一开始就形成了封闭作用域, 凡在声明之前使用这些变量, 报错
var temp
if (true) {
  // TDZ 开始
  temp = 'abc' // ReferenceError
  console.log(temp) // ReferenceError
  let temp // TDZ 结束 // undefined

  temp = 123
  console.log(temp) // 123
}

/*
  总之记住, 变量一定先声明后使用, 否则报错
*/
/*
  隐蔽的 TDZ
*/
// 此时 y 还没有声明, 属于 TDZ
function bar(x = y, y = 2) {
  return [x, y]
}
bar() // ReferenceError: Cannot access 'y' before initialization

// let 不允许重复声明同一个变量
function func() {
  let a = 10
  var a = 1 // 报错
}
function func() {
  let a = 10
  let a = 1 // 报错
}

// 不能在函数内部重新声明参数
function func(arg) {
  let arg
}
func() // SyntaxError: Identifier 'arg' has already been declared

function func() {
  {
    let age
  }
}
func() // 不报错

/*
  没有块作用域的缺点
  一: 内层变量可能覆盖外层变量
  二: 循环变量泄露为全局变量
*/
var tmp = new Date()
function f() {
  console.log(tmp)
  if (false) {
    // 存在变量提升, temp 移动到 f 的最前面
    var tmp = 'hello world!'
  }
}
f() // undefined

var s = 'hello'
for (var i = 0; i < s.length; i++) {
  console.log(s[i])
}
// 在循环外可以访问到循环变量 i 没有消失, 而是泄露成了全局变量
console.log(i) // 5

/*
  块级作用域取代了 "匿名 IIFE" 匿名立即执行函数表达式
*/

/*
  应该避免在块级作用域内声明函数, 如果一定要, 使用函数表达式, 而非函数声明语句
*/
// 不好
{
  let a = 'secret'
  function f() {
    return a
  }
}

// 好, 优先使用函数表达式
{
  let a = 'secret'
  let f = function () {
    return a
  }
}
/*
  大括号是 es6 块级作用域的标志, 没有大括号, JavaScript 认为不存在块级作用域
*/
// 报错
// if (true) let x = 1 // 报错 SyntaxError: Lexical declaration cannot appear in a single-statement context
// 记得加上 {}
if (true) {
  let x = 1
}

// const 声明一个常量, 一旦声明不能改变
const PI = 3.1415
PI = 3 // TypeError: Assignment to constant variable.

// const 一旦声明变量必须立即初始化, 不能留到以后赋值
// const foo // SyntaxError: Missing initializer in const declaration
// const 也同样存在 TDZ, 同样不可重复声明

/*
  const 的本质: 并不是变量的值不变, 而是变量指向的那个内存地址所保存的数据不得改动
  简单类型: 数值 字符串 布尔值 值就保存在变量指向的那个内存地址, 因此等同于常量
  复合类型: 对象 数组, 变量指向的内存地址, 保存的只是一个指向实际数据的指针(双层指针), const 仅仅保证这个指针是固定的, 至于
  它所指向的数据结构是否发生变化, const 不保证

  总之, 对于对象来说, const 能够保证变量所指向的地址不变(地址上 "住" 的是谁, 不保证)
*/
const foo = {}
foo.prop = 123
console.log(foo.prop) // 123
// 将 foo 重新指向另一个对象, 报错
foo = {} // TypeError: Assignment to constant variable.

const a = []
a.push('Hello')
a.length = 0
a = ['Dave'] // 报错, 改变地址, 重新赋值

/*
  ES6 声明变量的六种方法
  var function let const import class
*/

/*
  var function 命令声明的全局变量, 依旧是顶层对象的属性
  let const class 声明的全局变量, 不属于顶层对象的属性
*/
let b = 1
console.log(global.a) // undefined, let 声明的全局变量不再是顶层对象 global 的属性

