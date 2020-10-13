// BigInt 数据类型
/*
  64 位浮点数, 导致数值的精度只能到 53 个二进制位(16 个十进制位), 大于这个范围, JavaScript 无法精确表示
*/
console.log(Math.pow(2, 53) === Math.pow(2, 53) + 1) // true
// 超过 2 的 1024 次方的数值, 无法表示
console.log(Math.pow(2, 1024)) // Infinity

/*
  BigInt 只用来表示整数, 没有位数的限制, 任何位数都可以精确表示
*/
const a = 2172141653n
const b = 15346349309n
console.log(a * b) // 33334444555566667777n

// 普通整数, 无法保持精度
console.log(Number(a) * Number(b)) // 33334444555566670000
// 为了与 Number 类型区分, BigInt 类型的数据必须添加后缀 n
console.log(1n + 2n) // 3n
console.log(42n === 42); // false
