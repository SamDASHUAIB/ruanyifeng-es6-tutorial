/*
  Set 类似数组, 成员的值都是唯一的, 没有重复的值
  Set 本身是一个构造函数, 用来生成 Set 数据结构
  add() 方法向 Set 结构中加入成员
*/
const s = new Set()
;[2, 3, 5, 4, 5, 2, 2].forEach((element) => {
  s.add(element)
})
/*
2
3
5
4
*/
// 数组去重
for (const i of s) {
  console.log(i)
}

// 初始化 Set 使用一个数组, 或者具有 iterable 接口的其他数据结构, 作为参数
const set = new Set([1, 2, 3, 4, 4])
console.log([...set]) //[ 1, 2, 3, 4 ]

const items = new Set([1, 2, 3, 4, 5, 5, 5, 5])
console.log(items.size) // 5

// 接受类数组的对象作为参数
const set = new Set(document.querySelectorAll('div'))
console.log(set.size)

// 数组去重的简单方法
;[...new Set(array)]
// 也可以用于去除字符串里面的重复字符
console.log(new Set('ababbc')) // Set { 'a', 'b', 'c' }
console.log([...new Set('ababbc')]) // [ 'a', 'b', 'c' ]
console.log([...new Set('ababbc')].join('_')) // "a_b_c"

/*
  Set 加入值的时候, 不会发生类型转换, 所以 5 和 "5" 是两个不同的值
  Set 内部判断两个值是否不同, 类似于 "==="
  区别在于, "===" 认为 NaN 不等于自身
  而 Set 加入值认为 NaN 等于自身
*/

let set = new Set()
let a = NaN
let b = NaN
set.add(a)
set.add(b)
console.log(set) // Set { NaN }

// 两个对象总是不相等的
let set = new Set()
set.add({})
console.log(set.size) // 1
set.add({})
console.log(set.size) // 2

/*
  Set 实例的属性和方法
  Set.prototype.constructor 默认就是 Set 函数
  Set.prototype.size 返回 Set 实例的成员数量

  操作方法
    Set.prototype.add(value) // 返回 Set 结构本身
    Set.prototype.delete(value) // 返回一个布尔值, 表示删除是否成功
    Set.prototype.has(value) // 返回一个布尔值, 表示该值是否为 Set 的成员
    Set.prototype.clear() // 没有返回值, 清除所有成员
  遍历方法(Set 的遍历顺序就是插入顺序, 非常用于的特性, 使用 Set 保存一个回调函数列表, 调用的时候就能保证按添加顺序调用)
    Set.prototype.keys() // 返回键名的遍历器, Set 没有键名只有键值, 因此行为和 values 一样
    Set.prototype.values() // 返回键值的遍历器
    Set.prototype.entries() // 返回键值对的遍历器
    Set.prototype.forEach() // 使用回调函数遍历每个成员, 没有返回值
*/
// Array.from() 可以将 Set 结构转为数组, 提供了去除数组重复成员的另一种方法
function dedupe(array) {
  return Array.from(new Set(array))
}
console.log(dedupe([1, 1, 2, 3, 4, 4])) // [ 1, 2, 3, 4 ]

// 简单写法
console.log([...new Set([1, 1, 2, 3, 4, 4])]) // [ 1, 2, 3, 4 ]

// 遍历操作
let set = new Set(['red', 'green', 'blue'])
for (const item of set.keys()) {
  console.log(item)
}
for (const item of set.values()) {
  console.log(item)
}
/*
[ 'red', 'red' ]
[ 'green', 'green' ]
[ 'blue', 'blue' ]
*/
for (const item of set.entries()) {
  console.log(item)
}

/* Set 结构的默认遍历器生成函数就是它的 values 方法 */
// Symbol.iterator 为每一个对象定义了默认的迭代器, 该迭代器可以被 for ... of 使用
console.log(Set.prototype[Symbol.iterator] === Set.prototype.values) // true

// 这意味着, 可以省略 values 方法, 直接用 for...of 遍历 Set
let set = new Set(['red', 'green', 'blue'])
/*
red
green
blue
*/
for (const x of set) {
  console.log(x)
}

/*
  forEach 和数组一样, Set 结构的 forEach 方法同样没有返回值, 接收一个回调函数, 对每个成员进行执行
  val key set 依次为回调函数的 3 个参数(键值 键名 集合本身)
  forEach 方法的第二个参数, 表示绑定处理函数内部的 this 对象
*/
let set = new Set([1, 4, 9])
/*
  1: 1 --- [object Set]
  4: 4 --- [object Set]
  9: 9 --- [object Set]
*/
set.forEach((val, key, set) => {
  console.log(key + ': ' + val + ' --- ' + set)
})
/*
  遍历的应用
  扩展运算符, 内部使用 for...of 循环, 也可以用于 Set 结构
*/
let set = new Set(['red', 'green', 'blue'])
let arr = [...set]
console.log(arr) // [ 'red', 'green', 'blue' ]
// 扩展运算符 + Set 数组去重
let arr = [3, 5, 2, 2, 5, 5]
let unique = [...new Set(arr)]
console.log(unique) // [ 3, 5, 2 ]
// 而且, 数组的 map 和 filter 方法也可以间接用于 Set 了
let set = new Set([1, 2, 3])
set = new Set([...set].map((x) => x * 2))
console.log(set) // Set { 2, 4, 6 }

let set = new Set([1, 2, 3, 4, 5])
set = new Set([...set].filter((x) => x % 2 === 0))
console.log(set) // Set { 2, 4 }

// 使用 Set 可以很容易地实现并集 交集 和差集
let a = new Set([1, 2, 3])
let b = new Set([4, 3, 2])
// 并集
let union = new Set([...a, ...b])
console.log(union) // Set { 1, 2, 3, 4 }

// 交集, has 方法检查参数是否为 Set 的成员, 返回一个布尔值表示结果
let interest = new Set([...a].filter((x) => b.has(x)))
console.log(interest) // Set { 2, 3 }

// 差集
let difference = new Set([...a].filter((x) => !b.has(x)))
console.log(difference) // Set { 1 }
/* 在遍历中, 改变原来的 Set 结构 */
let set = new Set([1, 2, 3])
set = new Set([...set].map((val) => val * 2))
console.log(set) // Set { 2, 4, 6 }

/*
  Object 结构: 字符串 - 值
  Map 结构: 值 - 值
  都是键值对的集合
*/
// Map 接受一个双层数组作为参数
const map = new Map([
  ['name', '张三'],
  ['title', 'Author'],
])
console.log(map.size) // 2
console.log(map.has('name')) // true
console.log(map.get('name')) // 张三
console.log(map.has('title')) // true
console.log(map.get('title')) // Author

/* Map 构造函数接受数组作为参数, 实际执行的算法 */
const items = [
  ['name', '张三'],
  ['title', 'Author'],
]
const map = new Map()
items.forEach(([key, value]) => {
  map.set(key, value)
})
// 任何具有 Iterator 接口, 且每个成员都是一个双元素的数组的数据结构都可以当做 Map 构造函数的参数 Set 和 Map 能够用来生成新的 Map
const set = new Set([
  ['foo', 1],
  ['bar', 2],
])
const m1 = new Map(set)
m1.get('foo') // 1

const m2 = new Map([['baz', 3]])
const m3 = new Map(m2)
console.log(m3.get('baz')) // 3

// 只有对同一个对象的引用, Map 结构才将其视为同一个键
const map = new Map()
map.set(['a', 555])
console.log(map.get(['a'])) // undefined
// 同理, 同样的值的两个实例, 在 Map 结构中被视为两个键
const map = new Map()
const k1 = ['a']
const k2 = ['a']
map.set(k1, 111).set(k2, 222)
console.log(map.get(k1)) // 111
console.log(map.get(k2)) // 222

/*
  Map 的键实际上是和内存地址绑定的, 只要内存地址不一样, 就视为两个键, 这就解决了同名属性碰撞的问题
  我们扩展别人的库的时候, 如果使用对象作为键名, 就不用担心自己的属性与原作者的属性同名
*/
let map = new Map()
map.set(-0, 123)
console.log(map.get(+0)) // 123

map.set(true, 1)
map.set('true', 2)
map.get(true) // 1

map.set(undefined, 3)
map.set(null, 4)
map.get(undefined) // 3

map.set(NaN, 123)
map.get(NaN) // 123

/*
  size 属性, 返回 Map 结构的成员总数
*/
const map = new Map()
map.set('foo', true)
map.set('bar', false)
console.log(map.size) // 2

/* Map.prototype.set(key, value) 返回整个 Map 结构, 如果 key 已经有值, 键值更新, 否则生成新的键值 */
const m = new Map()
m.set('edition', 6)
m.set(262, 'standard')
m.set(undefined, 'nah')

/* Map.prototype.get(key) 找不到 key 返回 undefined */
const m = new Map()
const hello = function () {
  console.log('hello')
}
console.log(m.set(hello, 'Hello, ES6!')) // Map { [Function: hello] => 'Hello, ES6!' }

console.log(m.get(hello)) // Hello, ES6!

/* Map.prototype.has(key) 返回一个布尔值, 表示某个键是否在当前 Map 对象中 */
const m = new Map()

m.set(undefined, 'nah')
console.log(m.has(undefined))
m.delete(undefined)
console.log(m.has(undefined))

/* Map.prototype.clear() 清除所有成员, 没有返回值 */
let map = new Map()
map.set('foo', true)
map.set('bar', false)
console.log(map.size) // 2
map.clear()
console.log(map.size) // 0

/*
  三个遍历器生成函数和一个遍历方法
  Map.prototype.keys() // 返回键名的遍历器
  Map.prototype.values() // 返回键值的遍历器
  Map.prototype.entries() // 返回键值对的遍历器
  Map.prototype.forEach()  // 返回 Map 的所有成员
*/

// Map 的遍历顺序就是插入顺序
const map = new Map([
  ['F', 'no'],
  ['T', 'yes'],
])
for (const key of map.keys()) {
  console.log(key)
}
for (const value of map.values()) {
  console.log(value)
}
for (const [key, value] of map.entries()) {
  console.log(key + ': ' + value)
}
for (const [key, value] of map) {
  console.log(key + ': ' + value)
}
// Map 结构默认的遍历器接口, Symbol.iterator 属性, 就是 entries 方法
console.log(map[Symbol.iterator] === map.entries) // true

// map => array
const map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
])
console.log([...map.keys()]) // [ 1, 2, 3 ]
console.log([...map.values()]) // [ 'one', 'two', 'three' ]
console.log([...map.entries()]) // [ [ 1, 'one' ], [ 2, 'two' ], [ 3, 'three' ] ]
console.log([...map]) // [ [ 1, 'one' ], [ 2, 'two' ], [ 3, 'three' ] ]

/* 结合数组的 map 方法, filter 方法, 可以实现 Map 的遍历和过滤, Map 本身没有 map 和 filter */
const map0 = new Map().set(1, 'a').set(2, 'b').set(3, 'c')
const map1 = new Map([...map0].filter(([k, v]) => k < 3))
console.log(map1) // Map { 1 => 'a', 2 => 'b' }

const map0 = new Map().set(1, 'a').set(2, 'b').set(3, 'c')
const map2 = new Map([...map0].map(([k, v]) => [k * 2, '_' + v]))
console.log(map2) // Map { 2 => '_a', 4 => '_b', 6 => '_c' }

map.forEach(function (value, key, map) {
  console.log('Key: %s, Value: %s', key, value)
})

/* map => array */
const myMap = new Map().set(true, 7).set({ foo: 3 }, ['abc'])
console.log([...myMap]) // [ [ true, 7 ], [ { foo: 3 }, [ 'abc' ] ] ]

/* array => map 直接向 Map 构造函数中传入 数组对(二维数组) */
new Map([
  [true, 7],
  [{ foo: 3 }, ['abc']],
])

/* Map => 对象, 如果所有 Map 的键都是字符串, 它就可以无损地转为对象 */
function strMapToObj(strMap) {
  let obj = Object.create(null)
  for (const [k, v] of strMap) {
    obj[k] = v
  }
  return obj
}
const myMap = new Map().set('yes', true).set('no', false)
console.log(strMapToObj(myMap)) // [Object: null prototype] { yes: true, no: false }

/* 对象 => Map */
let obj = { a: 1, b: 2 }
let map = new Map(Object.entries(obj))
console.log(map) // Map { 'a' => 1, 'b' => 2 }

// 自定义函数
function objToStrMap(obj) {
  let strMap = new Map()
  for (const k of Object.keys(obj)) {
    strMap.set(k, obj[k])
  }
  return strMap
}
console.log(objToStrMap({ yes: true, no: false })) // Map { 'yes' => true, 'no' => false }

/* map => JSON */
// map 的键名都是字符串, 此时可以选择为对象 JSON
function strMapToJson(strMap) {
  return JSON.stringify(strMapToObj(strMap))
}
function strMapToObj(strMap) {
  let obj = Object.create(null)
  for (const [k, v] of strMap) {
    obj[k] = v
  }
  return obj
}
let myMap = new Map().set('yes', true).set('no', false)
console.log(strMapToJson(myMap)) // JSON {"yes":true,"no":false}

// Map 的键名有非字符串, 此时可以选择转为数组 JSON
function mapToArrayJson(map) {
  return JSON.stringify([...map])
}
let myMap = new Map().set(true, 7).set({ foo: 3 }, ['abc'])
console.log(mapToArrayJson(myMap)) // JSON(数组) [[true,7],[{"foo":3},["abc"]]]

/* JSON => Map 正常情况下, 所有的键名都是字符串 */
function jsonToStrMap(jsonStr) {
  return objToStrMap(JSON.parse(jsonStr))
}
function objToStrMap(obj) {
  let strMap = new Map()
  for (const k of Object.keys(obj)) {
    strMap.set(k, obj[k])
  }
  return strMap
}
console.log(jsonToStrMap('[[true,7],[{"foo":3},["abc"]]]')) // Map { '0' => [ true, 7 ], '1' => [ { foo: 3 }, [ 'abc' ] ] }


