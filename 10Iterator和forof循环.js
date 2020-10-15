/*
  遍历器 Iterator 一种统一的接口机制, 来处理所有不同的数据结构(Object Array Map Set)
  任何数据结构只要部署 Iterator 接口, 就可以完成遍历操作(依次处理该数据结构的所有成员)

  为各种数据结构, 提供一个统一的简便的访问接口
  使得数据结构的成员能够按照某种次序排列
  创造了一种新的遍历命令 for of 循环, Iterator接口主要供 for of 消费
*/

/*
  Iterator 的遍历过程
    1.创建一个指针对象, 指向当前数据结构的起始位置, 遍历器对象本质上, 就是一个指针对象
    2.第一次调用指针对象的 next 方法, 可以将指针指向数据结构的第一个成员
    3.第二次调用指针对象的 next 方法, 可以将指针指向数据结构的第二个成员
    4.不断调用指针对象的 next 方法, 直到它指向数据结构的结束位置
  每一次调用 next 方法, 都会返回数据结构的当前成员信息, 具体而言, 就是返回一个包含 value 和 done 两个属性的对象
  value 属性就是当前成员的值, done 属性是一个布尔值, 表示遍历是否结束
  next() 方法移动指针, 指向下一个成员
  done 属性, 是否还有必要调用一次 next 方法
*/

// 模拟 next(), 遍历器生成函数, 返回一个遍历器对象
function makeIterator(array) {
  var nextIndex = 0
  return {
    next: function () {
      return nextIndex < array.length
        ? { value: array[nextIndex++], done: false }
        : { value: undefined, done: true }
    },
  }
}
var it = makeIterator(['a', 'b'])
console.log(it.next()) // { value: 'a', done: false }
console.log(it.next()) // { value: 'b', done: false }
console.log(it.next()) // { value: undefined, done: true }

/* 遍历器和它所遍历的那个数据结构, 实际上是分开的, 完全可以写出没有对应数据结构的遍历器对象 */
// 遍历器自己描述了一个数据结构
var it = idMaker()
it.next().value
it.next().value
it.next().value

function idMaker() {
  var index = 0
  return {
    next: function () {
      return { value: index++, done: false }
    },
  }
}

/*
  使用 for...of 循环遍历某种数据结构时, 该循环会自动去寻找 Iterator 接口
  默认的 Iterator 接口部署在数据结构的 Symbol.iterator 属性
  一个数据结构只要有 Symbol.iterator 属性, 就可以认为是 "可遍历的"
  Symbol.iterator 本身就是一个函数, 就是当前数据结构的默认的遍历器生成函数, 执行这个函数返回一个遍历器
*/

const obj = {
  [Symbol.iterator]: function () {
    return {
      next: function () {
        return {
          value: 1,
          done: true,
        }
      },
    }
  },
}
// 执行 Symbol.iterator 的时候, 将返回一个遍历器对象, 这个对象的特征就是具有 next() 方法, 每次调用 next() 方法, 都会返回一个代表当前成员的信息对象, 具有 value 和 done 两个属性

/*
  原生具有 Iterator 接口(ES6), 不用任何处理, 就可以被 for...of 循环遍历, 原因在于, 这些数据结构原生就部署了 Symbol.iterator 属性
  Array
  Map
  Set
  String
  TypedArray
  函数的 arguments 对象
  NodeList 对象
*/
let arr = ['a', 'b', 'c']
// iter 是一个遍历器对象, 特征就是具有 next() 方法, 每次调用 next() 方法, 都会返回一个代表当前成员的信息对象, 包含 value 和 done 两个属性
let iter = arr[Symbol.iterator]()
console.log(iter.next()) // { value: 'a', done: false }
console.log(iter.next()) // { value: 'b', done: false }
console.log(iter.next()) // { value: 'c', done: false }
console.log(iter.next()) // { value: undefined, done: true }

/*
  没有原生 Iterator 接口的数据结构(对象), 需要自己在 Symbol.iterator 属性上面部署, Iterator 接口, 这样才会被 for...of 循环遍历
  本质上, 遍历器是一种线性处理, 对于任何非线性的数据结构, 部署遍历器接口, 就等于部署一种线性转换
  严格说, 对象部署遍历器接口并不是很必要, 因为这时对象实际上被当做 Map 结构使用
*/

/* 通过遍历器实现指针结构 */
function Obj(value) {
  this.value = value
  this.next = null
}
// 在构造函数的原型链上部署 Symbol.iterator 方法
Obj.prototype[Symbol.iterator] = function () {
  var iterator = { next: next }

  var current = this
  function next() {
    if (current) {
      // 自动将指针移动到下一个实例
      var value = current.value
      // 递归, 进入下一步, 指针越过成员, 返回成员的信息对象, 包含 value 和 done 两个属性
      current = current.next
      return { done: false, value: value }
    } else {
      return { done: true }
    }
  }
  return iterator
}
var one = new Obj(1)
var two = new Obj(2)
var three = new Obj(3)

one.next = two
two.next = three

for (const i of one) {
  console.log(i)
}
/*
  1
  2
  3
*/

// 为对象添加 Iterator 接口的例子
let obj = {
  data: ['hello', 'world'],
  [Symbol.iterator]() {
    const self = this
    let index = 0
    return {
      next() {
        if (index < self.data.length) {
          return {
            value: self.data[index++],
            done: false,
          }
        } else {
          return { value: undefined, done: true }
        }
      },
    }
  },
}

/*
  对于类似数组的对象, 部署 Iterator 接口, 存在一个简便的方法, 使用 Symbol.iterator 方法直接引用数组的 Iterator 接口
*/
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]
// 或者
NodeList.prototype[Symbol.iterator] = [][Symbol.iterator]
// 执行遍历
console.log([...document.querySelectorAll('div')])

let iterable = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator],
}
/*
  a
  b
  c
*/
for (const item of iterable) {
  console.log(item)
}

// Symbol.iterator 方法对应的不是遍历器生成函数, 解释引擎就会报错
var obj = {}
obj[Symbol.iterator] = () => 1
console.log([...obj]) // TypeError: Result of the Symbol.iterator method is not an object

/*
  调用 Iterator 接口的场合
  1.解构赋值
  2.扩展运算符
  3.yield*
  4.其他场合
*/
// 对 Array 和 Set 结构进行解构赋值时, 会默认调用 Symbol.iterator 方法
let set = new Set().add('a').add('b').add('c')
// 解构赋值(不完全)
let [x, y] = set
console.log(x) // a
console.log(y) // b
let [first, ...rest] = set
console.log(first) // a
console.log(rest) // [ 'b', 'c' ]

// 扩展运算符 ... 会调用默认的 Iterator 接口
var str = 'hello'
console.log([...str]) // [ 'h', 'e', 'l', 'l', 'o' ]

let arr = ['b', 'c']
console.log(['a', ...arr, 'd']) // [ 'a', 'b', 'c', 'd' ]

/* 可以将任何部署了 Iterator 接口的数据结构, 转为数组, 利用扩展运算符 */
let arr = [...iterable]

/*
  对于任何接受数组作为参数的场合, 其实都调用了遍历器接口
  for...of
  Array.from
  Map() Set()
  Promise.all()
  Promise.race()
*/

/*
  遍历器对象的 return() 和 throw()
  如果 for...of 循环提前退出(break 或者出错), 调用 return 方法, 一个对象在完成遍历之前, 需要清除或释放资源, 部署 return 方法
*/
function readLinesSync(file) {
  return {
    [Symbol.iterator]() {
      return {
        next() {
          return {
            done: false,
          }
        },
        // return() 方法, 必须返回一个对象
        return() {
          file.clos()
          return {
            done: true,
          }
        },
      }
    },
  }
}

// 触发 return() 方法
for (const line of readLinesSync(fileName)) {
  console.log(line)
  break // 提前退出循环, 调用 return 方法
}
for (const line of readLinesSync(fileName)) {
  console.log(line)
  throw new Error() // 出错, 提前退出循环, 调用 return 方法
}

/*
  for of 循环, 遍历所有数据结构的统一的方法
  for...of 循环内部调用的是数据结构的 Symbol.iterator 方法
  数组 Map Set 某些类数组对象(arguments NodeList) Generator 以及 字符串
*/
const arr = ['red', 'green', 'blue']
for (const v of arr) {
  console.log(v)
}
const obj = {}
obj[Symbol.iterator] = arr[Symbol.iterator].bind(arr)
/*
  red
  green
  blue
*/
for (const v of obj) {
  console.log(v)
}

/* 使用 for...of 替代数组实例的 forEach 方法 */
const arr = ['red', 'green', 'blue']

arr.forEach((element, index) => {
  console.log(element)
  console.log(index)
})

// for...of 允许遍历获得键值
var arr = ['a', 'b', 'c', 'd']
/*
0
1
2
3
*/
for (const a in arr) {
  if (arr.hasOwnProperty(a)) {
    console.log(a)
  }
}
for (const a of arr) {
  console.log(a)
}

/*
  Set Map 原生具有 Iterator 接口, 可以直接使用 for...of 循环
  Set 结构遍历时, 返回的是一个值
  Map 结构遍历时, 返回的是一个数组, 该数组的两个成员分别为当前 Map 成员的键名和键值
  遍历的顺序是按照各个成员被添加进数组结构的顺序
*/
let map = new Map().set('a', 1).set('b', 2).set('c', 3)
/*
[ 'a', 1 ]
[ 'b', 2 ]
[ 'c', 3 ]
*/
for (const pair of map) {
  console.log(pair)
}

/*
a: 1
b: 2
c: 3
*/
for (const [key, value] of map) {
  console.log(key + ': ' + value)
}

/* entries keys values 在现有数据结构的基础上, 计算生成的 Array Map Set */
let arr = ['a', 'b', 'c']
for (const pair of arr.entries()) {
  console.log(pair)
}

/* 普通对象 + for...of + Object.keys() 遍历对象 */
let es6 = {
  edition: 6,
  committee: 'TC39',
  standard: 'ECMA-262',
}
for (const e in es6) {
  console.log(e)
}
for (const e of es6) {
  console.log(e)
} // TypeError: es6 is not iterable

let es6 = {
  edition: 6,
  committee: 'TC39',
  standard: 'ECMA-262',
}
/*
edition: 6
committee: TC39
standard: ECMA-262
*/
for (const key of Object.keys(es6)) {
  console.log(key + ': ' + es6[key])
}

/*
  遍历语法大比拼!!!
  原始 for
    太过麻烦
  数组内置 forEach
    无法中途跳出 forEach循环, break 或者 return 语句都不能奏效
  for...in (对象专用, 注意原型上的键也会被遍历)
    数组的键名是数字, 但是 for...in 循环以字符串作为键名 "0" "1" "2" 等
    不仅仅遍历数字键名, 还会遍历手动添加的其他键, 甚至包括原型链上的键
    某些情况下, for...in 任意顺序遍历键名
    不适用于遍历数组
  for...of
    简洁, 没有 for...in 的缺点
    不同于 forEach 它可以与 break continue return 配合使用
    提供了遍历所有数据结构的统一操作接口
*/
