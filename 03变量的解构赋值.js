// 解构赋值: 按照一定的模式, 从数组和对象中提取值, 对变量进行赋值
// 模式匹配
let [foo, [[bar]], baz] = [1, [[2]], 3];
console.log(foo); // 1
console.log(bar); // 2
console.log(baz); // 3

let [, , third] = [1, 2, 3];
console.log(third); // 3

let [x, , y] = [1, 2, 3];
console.log(x); // 1
console.log(y); // 3

let [head, ...tail] = [1, 2, 3, 4];
console.log(head); // 1
console.log(tail); // [ 2, 3, 4 ]

let [x, y, ...z] = ['a'];
console.log(x); // a
console.log(y); // undefined 解构赋值失败, 变量的值等于 undefined
console.log(z); // []

// 解构不成功, 变量的值就等于 undefined
let [foo] = [];
let [foo, bar] = [];

// 不完全解构, 左边的模式只匹配一部分的等号右边的数组 模式 < 数组
let [x, y] = [1, 2, 3];
console.log(x);
console.log(y);
let [a, [b], d] = [1, [2, 3], 4];
console.log(a);
console.log(b);
console.log(d);

// 如果等号右边不是可遍历的结构, 报错
// 要么转为对象以后不具备 Iterator 接口
// 要么本身不具备 Iterator 接口
let [foo] = 1;
let [foo] = false;
let [foo] = NaN;
let [foo] = undefined;
let [foo] = null;
let [foo] = {};

// 事实上, 只要某种数据结构具有 Iterator 接口, 都可以采用数组形式的解构赋值

/*
  解构赋值允许指定默认值
*/
let [foo = true] = [];
console.log(foo); // true

let [x, y = 'b'] = ['a'];
console.log(x);
console.log(y); // b

// es6 使用严格相等运算符, 判断一个位置是否有值, 只有成员严格等于 undefined 的时候, 默认值才会生效
let [x = 1] = [undefined];
console.log(x); // 1
let [x = 1] = [null];
console.log(x); // null 默认值不生效, 解构赋值生效

// 默认值可以是一个表达式, 这个表达式是惰性求值的, 只有在用到的时候, 才会求值
function f() {}

let [x = f()] = [1]; // x 能取到值, 所以默认值根本不生效

/*
  对象的解构赋值
  对象的属性没有次序, 因此, 变量必须与属性同名, 才能取到正确的值
  数组的元素是按次序排列的, 变量的取值由它的位置决定
*/
// 模式的次序没有影响
let { bar, foo } = { foo: 'aaa', bar: 'bbb' };
console.log(foo); // aaa
console.log(bar); // bbb

let { baz } = { foo: 'aaa', bar: 'bbb' };
console.log(baz); // 不同名, undefined 解构赋值失败

// 解构赋值, 现有对象的方法, 赋值到某个变量
let { log, sin, cos } = Math;

// 将现有对象的方法, 赋值到某个变量
const { log } = console;
log('hello'); // hello

/*
  对象的解构赋值的实际形式
*/
// 先找到同名属性, 再将其赋值给对应的变量, 真正被赋值的是后者, 而不是前者(前者是模式, 后者才是真正的需要赋值的变量)
let { foo: foo, bar: bar } = {
  foo: 'aaa',
  bar: 'bbb',
};
let { foo: baz } = { foo: 'aaa' };
console.log(baz); // 'aaa' baz 才是真正的主角, 需要赋值的变量
console.log(foo); /// 报错 ReferenceError: foo is not defined, 这说明 foo 仅仅是模式

// 对嵌套的对象进行解构
let obj = {
  p: ['hello', { y: 'world' }],
};
let {
  p: [x, { y }],
} = obj; // p 是模式, x, y 在数组内部, 按照位置来匹配变量
console.log(p); // ReferenceError: p is not defined
console.log(x); // hello
console.log(y); // world

// 如果 p 也要作为变量赋值
let obj = {
  p: ['hello', { y: 'world' }],
};
let {
  p: p,
  p: [x, { y }],
} = obj;
console.log(p); // [ 'hello', { y: 'world' } ]

/*
  复杂的解构赋值
*/
const node = {
  loc: {
    start: {
      line: 1,
      column: 5,
    },
  },
};
// 三次解构赋值, loc start line
let {
  loc,
  loc: { start },
  // 此次解构赋值, loc 和 start 都是模式(或者说定位), 只有 line 才是变量, 其实真正面目是 line: line
  loc: {
    start: { line },
  },
} = node;
console.log(line); // 1
console.log(loc); // { start: { line: 1, column: 5 } }
console.log(start); // { line: 1, column: 5 }

/*
  为数组和对象填充值
*/
let obj = {};
let arr = [];
({ foo: obj.prop, bar: arr[0] } = { foo: 123, bar: true });
console.log(obj); // { prop: 123 }
console.log(arr); // [ true ]

// 对象的解构赋值可以取到继承的属性
const obj1 = {};
const obj2 = { foo: 'bar' };
// obj1 的原型设为 obj2 因此, 可以通过原型继承了 foo 变量
Object.setPrototypeOf(obj1, obj2);
const { foo } = obj1;
console.log(foo); // bar 解构赋值可以取到继承的 foo 变量的值

/*
  对象的解构赋值也可以指定默认值
  默认值生效的条件是, 对象的属性值严格等于 undefined
*/
var { x = 3 } = {};
var { x, y = 5 } = { x: 1 };
console.log(y);
// 改名,
var { x: y = 3 } = {};
console.log(y); // 3

var { x: y = 3 } = { x: 5 };
console.log(y); // 5

// 严格等于 undefined
var { x = 3 } = { x: undefined };
console.log(x); // 3 默认值生效, 解构赋值失败
var { x = 3 } = { x: null };
console.log(x); // null 解构赋值生效

// 字符串的解构赋值, string => arrayLike
const [a, b, c, d, e] = 'hello';
console.log(a); // h
console.log(b); // e
console.log(c); // l
console.log(d); // l
console.log(e); // o

// 类数组的对象都有一个 length 属性, 因此可以对这个属性解构赋值
let { length: len } = 'hello';
console.log(len); // 5

// 数值和布尔值的解构赋值, 先转为对象
let { toString: s } = 123;
console.log(s === Number.prototype.toString); // true, 数值的包装对象 Number 实例有 toString 方法, s 可以赋值成功

let { toString: s } = true;
console.log(s === Boolean.prototype.toString); // true

/*
  只要等号右边的值不是对象或者数组, 就将其转为对象
  由于 undefined 和 null 无法转为对象, 因此无法对其进行解构赋值
*/
let { prop: x } = undefined; // TypeError: Cannot destructure property 'prop' of 'undefined' as it is undefined.

let { prop: y } = null; // TypeError: Cannot destructure property 'prop' of 'null' as it is null.

/*
  函数参数的解构赋值
*/
function add([x, y]) {
  return x + y;
}
add([1, 2]); // 3
// 实际: [x, y] = [1, 2] 解构赋
[
  [1, 2],
  [3, 4],
].map(([a, b]) => {
  a + b;
}); // 每一项进行解构赋值 [1, 2] = [a, b], [3, 4] = [a, b] 结果集(数组)保存着每一项(也是数组)求和的结果

// 函数参数的解构使用默认值
function move({ x = 0, y = 0 } = {}) {
  return [x, y];
}
move({ x: 3, y: 8 }); // [3, 8], 对象的解构赋值, 函数参数的解构赋值都生效, 默认值均失败
move({ x: 3 }); // [3, 0] // 函数参数 y 的默认值生效, 对象的解构赋值生效
move({}); // [0, 0] // 函数参数 x y 的默认值生效, 对象的解构赋值生效
move(); // [0, 0] 对象的默认值生效, 导致, 函数参数 x y 的默认值生效

/*
  只要有可能, 不要在模式中放置圆括号
*/

/*
  变量的解构赋值的用途
  1.交换变量的值
  2.从函数返回多个值
  3.函数参数的定义
  4.提取 JSON 数据
  5.函数参数的默认值
  6.遍历 Map 结构
  7.输入模块的指定方法
*/
// 交换变量的值
let x = 1;
let y = 2;
[x, y] = [y, x]; // 实际上 [x, y] = [2, 1]
console.log(x); // 2
console.log(y); // 1

/*
  从函数中返回多个值, 把它们放在数组或对象里返回, 有了解构赋值, 取出这些值就非常方便
*/
// 数组
function example() {
  return [1, 2, 3];
}
// 使用解构赋值, 将多个值重新从函数返回值中取出
let [a, b, c] = example();
// 对象
function example() {
  return {
    foo: 1,
    bar: 2,
  };
}
// 使用解构赋值, 将多个值重新从函数返回值中取出
let { foo, bar } = example();
console.log(foo); // 1
console.log(bar); // 2

/*
  函数参数的定义, 解构赋值空可以很方便地将一组参数与变量名对应起来
*/
// 参数有次序
function f([x, y, z]) {}
f([1, 2, 3]);
// 参数无次序
function f({ x, y, z }) {}
f({ z: 3, y: 2, x: 1 });

/*
  提取 JSON 数据
*/
let jsonData = {
  id: 42,
  status: 'OK',
  data: [123, 456],
};

let { id, status, data: number } = jsonData;
console.log(id, status, number); // 42 'OK' [ 123, 456 ]

/*
  函数参数的默认值
  避免了在函数体内部写 var foo = config.foo || "default foo" 这样的语句
*/
$.ajax = function (
  url,
  {
    async = true,
    beforeSend = function () {},
    cache = true,
    complete = function () {},
    crossDomain = false,
    global = true,
  } = {}
) {};

/*
  遍历 Map 结构
  任何部署了 Iterator 接口的对象, 都可用 for ... of 循环进行遍历
  Map 原生支持 Iterator 接口, 配合变量的解构赋值, 获取键名和键值非常方便
*/
const map = new Map();
map.set('first', 'hello');
map.set('second', 'world');
// 使用解构赋值, 就像对数组进行解构赋值一样
for (const [key, value] of map) {
  console.log(`${key} is ${value}`);
}
/*
first is hello
second is world
*/
// 单独获取键名, 单独获取键值
for (const [key] of map) {
}
// 不完全解构
for (const [, value] of map) {
}

/*
  输入模块的指定方法
  加载模块的某些指定方法
*/
const { SourceMapConsumer, SourceNode } = require('source-map');

/*
  对象的解构赋值, 可以很方便的将现有对象的方法, 赋值到某个变量
*/
let { log, sin, cos } = Math;
const { log } = console;
log('hello'); /* hello */

/*
  对象的解构赋值的内部机制, 先找到同名属性, 然后再赋给对应的变量, 真正被赋值的是后者
  模式 + 变量
  先匹配到正确的 "模式", 然后再赋给对应的 "变量"
*/
let { foo: foo, bar: bar } = { foo: 'aaa', bar: 'bbb' };
console.log(foo);
console.log(bar);

/* 模式 变量 */
const node = {
  loc: {
    start: {
      line: 1,
      column: 5,
    },
  },
};
let {
  loc,
  loc: { start },
  loc: {
    start: { line },
  },
} = node;
console.log(loc); // { start: { line: 1, column: 5 } }
console.log(start); // { line: 1, column: 5 }
console.log(line); // 1

/* 对象的解构赋值可以取到继承的属性 */
const obj1 = {};
const obj2 = { foo: 'bar' };
Object.setPrototypeOf(obj1, obj2);
const { foo } = obj1;
console.log(foo); // bar

/*
  函数参数的解构赋值
*/
const res = [
  [1, 2],
  [3, 4],
].map(([a, b]) => a + b);
console.log(res); /* [ 3, 7 ] */

/* 函数参数的解构赋值 + 解构赋值的默认值 */
function move({ x = 0, y = 0 } = {}) {
  return [x, y];
}
move({ x: 3, y: 8 });
move({ x: 3 });
move({});
move();

/*
  解构赋值的用途
*/
// 交换变量的值
let x = 1;
let y = 2;
[x, y] = [y, x];
console.log(x);
console.log(y);

// 从函数中返回多个值
function example() {
  return [1, 2, 3];
}
let [a, b, c] = example();
console.log(a);
console.log(b);
console.log(c);

function example() {
  return {
    foo: 1,
    bar: 2,
  };
}
let { foo, bar } = example();
console.log(foo);
console.log(bar);

// 函数参数的定义, 很方便地将一组参数与变量名对应起来
function f([x, y, z]) {
  // ...
}
f([1, 2, 3]);
function f({ x, y, z }) {
  // ...
}
f({ x: 1, y: 2, z: 3 });

// 提取 JSON 数据
let jsonData = {
  id: 42,
  status: 'Ok',
  data: [867, 5309],
};

let { id, status, data: number } = jsonData;
console.log(id, status, number);

// 遍历 Map 结构
const map = new Map();
map.set('first', 'hello');
map.set('second', 'world');
for (const [key, value] of map) {
  console.log(key + ' is ' + value);
}
for (const [key] of map) {
  console.log(key);
}
for (const [, value] of map) {
  console.log(value);
} // key value entries

/* 输入模块的指定方法 */
const { packageName } = require('packageName');
