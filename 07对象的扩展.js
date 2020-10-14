// es 6 允许在大括号里面直接写入变量和函数
const foo = 'bar'
const baz = { foo }
console.log(baz) // { foo: 'bar' }
// 等同于
const baz = { foo: foo }

function f(x, y) {
  return { x, y }
}
// 等同于
function f(x, y) {
  return { x: x, y: y }
}
console.log(f(1, 2)) // { x: 1, y: 2 }

/*
  方法简写
*/
const o = {
  method() {
    return 'Hello!'
  },
}
// 等同于
const o = {
  method: function () {
    return 'Hello!'
  },
}

// 实际的例子
let birth = '2000/01/01'
const Person = {
  name: '张三',
  // birth: birth
  birth,
  // hello: function()...
  hello() {
    console.log('我的名字是, ' + this.name)
  },
}
// 用于函数的返回值, 非常方便
function getPoint() {
  const x = 1
  const y = 10
  return { x, y }
}
console.log(getPoint()) // { x: 1, y: 10 }

/*
  CommonJs 输出一组变量, 非常适合使用简洁写法
*/

let ms = {}
function getItem(key) {
  return key in ms ? ms[key] : null
}
function setItem(key, value) {
  ms[key] = value
}
function clear() {
  ms = {}
}
module.exports = { getItem, setItem, clear }
// 等同于
module.exports = { getItem: getItem, setItem: setItem, clear: clear }

/*
  属性的赋值器(setter)和取值器(getter) 事实上也是采用这种写法

*/
const cart = {
  _wheels: 4,
  get wheels() {
    return this._wheels
  },
  set wheels(value) {
    if (value < this._wheels) {
      throw new Error('数值太小了!')
    }
    this._wheels = value
  },
}

/*
  简写的对象方法不能用于构造函数, 会报错
*/
const obj = {
  // 简写, 不能当做构造函数使用
  f() {
    this.foo = 'bar'
  },
}
console.log(new obj.f()) // TypeError: obj.f is not a constructor

// 属性名表达式, es6 允许使用表达式作为对象的属性名, [表达式]: 属性值
let propKey = 'foo'
let obj = {
  [propKey]: true,
  ['a' + 'bc']: 123,
}

let lastword = 'last word'
const a = {
  'first word': 'hello',
  [lastword]: 'world',
}
console.log(a['first word']) // hello
console.log(a['last word']) // world
console.log(a[lastword]) // world

/*
  属性的可枚举性和遍历
  属性的描述对象
  Object.getOwnPropertyDescriptor()
*/
let obj = { foo: 123 }
// { value: 123, writable: true, enumerable: true, configurable: true }
console.log(Object.getOwnPropertyDescriptor(obj, 'foo'))
/*
  忽略掉 enumerable 为 false 的属性的四个操作
  for...in 自身 + 继承 + 可枚举
  Object.keys() 自身 + 可枚举
  JSON.stringify() 自身 + 可枚举
  Object.assign() 自身 + 可枚举

  使用 Object.keys() 代替掉 for ... in
*/
console.log(
  Object.getOwnPropertyDescriptor(Object.prototype, 'toString').enumerable,
) // false
console.log(Object.getOwnPropertyDescriptor([], 'length').enumerable) // false

// es6 规定, 所有 Class 的原型的方法都是不可枚举的
console.log(
  Object.getOwnPropertyDescriptor(
    class {
      foo() {}
    }.prototype,
    'foo',
  ).enumerable,
) // false

/*
  super 关键字, 指向当前对象的原型对象
*/
const proto = {
  foo: 'hello',
}
const obj = {
  foo: 'world',
  find() {
    return super.foo
  },
}
// 将 proto 设置为 obj 的原型对象, 这样 obj 也就继承了 find 函数, 其中函数内的 super 关键字指向当前对象的原型对象(也就是 proto 本身)
Object.setPrototypeOf(obj, proto)
console.log(obj.find()) // "hello"
/*
  super 关键字表示原型对象时, 只能用在对象的方法之中, 用在其他地方都会报错
*/
const obj = {
  foo: super.foo,
} // 报错, 用在 obj 对象的属性里面 SyntaxError: 'super' keyword unexpected here

const obj = {
  foo: () => {
    super.foo
  },
} // 报错 SyntaxError: 'super' keyword unexpected here

const obj = {
  foo: function () {
    return super.foo
  },
} // 还是报错 SyntaxError: 'super' keyword unexpected here

/*
  记住: 目前, 只有对象方法的简写法可以让 JavaScript 引擎确认, 定义的是对象的方法
*/
const obj = {
  foo() {
    return super.foo
  },
}

/*
  super 的本质
  Object.getPrototypeOf(this).foo // 原型对象的 foo 属性(往往是一个函数)
  或
  Object.getPrototypeOf(this).foo.call(this) // (foo 函数存在 this), this 绑定的运行环境还是当前对象而非原型对象
*/

const proto = {
  x: 'hello',
  foo() {
    console.log(this.x)
  },
}
const obj = {
  x: 'world',
  foo() {
    super.foo()
  },
}
Object.setPrototypeOf(obj, proto)
obj.foo() // "world" super.foo 指向原型对象 proto 的foo 方法, 但是绑定的 this 还是当前函数(执行环境还是 obj)因此取到的 x 值为 "world"

/*
  对象的扩展运算符 es2018 引入到了对象
*/
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 }
console.log(x) // 1
console.log(y) // 2
console.log(z) // { a: 3, b: 4 } 扩展运算符将获取等号右边的所有未读取的键(a b), 将它们的值一并拷贝到一个新对象中({})

/*
  对象的解构赋值 + 扩展运算符
  等号右边是 undefined 和 null 就会报错, 因为它们无法转为对象
*/
// let { ...z } = null // SyntaxError: Identifier 'z' has already been declared
// let { ...z } = undefined

// 扩展运算符必须放在最后
// let {...x, y, z} = {x:1, y:2, z:3} // 句法错误

/*
  解构赋值的拷贝是浅拷贝, 也就是说一个键的值是复合类型(数组, 对象, 函数), 那么解构赋值拷贝的是这个值的引用(地址), 而不是这个值的副本(地址的拷贝)
*/
let obj = { a: { b: 1 } }
let { ...x } = obj
obj.a.b = 2
console.log(x.a.b) // 2 浅拷贝

/*
  扩展运算符的解构赋值, 不能复制继承自原型对象的属性
*/
let o1 = { a: 1 }
let o2 = { b: 2 }
o2.__proto__ = o1
let { ...o3 } = o2
console.log(o2.a) // 1
console.log(Object.getPrototypeOf(o2)) // { a: 1 } o2 的原型是 o1
console.log(o3) // { b: 2 } 没有复制 o2 继承自原型对象 o1 的属性 a
console.log(o3.a) // undefined
console.log(Object.getPrototypeOf(o3)) // {}, 没有继承原型 o1 而是变成了一个普通函数继承 {} Object

const o = Object.create({ x: 1, y: 2 })
o.z = 3
let { x, ...newObj } = o // 变量 x 只是单纯的解构赋值, 可以读取到对象 o 继承的属性
let { y, z } = newObj // 变量 y z 是扩展运算符的解构赋值, 只能读取对象 o 自身的属性, 所以变量 z 可以赋值成功(因为 z 是自身的属性而非继承得来)
console.log(x) // 1
console.log(y) // undefined y 是对象 o 从 {x:1, y:2} 继承得来, 扩展运算符的解构赋值无法取得, 因此 undefined
console.log(z) // 3

/*
  扩展运算符的解构赋值, 可以扩展某个函数的参数, 引入其他操作(丰富原函数的功能)
*/
function baseFunction({ a, b }) {
  // ...
}
function wrapperFunction({ x, y, ...restConfig }) {
  // 使用 x 和 y 参数进行操作
  // 将其余参数传递给原始函数
  return baseFunction(restConfig)
}

/*
  扩展运算符, 提取参数对象的所有可遍历属性, 拷贝到当前对象之中
  自身 + 可遍历
  不继承原来的原型对象, 而是继承 {} Object 普通对象
*/
let z = { a: 3, b: 4 }
let n = { ...z }
console.log(n) // { a: 3, b: 4 }
console.log(n === z) // false
// 数组是特殊的对象, 因此对象的扩展运算符也可以用于数组
let foo = { ...['a', 'b', 'c'] }
console.log(foo) // { '0': 'a', '1': 'b', '2': 'c' }
console.log(foo.length) // undefined 由于数组的 length 属性不可遍历, 因此扩展运算符无法克隆 length 属性, 因此无定义

// 扩展运算符后面不是对象, 自动将其转为对象
console.log({ ...1 }) // {} 1 => Number{1}, 由于该对象没有自身属性, 所以返回一个空对象
console.log({ ...true }) // {}
console.log({ ...undefined }) // {}
console.log({ ...null }) // {}

/* 扩展运算符后面是字符串, 字符串自动转成一个类数组 */
console.log(...'hello') // h e l l o 字符串部署了 iterator 接口(Symbol.iterator)
console.log({ ...'hello' }) // { '0': 'h', '1': 'e', '2': 'l', '3': 'l', '4': 'o' }

/* 对象的扩展运算符等同于使用 Object.assign() 方法 */
let aClone = { ...a }
// 等同于
let aClone = Object.assign({}, a)
// 仅仅拷贝了对象实例的属性(自身), 想要完整克隆一个对象, 还要拷贝对象原型的属性
/*
  完整克隆
  三种写法
*/
const clone1 = {
  // 克隆原型对象
  __proto__: Object.getPrototypeOf(obj),
  // 克隆对象实例的属性(自身)
  ...obj,
}

const clone2 = Object.assign(Object.create(Object.getPrototypeOf(obj)), obj)

const clone3 = Object.create(
  Object.getPrototypeOf(obj),
  // 所有的属性(完整, 具有相同的属性描述对象)
  Object.getOwnPropertyDescriptors(obj),
)

// 扩展运算符可以合并两个对象
let ab = { ...a, ...b }
// 等同于
let ab = Object.assign({}, a, b)

/* 用户自定义的属性, 放在扩展运算符后面, 则扩展运算符内部的同名属性将被覆盖掉 */
let aWithOverrides = { ...a, x: 1, y: 2 } // a 中同名的 x, y 将被覆盖
let aWithOverrides = { ...a, ...{ x: 1, y: 2 } } // a 中同名的 x, y 将被覆盖
// 借助次特性, 用来修改现有对象的部分属性非常方便, 直接覆盖掉就好了
let newVersion = {
  ...previousVersion,
  name: 'New Name', // override the name property newVersion 自定义了 name 属性
}
/* 取值函数 get 在扩展运算符扩展一个对象的时候会自动执行 */
let a = {
  get x() {
    throw new Error('not throw yet')
  },
}
let aWithGetter = { ...a } // Error: not throw yet


