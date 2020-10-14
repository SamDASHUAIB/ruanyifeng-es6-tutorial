// 扩展运算符, ... 好比是 rest 参数(...变量名的形式)的逆运算, 将一个数组转为用逗号分隔的参数列表
console.log(...[1, 2, 3]) // 1 2 3
console.log(1, ...[2, 3, 4], 5) // 1 2 3 4 5

/*
  扩展运算符主要用于函数调用
*/
// 函数的参数列表里的 ...items 是一个 rest 参数, 用于获取函数的多余参数, 可以替代 arguments 对象, 是一个数组, 将多余的参数放入数组中
function push(array, ...items) {
  // 此处的 ...items 是将 rest 参数(items 数组) 展开, 是扩展运算符
  array.push(...items)
}
function add(x, y) {
  return x + y
}
const numbers = [4, 38]
add(...numbers) // 扩展运算符将一个数组, 变成参数序列
/*
  只有函数调用时, 扩展运算符才可以放在圆括号里面, 否则报错
*/
// (...[1, 2]) // SyntaxError: Unexpected token '...'

// console.log((...[1, 2])) // 报错
console.log(...[1, 2]) // 正确, 函数调用 + 扩展运算符

/*
  替代函数的 apply 方法
*/
// es5
function f(x, y, z) {}
// 将数组转为函数的参数
var args = [0, 1, 2]
f.apply(null, args)

// es6
function f(x, y, z) {}
let args = [0, 1, 2]
// 直接使用扩展运算符将数组展开为函数的参数(列表)
f(...args)

// es5
Math.max.apply(null, [14, 3, 77])
// es6
Math.max(...[14, 3, 77])
// 等同于
Math.max(14, 3, 77)

// 将一个数组添加到另一个数组的尾部
var arr1 = [0, 1, 2]
var arr2 = [3, 4, 5]
// push 方法的参数不能是数组, 因此在 es5 中只能通过 apply 方法变通使用 push 方法
Array.prototype.push.apply(arr1, arr2)

// es6
let arr1 = [0, 1, 2]
let arr2 = [3, 4, 5]
// 由于 push 方法的参数不能是数组, 因此使用扩展运算符将数组展开为参数
arr1.push(...arr2)

/*
  扩展运算符的应用
  1. 复制数组
  2. 合并数组
  3. 与解构赋值结合
  4. 将字符串(类数组)转为真正的数组
  5. 实现了 Iterator 接口的对象
*/
// 直接复制, 仅仅复制了一个指向底层数组的指针, 而不是克隆一个全新的数组(一个新的底层数组, 而非指针)
const a1 = [1, 2]
const a2 = a1

a2[0] = 2
console.log(a1[0]) // 2 改动 a2 数组 a1 也跟着改动

// es5
const a1 = [1, 2]
const a2 = a1.concat()
a2[0] = 2
console.log(a1[0]) // 1

// es6
const a1 = [1, 2]
const a2 = [...a1]
a2[0] = 2
console.log(a1[0]) // 1

const arr1 = ['a', 'b']
const arr2 = ['c']
const arr3 = ['d', 'e']
// es5 合并数组
console.log(arr1.concat(arr2, arr3)) // [ 'a', 'b', 'c', 'd', 'e' ]

// es6 合并数组 拆开 + 使用 [] 括起来
console.log([...arr1, ...arr2, ...arr3]) // [ 'a', 'b', 'c', 'd', 'e' ]

// 注意: 以上都是浅拷贝(数组里面的对象成员复制的还是指向底层对象的指针)
const a1 = [{ foo: 1 }]
const a2 = [{ bar: 2 }]
const a3 = a1.concat(a2)
const a4 = [...a1, ...a2]
console.log(a3[0] === a1[0]) // true
console.log(a4[0] === a1[0]) // true

/*
  扩展运算符 + 解构赋值 = 生成数组
*/
const [first, ...rest] = [1, 2, 3, 4, 5]
console.log(first) // 1
console.log(rest) // [ 2, 3, 4, 5 ]

const [first, ...rest] = ['foo']
console.log(first) // 'foo'
console.log(rest) // []

const [first, ...rest] = []
console.log(first) // undefined
console.log(rest) // []

// 扩展运算符用于数组赋值, 只能放在最后一位, 否则报错
// const [...butLast, last] = [1,2, 3, 4, 5] // SyntaxError: Rest element must be last element
// const [first, ...middle, last] = [1,2, 3, 4, 5] // SyntaxError: Rest element must be last element

console.log([...'hello']) // [ 'h', 'e', 'l', 'l', 'o' ]

/*
  任何实现了 Iterator 接口的对象, 都已用扩展运算符转为真正的数组
*/
let nodeList = document.querySelectorAll('div') // 类数组, NodeList 对象实现了 Iterator 接口, 可以使用扩展运算符
let array = [...nodeList]
/*
  没有部署 Iterator 接口的类似数组的对象, 不可以使用扩展运算符将其转为真正的数组
*/
let arrayLike = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
}
let arr = [...arrayLike] // TypeError: object is not iterable (cannot read property Symbol(Symbol.iterator))
// 改用 Array.from 方法将 arrayLike 转为真正的数组
let arrayLike = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
}
console.log(Array.from(arrayLike)) // [ 'a', 'b', 'c' ]

/*
  扩展运算符, 内部调用的是数据结构的 Iterator 接口, 因此只有具有 Iterator 接口的对象,都可以使用扩展运算符
  Map Set Generator函数
*/
let map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
])
let arr = [...map.keys()]
console.log(arr) // [ 1, 2, 3 ]

// Array.from 方法用于将两类对象转为真正的数组, 类似数组的对象(NodeList 集合, arguments 对象), 和可遍历的对象(Iterator 接口)
let arrayLike = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
}
// es5
var arr1 = [].slice.call(arrayLike)
// es6
let arr2 = Array.from(arrayLike)

// NodeList 集合
let ps = document.querySelectorAll('p')
Array.from(ps).filter((p) => {
  return p.textContent.length > 100
})
// arguments 对象
function foo() {
  var args = Array.from(arguments)
}
// 部署了 Iterator 接口的数据结构
Array.from('hello')

let namesSet = new Set(['a', 'b', 'b'])
console.log(Array.from(namesSet)) // [ 'a', 'b' ]

// 如果参数是一个真正的数组, Array.from 将返回一个一模一样的数组
let arr = [1, 2, 3]
console.log(Array.from(arr))
console.log(arr === Array.from(arr)) // false, 不一样的内存地址

let arr = new Array(1, 2, 3)
console.log(arr) // [ 1, 2, 3 ]
console.log(Array.from(arr)) // [ 1, 2, 3 ]
console.log(arr === Array.from(arr)) // false

/*
  扩展运算符(...): 实质是调用遍历器接口(Symbol.iterator), 如果一个对象没有部署这个接口, 就无法转换
  Array.from: 支持函类似数组的对象(本质特征只有一个, 必须有 length 属性) + 具有遍历器接口的对象(Symbol.iterator)
*/
console.log(Array.from({ length: 3 })) // [ undefined, undefined, undefined ]

console.log([...{ length: 3 }]) // TypeError: console.log is not iterable (cannot read property Symbol(Symbol.iterator))

// 对于没有部署 Array.from 方法的浏览器, 可以使用 slice 进行替代
const toArray = (() => {
  Array.from ? Array.from : (obj) => [].slice.call(obj)
})()

/*
  Array.from() 可以将各种值转为真正的数组, 并且还提供 map 功能(第二个参数(处理逻辑), 类似于 map)
*/

/*
  Array.of() 可以替代 Array() 或者 new Array(), 行为非常统一
  总是返回由参数值组成的数组, 如果没有参数, 就返回一个空数组
*/
// 模拟 Array.of()
function ArrayOf() {
  return [].slice.call(arguments)
}

/*
  数组实例的 find() 和 findIndex()
  find 找出第一个符合条件的数组成员, 参数是一个回调函数,
  所有的数组成员都依次执行该回调函数, 直到找出第一个返回值为 true 的成员, 然后返回该成员, 全为 false 返回 undefined
  findIndex 返回第一个符合条件的数组成员的位置, 没有, 返回 -1
*/
console.log([1, 4, -5, 10].find((n) => n < 0)) // -5
console.log(
  [1, 5, 10, 15].find(function (value, index, arr) {
    return value > 9
  }),
) // 第一个大于 9 的数

// findIndex
console.log(
  [1, 5, 10, 15].findIndex(function (value, index, arr) {
    return value > 9
  }),
) // 第一个大于 9 的数在数组中的位置 2

// 均接收第二个参数, 绑定回调函数的 this 对象
function f(v) {
  // 使用了 this 需要考虑环境
  return v > this.age
}
let person = { name: 'John', age: 20 }
// 绑定 person 运行环境
console.log([10, 12, 26, 15].find(f, person)) // 26 第一个大于 age 的数
