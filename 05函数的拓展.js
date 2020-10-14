/*
  函数参数的默认值
  直接写在参数定义的后面
  阅读代码的人可以知道, 哪些参数是可以省略的,
  其次, 有利于将来的代码优化

*/
function log(x, y = 'world') {
  console.log(x, y)
}
log('hello') // hello world
log('hello', 'china') // hello china
log('hello', '') // hello

function Point(x = 0, y = 0) {
  this.x = x
  this.y = y
}
const p = new Point()
console.log(p) // Point { x: 0, y: 0 }

// 参数变量是默认声明的, 不能用 let 或者 const 再次声明
function foo(x = 5) {
  let x = 1
  // SyntaxError: Identifier 'x' has already been declared
}

/*
  参数默认值是不传值的, 而是每次都重新计算默认值表达式的值, 惰性求值
*/
let x = 99
function foo(p = x + 1) {
  console.log(p)
}
foo() // 100
x = 100
foo() // 101 惰性求值, 需要时重新计算默认表达式的值, 不缓存

/*
  函数参数的默认值 + 解构赋值的默认值
*/
// 只使用了对象的解构赋值, 没有使用函数参数的默认值, 因此只有当函数 foo 的参数是一个对象时, 变量 x 和 y 才会通过解构赋值生成
function foo({ x, y = 5 }) {
  console.log(x, y)
}
foo({}) // 解构赋值成功, x = undefined y = 5
foo({ x: 1 }) // 解构赋值成功, x = 1, y = 5
foo({ x: 1, y: 2 }) // 解构赋值成功, x = 1, y = 2
foo() // 解构赋值失败, 报错 TypeError: Cannot destructure property 'x' of 'undefined' as it is undefined.

/*
  函数参数的默认值 + 对象(这个对象时函数的参数)的解构赋值的默认值
*/
function foo({ x, y = 5 } = {}) {
  console.log(x, y)
}
foo() // undefined 5, 如果没有提供参数, 函数 foo 的参数默认是一个空对象 {}

/*
  双重默认值的练习
*/
// 写法一，函数参数的默认值是空对象，但是设置了对象解构赋值的默认值。
// 函数参数的默认值 + 对象解构赋值的默认值
function m1({ x = 0, y = 0 } = {}) {
  return [x, y]
}

// 写法二，函数参数的默认值是一个有具体属性的对象，但是没有设置对象解构的默认值。
// 只有函数参数的默认值, 没有对象解构赋值的默认值
function m2({ x, y } = { x: 0, y: 0 }) {
  return [x, y]
}
// 函数没有参数的情况
m1() // [0, 0]
m2() // [0, 0]

// x 和 y 都有值的情况
m1({ x: 3, y: 8 }) // [3, 8]
m2({ x: 3, y: 8 }) // [3, 8]

// x 有值，y 无值的情况
m1({ x: 3 }) // [3, 0]
m2({ x: 3 }) // [3, undefined] y 没有定义, 取不到, 左 > 右, 部分解构成功

// x 和 y 都无值的情况
m1({}) // [0, 0];
m2({}) // [undefined, undefined] 实际: {x,y} = {}

m1({ z: 3 }) // [0, 0] 实际: {x = 0, y = 0} = {z: 3}
m2({ z: 3 }) // [undefined, undefined] 实际: {x, y} = {z: 3}

/*
  参数默认值的位置
  一般来说, 定了默认值的参数, 应该是函数的尾参数
  非尾部参数设置默认值, 实际上这个参数无法省略
*/
function f(x = 1, y) {
  return [x, y]
}
f()
f(2)
// f(, 1) // 报错, 写法出错
f(undefined, 1) // 非尾部参数的默认值要生效, 需要明确传入 undefined

/*
  指定默认值后, 函数的 length 属性将失真, 返回的是没有指定默认值的参数个数
*/
console.log(function (a) {}.length) // 1
console.log(function (a = 5) {}.length) // 0 忽略掉拥有默认值的函数参数
console.log(function (a, b, c = 5) {}.length) // 2

/*
  作用域
  参数的默认值, 函数进行声明初始化时, 参数会形成一个单独的作用域
  等到初始化结束, 这个作用域消失
*/
var x = 1
function f(x, y = x) {
  console.log(y)
}
f(2) // 2 调用函数 f 时候, 参数形成一个单独的作用域, 在这个作用域里面, 默认值变量 x 指向第一个参数 x 而非全局变量 x 所以输出 2

let x = 1
function f(y = x) {
  // 函数调用的时候, 函数体内部的局部变量 x 影响不到默认值变量 x
  let x = 2
  console.log(y)
}
f() // 1 参数 y = x 形成一个单独的作用域, 这个作用域里面, 变量 x 本身没有定义, 所以指向外层的全局变量 x

/*
  参数的默认值是一个函数, 该函数的作用域也遵守这个规则
*/
let foo = 'outer'
// () => foo 中的 foo 没有定义, 因此其实际上指向的是全局变量 foo 值为 'outer'
function bar(func = () => foo) {
  let foo = 'inner'
  console.log(func())
}
bar() // outer

var x = 1
function foo(
  x,
  y = function () {
    {
      x = 2
    }
  },
) {
  var x = 3
  // y 的默认值是一个匿名函数, 这个匿名函数内部的变量 x 指向同一个作用域的第一个参数 x
  // foo 函数内部的变量 x 和第一个参数 x 不是同一个作用域, 所以, 不是同一个变量
  // 执行 y() 之后, foo 内部和全局的 x 都不会改变
  y()
  console.log(x)
}
foo() // 3
console.log(x) // 1

/*
  利用参数默认值, 可以指定某一个参数不得省略, 如果省略就抛出错误
*/
function throwIfMissing() {
  throw new Error('Missing parameter')
}
// foo 函数没有参数, 调用默认值  throwIfMissing 函数, 抛出一个错误
function foo(mustBeProvided = throwIfMissing()) {
  return mustBeProvided
}
foo() // Error: Missing parameter

// 将 参数默认值设为 undefined 表明这个参数是可以省略的
function foo(optional = undefined) {}

/*
  rest 参数, 获取函数的多余参数, 可以取代 arguments 对象
  rest 参数搭配的变量是一个数组, 该变量将多余的参数放入数组中
*/
function add(...values) {
  let sum = 0
  // values 是一个 Array 因此可以使用 for of
  for (const val of values) {
    sum += val
  }
  return sum
}
console.log(add(2, 5, 3)) // 10

// rest 参数代替 arguments 变量
function sortNumbers() {
  // 先将 arguments 对象转为真正的数组
  return Array.prototype.slice.call(arguments).sort()
}
// rest 参数的写法
// numbers 天然就是一个数组, 不需要转化
const sortNumbers = (...numbers) => numbers.sort()

// 利用 rest 参数, 改写数组的 push 方法
function push(array, ...items) {
  // items 天然就是一个数组(参数数组), 可以使用 forEach
  items.forEach(function (item) {
    array.push(item)
    console.log(item)
  })
}
var a = []
push(a, 1, 2, 3) // 1 2 3

// rest 参数只能是最后一个参数, 否则报错

// 函数的 length 属性, 忽略 rest 参数

/*
  只要参数使用了默认值, 解构赋值, 或者扩展运算符, 就不能显式指定严格模式(函数内部)
  但是可以在全局环境中设定严格模式
  或者使用 IIFE 包裹函数
*/
function doSomething(a, b = a) {
  'use strict' // SyntaxError: Illegal 'use strict' directive in function with non-simple parameter list
}

;('use strict')
function doSomething(a, b = a) {}
const doSomething = (function () {
  'use strict'
  return function (value = 42) {
    return value
  }
})()

/*
  箭头函数
  箭头函数的代码部分多于一条语句, 使用大括号将它们括起来, 并且使用 return 语句返回
*/
var sum = (num1, num2) => num1 + num2
// 等同于
var sum = (num1, num2) => {
  return num1 + num2 // 需要使用return 语句
}

// 由于 {} 被解释为代码块, 因此,如果箭头函数直接返回一个对象, 必须在对象外面加上 ()
// let getTempItem = id => {id: id, name: 'Temp'} // 报错
let getTempItem = (id) => ({ id: id, name: 'Temp' })

/*
  箭头函数只有一行语句, 且无需返回值
*/
let fn = () => void doesNotReturn() // 使用 void

// 箭头函数 + 解构赋值
const full = ({ first, last }) => first + ' ' + last // {first, last} = person(参数对象)
// 等同于
function full(person) {
  return person.first + ' ' + person.last
}

/*
  箭头函数可以简化回调函数
*/
;[1, 2, 3].map(function (x) {
  return x * x
})
// 箭头函数写法
;[1, 2, 3].map((x) => x * x)

var result = values.sort(function (a, b) {
  return a - b
})
// 箭头函数简化
var result = values.sort((a, b) => a - b)

// rest 参数 + 箭头函数
const numbers = (...nums) => nums // 返回值 nums 是一个数组
console.log(numbers(1, 2, 3, 4, 5)) // [ 1, 2, 3, 4, 5 ]

const headAndTail = (head, ...tail) => [head, tail]
console.log(headAndTail(1, 2, 3, 4, 5)) // [ 1, [ 2, 3, 4, 5 ] ]

/*
  箭头函数的使用注意点
  1.函数体内的 this 对象, 就是定义时所在的对象, 而不是使用时所在的对象
  2.不可充当构造函数, 不可使用 new
  3.不可使用 arguments 对象, 用 rest 参数代替
  4.不可使用 yield 命令, 不能作为 Generator 函数
*/

/*
  this 对象在箭头函数中是固定的(声明, 而非运行)
*/
function foo() {
  setTimeout(() => {
    console.log('id: ', this.id)
  }, 100)
}
var id = 21
foo.call({ id: 42 }) // id:  42, 箭头函数导致 this 总是指向函数定义生效时所在的对象, 本例中是 {id: 42}
// 对比普通函数

function foo() {
  setTimeout(function () {
    console.log('id: ', this.id)
  }, 100)
}
var id = 21
foo.call({ id: 42 }) // id: 21

/*
  箭头函数可以让 setTimeout 里面的 this 绑定定义时所在的作用域, 而不是指向运行时所在的作用域
*/
function Timer() {
  this.s1 = 0
  this.s2 = 0
  // 使用箭头函数, this 绑定了定义时所在的作用域(Timer 函数)
  setInterval(() => {
    this.s1++
  }, 1000)
  // 使用普通函数, this 指向运行时所在的作用域(全局作用域)
  setInterval(function () {
    this.s2++
  }, 1000)
}
var timer = new Timer()
setTimeout(() => {
  console.log(`s1: ${timer.s1}`)
}, 3100) // s1 刷新了3次
setTimeout(() => {
  console.log(`s2: ${timer.s2}`)
}, 3100) // s2 一次都没刷新

/*
  箭头函数可以让 this 指向固定化, 这非常有利于回调函数的封装
*/

/*
  箭头函数根本没有自己的 this 导致内部的 this 就是外层代码块的 this 正因为它没有 this 所以也就不能用作构造函数
*/
// es6
function foo() {
  setTimeout(() => {
    console.log(`log: ${this.id}`)
  }, 100)
}
// es5
function foo() {
  // 也就是说, 箭头函数的 this 是借用外层的
  var _this = this
  setTimeout(() => {
    console.log(`id: ${_tihs.id}`)
  }, 100)
}

/*
  所有箭头函数的 this (多层嵌套)都没有自己的 this 它们的 this 其实都是最外层 foo 函数的 this
  arguments super new.target 在箭头函数里面都没有
  由于箭头函数没有自己的 this, 当然也不能使用 call apply bind 这些方法去改变 this 的指向
*/
function foo() {
  setTimeout(() => {
    console.log('args: ' + arguments)
  }, 1000)
}
foo(2, 4, 6, 8) // args: [object Arguments], 指向外层函数的 arguments

/*
  箭头函数不适用场合
  第一: 定义对象的方法, 且该方法内部包含 this
  第二: 需要动态 this 的时候, 也不应该使用 箭头函数
*/
const cat = {
  lives: 9,
  // 错误, 此时, this 将指向全局作用域, 因为对象不构成单独的作用域, 导致 jumps 箭头函数定义时的作用域就是全局作用域
  jumps: () => {
    this.lives--
  },
}

var button = document.getElementById('press')
// button 的监听函数是一个箭头函数, 导致里面的 this 就是全局对象, 如果改成普通函数, this 就会动态指向被点击的按钮对象
button.addEventListener('click', () => {
  this.classList.toggle('on')
})

/*
  数组实例的 entries() keys() 和 values 遍历数组, 都返回一个遍历器对象, 可以用 for ... of 进行遍历
  keys 对键名
  values 对键值
  entries 对键值对
*/
for (const index of ['a', 'b'].keys()) {
  console.log(index)
}
for (const elem of ['a', 'b'].values()) {
  console.log(elem)
}
for (const [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem)
}
console.log(['a', 'b'].entries()) // 返回的是一个遍历器对象, Object [Array Iterator] {}

/* 数组实例的 includes() 表示某个数组是否包含给定的值 */
console.log([1, 2, 3].includes(2)) // true
console.log([1, 2, 3].includes(4)) // false
console.log([1, 2, NaN].includes(NaN)) // true 可以正确识别 NaN
// 第二个参数表示起始位置, 默认为 0
console.log([1, 2, 3].includes(3, 3)) // false
// 可以替代掉 indexOf 方法, indexOf 会误判 NaN indexOf 不够直观
console.log([NaN].indexOf(NaN)) // -1
console.log([NaN].includes(NaN)) // true

/*
  flat flatMap 将嵌套的数组拉平, 多维 => 一维
  返回一个新数组, 对原数组无影响

  flat 默认拉平一层, 可以接收一个参数(number)拉平多层(嵌套)

  flatMap 只能展开一层, 先 map 后 flat
*/
console.log([1, 2, [3, 4]].flat()) // [ 1, 2, 3, 4 ]
console.log([1, 2, [3, [4, 5]]].flat(2)) // [ 1, 2, 3, 4, 5 ]
// 不管多少层, 通通拉平, 使用 Infinity
console.log([1, [2, [3]]].flat(Infinity)) // [ 1, 2, 3 ]

// flat 跳过数组空位(删除数组空位)
console.log([1, 2, , , 3, 5].flat()) // [ 1, 2, 3, 5 ]

console.log([2, 3, 4].flatMap((x) => [x, x * 2])) // [ 2, 4, 3, 6, 4, 8 ]
// 相当于
console.log(
  [
    [2, 4],
    [3, 6],
    [4, 8],
  ].flat(),
)

/*
  数组的空位, [,,]
  空位不是 undefined, 一个位置的值等于 undefined 依然是有值的, 空位是没有任何值
  es5 对空位的处理非常不一致, es6 明确将数组的空位转为 undefined
  由于空位的处理规则非常不统一, 建议避免出现空位
*/
console.log(0 in [undefined, undefined, undefined]) // true
console.log(0 in [, , ,]) // false
