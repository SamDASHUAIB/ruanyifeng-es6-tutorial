/* Object.is() 与严格比较运算符(===)的行为基本一致 */
console.log(Object.is('foo', 'foo')); // true
console.log(Object.is({}, {})); // false
/* 不同之处: +0 不等于 -0 NaN 等于自身 */
console.log(+0 === -0); // true
console.log(NaN === NaN); // false

console.log(Object.is(+0, -0)); // false
console.log(Object.is(NaN, NaN)); // true

/* Object.assign() 将源对象的所有可枚举属性, 复制到目标对象 */
const target = { a: 1 };
const source1 = { b: 2 };
const source2 = { c: 3 };
Object.assign(target, source1, source2);
console.log(target); // { a: 1, b: 2, c: 3 }
/* 自身 + 可枚举 + Symbol */
const c = Object.assign(
  { b: 'c' },
  Object.defineProperty({}, 'invisible', {
    enumerable: false,
    value: 'hello',
  })
);
console.log(c); /* { b: 'c' } */

/* Symbol 值可以被复制 */
const copy = Object.assign({ a: 'b' }, { [Symbol('c')]: 'd' });
console.log(copy); /* { a: 'b', [Symbol(c)]: 'd' } */

/*
  Object.assign() 方法的注意点
    浅拷贝, 拷贝的是引用
    同名属性的替换
    取值函数的处理
*/
// 浅拷贝
const obj1 = { a: { b: 1 } };
const obj2 = Object.assign({}, obj1);
obj1.a.b = 2;
console.log(obj2.a.b); // 2 同时发生变化

// 同名属性的替换, 嵌套对象遇到同名属性, 处理方法是替换而不是添加
const target = { a: { b: 'c', d: 'e' } };
const source = { a: { b: 'hello' } };
const copy = Object.assign(target, source);
console.log(copy); /* { a: { b: 'hello' } } 整个 a 属性被替换(覆盖)掉了 */

// 取值函数的处理, 求值后再复制
const source = {
  get foo() {
    return 1;
  },
};
const target = {};
const copy = Object.assign(target, source);
console.log(copy); /* { foo: 1 } 调用一次取值函数后再复制 */

/*
  Object.assign() 方法的用处
    为对象添加属性
    为对象添加方法
    克隆对象
    合并多个对象
    为属性指定默认值
*/
class Point {
  constructor(x, y) {
    Object.assign(this, {
      x,
      y,
    }); /* 通过 Object.assign 方法, 将 x 属性和 y 属性添加到 Point 类的对象实例 */
  }
}

Object.assign(SomeClass.prototype, {
  someMethod() {},
  anotherMethod() {},
});
// 等同于
SomeClass.prototype.someMethod = function () {};
SomeClass.prototype.anotherMethod = function () {};

/* 自身√ 继承× */
function clone(origin) {
  return Object.assign({}, origin);
}
/* 自身 + 继承(保持继承链) 使用 create 维持原型 */
function clone(origin) {
  let originProto = Object.getPrototypeOf(origin);
  return Object.assign(Object.create(originProto), origin);
}

const merge = (target, ...sources) =>
  Object.assign(target, ...sources); /* 将多个对象合并到目标对象 */
const merge = (...sources) =>
  Object.assign({}, ...sources); /* 合并后返回一个新的对象 */

// 为属性指定默认值
const DEFAULTS = {
  logLevel: 0,
  outputFormat: 'html',
};
function processContent(options) {
  options = Object.assign(
    {},
    DEFAULTS,
    options
  ); /* 合并 DEFAULTS 以及 options 对象, 同名属性后者覆盖前者 */
  console.log(options);
  // ...
}
// 由于浅拷贝, 最好都是简单类型, 不要指向另一个对象, 否则, DEFAULTS 对象的该属性很可能不起作用
const DEFAULTS = {
  url: {
    host: 'example.com',
    port: 7070,
  },
};
processContent({
  url: { prot: 8000 },
}); /* { url: { prot: 8000 } } 整个替换掉了, 而非仅仅替换不同(深层嵌套) */

/* Object.getOwnPropertyDescriptor() 方法返回某个对象属性的描述对象 */
/* Object.getOwnPropertyDescriptors() 方法返回指定对象自身属性的描述对象 */

const obj = {
  foo: 123,
  get bar() {
    return 'abc';
  },
};
/*
  {
    foo: { value: 123, writable: true, enumerable: true, configurable: true },
    bar: {
      get: [Function: get bar],
      set: undefined,
      enumerable: true,
      configurable: true
    }
  }
*/
console.log(Object.getOwnPropertyDescriptors(obj));

/* { value: 123, writable: true, enumerable: true, configurable: true } */
console.log(Object.getOwnPropertyDescriptor(obj, 'foo'));

/*
  引入 Object.getOwnPropertyDescriptors(obj) 的目的是为了解决 Object.assign()
  无法正确拷贝 get 属性和 set 属性的问题
*/
const source = {
  set foo(value) {
    console.log(value);
  },
};
const target1 = {};
Object.assign(target1, source);
console.log(Object.getOwnPropertyDescriptor(target1, 'foo'));
/*
  {
    value: undefined,
    writable: true,
    enumerable: true,
    configurable: true
  }
  赋值函数 set 结果却是 value: undefined Object.assign() 方法总是拷贝一个属性的值,
  而不会拷贝 get 和 set
*/

/*
  使用 Object.getOwnPropertyDescriptors() 以及 Object.defineProperties() 方法可以实现正确的拷贝
*/
/*
  {
    get: undefined,
    set: [Function: set foo],
    enumerable: true,
    configurable: true
  }
*/
const source = {
  set foo(value) {
    console.log(value);
  },
};
const target2 = {};
Object.defineProperties(target2, Object.getOwnPropertyDescriptors(source));
console.log(Object.getOwnPropertyDescriptor(target2, 'foo'));
/*
  Object.getOwnPropertyDescriptor() 配合 Object.create() 将对象属性克隆到一个新对象, 属于浅拷贝
  原型 + 自身属性
*/
const clone = Object.create(
  Object.getPrototypeOf(obj),
  Object.getOwnPropertyDescriptors(obj)
);
// 等同于
const shallowClone = (obj) =>
  Object.create(
    Object.getPrototypeOf(obj),
    Object.getOwnPropertyDescriptors(obj)
  );

/**
 * 实现一个对象继承另一个对象的几种方法
 *  __proto__
 * create()
 * assign
 * getOwnPropertyDescriptors
 */
const obj = {
  __proto__: prot /* 浏览器部署 */,
  foo: 123,
};
const obj = Object.create(prot);
obj.foo = 123;

const obj = Object.assign(Object.create(prot), {
  foo: 123,
}); /* 适合 value writable 类型的属性 */

const obj = Object.create(
  prot,
  Object.getOwnPropertyDescriptors({
    foo: 123,
  })
); /* 适合 get set 类型的属性 */

/*
  不要使用 __proto__  属性
  使用  Object.setPrototypeOf() Object.getPrototypeOf() Object.create() 方法替代
 */
const o = Object.setPrototypeOf(
  {},
  null
); /* 设置 prototype, 返回参数对象本身 */

/*
  供 for of 循环消费
  Object.keys()
  Object.value()
  Object.entries() Object => Map
  返回一个数组, 由 键 值 键值对 构成
  跳过键值为 Symbol 的属性
  可遍历 + 自身 + string 类型键
*/
// Object => Map
const obj = { foo: 'bar', baz: 42 };
const map = new Map(Object.entries(obj));
console.log(map); /* Map(2) { 'foo' => 'bar', 'baz' => 42 } */

let obj = { one: 1, two: 2 };
for (const [k, v] of Object.entries(obj)) {
  console.log(`${JSON.stringify(k)}: ${JSON.stringify(v)}`);
}
/*
  "one": 1
  "two": 2
*/
// 自己实现一个 Object.entries()
function entries(obj) {
  let arr = [];
  for (const key of Object.keys(obj)) {
    arr.push([key, obj[key]]);
  }
  return arr;
}
