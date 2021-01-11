/*
  ES6 的 class 可以看做是一个语法糖
  新的 class 写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已
*/
// es5
function Point(x, y) {
  this.x = x
  this.y = y
}
Point.prototype.toString = function () {
  return '(' + this.x + this.y + ')'
}
var p = new Point(1, 2)

// es6, 完全可以看做是构造函数的另一种写法
class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  toString() {
    return '(' + this.x + this.y + ')'
  }
}
var p = new Point(1, 2)

class Point {}
console.log(typeof Point) // function class 的数据类型就是函数
console.log(Point === Point.prototype.constructor) // true 类本身就指向构造函数
/* class 的所有方法都定义在类的 prototype 属性上面 */
class Point {
  constructor() {}
  toString() {}
  toValue() {}
}
// 等同于
Point.prototype = {
  constructor() {},
  toString() {},
  toValue() {},
}
/* 在类的实例上面调用方法, 其实就是调用原型上的方法 */
class B {}
let b = new B()
console.log(b.constructor === B.prototype.constructor) // true, b 是 class B 的实例, 它的 constructor 方法就是 B 类原型的 constructor 方法

/* 类的内部所有定义的方法, 都是不可枚举的, 这一点与 es5 的行为不一致 */
class Point {
  constructor(x, y) {
    // ...
  }
  toString() {
    // ...
  }
}
console.log(Object.keys(Point.prototype)) // []
console.log(Object.getOwnPropertyNames(Point.prototype)) // [ 'constructor', 'toString' ]

// es5
var Point = function (x, y) {
  //...
}
Point.prototype.toString = function () {}
console.log(Object.keys(Point.prototype)) // [ 'toString' ] es5 的写法, toString 就是可枚举的
console.log(Object.getOwnPropertyNames(Point.prototype)) // [ 'constructor', 'toString' ]

/* constructor class 的默认方法, 通过 new 命令生成对象实例时, 自动调用该方法, 一个类必须有 constructor 方法, 如果没有显式的定义, 一个空的 constructor 方法会被默认添加 */
class Point {}
// 等同于
class Point {
  constructor() {}
}

/* constructor 方法默认返回实例对象(this), 完全可以指定返回另外一个对象 */
class Foo {
  constructor() {
    return Object.create(null) // 可以返回一个跟 Foo 压根没关系的对象
  }
}
console.log(new Foo() instanceof Foo) // false
/* 类必须使用 new 调用, 否则报错 */

/* 实例的属性除非显式定义在其本身上(this 对象上), 否则都是定义在原型上(class 上) */
class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  toString() {
    return '(' + this.x + ', ' + this.y + ')'
  }
}
var point = new Point(2, 3)
console.log(point.toString()) // (2, 3)
console.log(point.hasOwnProperty('x')) // true
console.log(point.hasOwnProperty('y')) // true
console.log(point.hasOwnProperty('toString')) // false
console.log(point.__proto__.hasOwnProperty('toString')) // true

/* 所有实例共享一个原型对象 */
var p1 = new Point(2, 3)
var p2 = new Point(3, 2)
console.log(p1.__proto__ === p2.__proto__) // true

/* 可以通过实例的 __proto__ 属性为 class 添加方法, 不建议使用 __proto__ 属性, 使用 Object.getPrototypeOf 进行替代 */

/* 与 es5 一样, 在 "类" 的内部可以使用 get 和 set 关键字, 对某个属性设置存值函数和取值函数, 拦截该属性的存取行为 */
class MyClass {
  constructor() {}
  get prop() {
    return 'getter'
  }
  set prop(value) {}
}
let inst = new MyClass()
inst.prop = 123 // setter: 123
console.log(inst.prop) // getter

// 存值和取值函数是设置在属性的 Descriptor 属性上面的

// class 表达式, Me 只在 class 内部可以使用(指代当前 class)
const MyClass = class Me {
  getClassName() {
    return Me.name
  }
}
let inst = new MyClass()
console.log(inst.getClassName()) // Me
console.log(Me.name) // ReferenceError: Me is not defined

/*
  this 的指向问题
  this 默认指向类的实例, 但是一旦 class 中的方法, 单独拿出来使用, 此时 this 会指向 undefined(严格模式)
*/
class Logger {
  printName(name = 'there') {
    this.print(`Hello ${name}`)
  }

  print(text) {
    console.log(text)
  }
}
const logger = new Logger()
// 解构赋值
const { printName } = logger

/* 单独使用, this 会指向该方法运行时所在的环境, 由于 class 内部是严格模式, 所以 this 实际指向的是 undefined */
printName() // TypeError: Cannot read property 'print' of undefined

/* 解决方案一: 在构造函数中绑定 this */
class Logger {
  constructor() {
    this.printName = this.printName.bind(this)
  }
}
/* 解决方案二: 使用箭头函数 */
class Obj {
  constructor() {
    this.getThis = () => this
  }
}
const myObj = new Obj()
console.log(myObj.getThis() === myObj) // true 箭头函数的 this 总是指向定义时所在的对象, 箭头函数位于构造函数内部, 它生效的时候, 是在执行构造函数的时候, 这时, 箭头函数所在的运行环境, 肯定是实例对象, 所以 this 总是指向实例对象

/*
  静态方法, 方法名前面加上一个 static 关键字, 表示该方法不会被实例继承, 而是直接通过类来调用, 就称为 "静态方法"
  只能通过 class 进行调用
  静态方法如果包含 this 关键字, 这个 this 指的是类, 而不是实例
*/
class Foo {
  static classMethod() {
    return 'hello'
  }
}
Foo.classMethod() // "hello"

var foo = new Foo()
foo.classMethod() // TypeError: foo.classMethod is not a function

class Foo {
  static bar() {
    this.baz()
  }
  // 静态方法可以与非静态方法重名
  static baz() {}
  baz() {}
}
Foo.bar() // hello 说明, this 关键字指向 class 而非实例

/* 父类的静态方法, 可以被子类继承 */
class Foo {
  static classMethod() {
    return 'hello'
  }
}
class Bar extends Foo {}
console.log(Bar.classMethod()) // hello

/* 静态方法可以从 super 对象上调用 */
class Foo {
  static classMethod() {
    return 'hello'
  }
}
class Bar extends Foo {
  static classMethod() {
    // 从 super 对象上调用父类的 static 方法
    return super.classMethod() + ', too'
  }
}
console.log(Bar.classMethod()) // hello, too

/*
  私有方法和私有属性, 只能在类的内部访问的方法和属性, 外部不能访问
  ES6 不提供
*/
// 在命名上加以区分, 不保险, 依旧可以在 class 外部访问到
class Widget {
  // 公有方法
  foo(baz) {
    this._bar(baz)
  }
  // 加了 _ 就是私有方法
  _bar(baz) {
    return (this.snaf = baz)
  }
}
// 利用 Symbol 值的唯一性, 将私有方法的名字命名为一个 Symbol 值
const bar = Symbol('bar')
const snaf = Symbol('snaf')
export default class myClass {
  // 公有方法
  foo(baz) {
    this[bar](baz)
  }
  // 私有方法, bar 和 snaf 都是 Symbol 值, 一般情况下无法获取到它们
  [bar](baz) {
    return (this[snaf] = baz)
  }
}

// new.target 属性, 该属性一般用在构造函数之中, 返回 new 命令作用于的那个构造函数, 可以确定构造函数是怎么调用的
// 如果构造函数不是通过`new`命令或`Reflect.construct()`调用的，`new.target`会返回`undefined`
function Person(name) {
  if (new.target !== undefined) {
    this.name = name
  } else {
    throw new Error('必须使用 new 命令生成实例')
  }
}
// 或者
function Person(name) {
  if (new.target === Person) {
    this.name = name
  } else {
    throw new Error('必须使用 new 命令生成实例')
  }
}
var person = new Person('张三')
var notAPerson = Person.call(person, '张三') // Error: 必须使用 new 命令生成实例

// class 内部调用 new.target, 返回当前 Class
class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle)
    this.length = length
    this.width = width
  }
}
var obj = new Rectangle(3, 4) // true
/* 子类继承父类时, new.target 会返回子类 */
class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle)
  }
}
class Square extends Rectangle {
  constructor(length, width) {
    super(length, width)
  }
}
var obj = new Square(3) // false new.target 会返回子类

/* 利用这个特性, 可以写出不能独立使用, 必须继承后才能使用的类(不能实例化的类) */

class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('本类不能实例化')
    }
  }
}
class Rectangle extends Shape {
  constructor(length, width) {
    super()
  }
}
var y = new Rectangle(3, 4) // 正确
var x = new Shape() // 报错 Error: 本类不能实例化
