class Point {}
/*
  super 关键字, 表示父类的构造函数, 用来新建父类的 this 对象
  子类必须在 constructor 方法中调用 super 方法, 否则新建实例会报错
  因为子类自己的 this 对象, 必须先通过父类的构造函数完成塑造, 得到与父类同样的实例属性与方法,
  然后再对其进行加工, 加上子类自己的实例属性和方法
  如果不调用 super 方法, 子类就得不到 this 对象

  es6: 父类实例对象的属性和方法(先)加到 this 上面, 然后再用子类的构造函数修改 this(先父后子)
*/
class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y) // 调用父类的构造函数 constructor(x, y)
    this.color = color
  }
  toString(){
    return this.color + ' ' + super.toString() // 调用父类的 toString() 方法
  }
}
