# underscore 源码学习
>参考[亚里士朱德的博](http://yalishizhude.github.io/2015/09/22/underscore-source/)
>参考[源码解析](https://yoyoyohamapi.gitbooks.io/undersercore-analysis/content/base/%E7%BB%93%E6%9E%84.html)

##目录
*   [问题](#preblem)
*   [作用域包裹](#closure)
*   [绑定](#bindroot)
*   [undefined](#undefined)
*   [原型](#prototype)
    *   [原型赋值](#assignment)
    *   [Object 在理解](#understanding)
*   [判断数据](#isElement)
*   [Array.prototype.slice新发现](#clone)
*   [对象相等性判断](#isEqual)
*   [数据判断](#isElement)
*   [对象相等性判断](#isEqual)
*   [函数节流和防抖](#debounceThrottle)

<h2 id="bindroot">绑定</h2>
``var previousUnderscore = root._;``

<h2 id="undefined">undefined</h2>
 在js中undefined是不靠谱的，他能被赋值，如果要获取到正宗的undefined使用void 0
 在一些框架中这样使用

    (function(window,undefined) {
    // ...
    })(window)

  将其他没有用的参数赋值给undefined,防止破坏函数内部逻辑

<h2 id="closure">作用域包裹</h2>

* IIFE 将window穿入进去
* JS中(function(){xxx})() *立即执行函数*

* 包围函数（function(){})的第一对括号向脚本返回未命名的函数，随后一对空括号立即执行返回的未命名函数，括号内为匿名函数的参数。
其他写法:
    * (function () {  code  } ()); 
    * !function () {  code  } ();
    * ~function () {  code  } ();
    * -function () {  code  } ();
    * +function () {  code  } ();
  * 函数声明：  function name(){}
  * 函数表达式：var fnname = function(){}
  * 匿名函数：  function(){} 匿名函数属于函数表达式

  * 两者最主要的区别是： 
          1. 变量提升
          2.  函数表达式可以在后面添加扩看，但是命名函数不行吧
          
                  function fnName(){
                        alert('Hello World');
                    }();//error

                    function(){
                        console.log('Hello World');    
                    }();//error  没有赋值

                    而（）、！、+、-、=等运算符，都将函数声明转换成函数表达式，
                    消除了javascript引擎识别函数表达式和函数声明的歧义，告诉
                    javascript引擎这是一个函数表达式，不是函数声明，可以在后面
                    加括号，并立即执行函数的代码。

                    (function(a){
                        console.log(a);   //firebug输出123,使用（）运算符
                    })(123);

                    (function(a){
                        console.log(a);   //firebug输出1234，使用（）运算符
                    }(1234));
        


<h2 id="prototype">原型</h2>
<h5 id="assignment">原型赋值</h5>
*  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
  * Array,Object,Function 本质上都是函数，获取函数原型属性prototype也是为了便于压缩，如果代码中药扩展属性，
    Object.prototype.xxx = ....
  > 这种代码是不可压缩，Object prototype 这些名字修改了浏览器不认识，刚知道啊
  > 一段代码使用两次都应该定义成变量


<h5 id="understanding">Object 在理解</h5>
1. 高程（p148）
  * 无论什么时候只要创建一个新函数，就会根据一组特定的规则为该函数创建一个prototype（属性值是个对象）属性，这个属性指向函数的原型对象。
  * 在默认情况下，所有的原型对象都会自动获取一个constructor属性，这个属性包含指向protorype属性所在函数的指针。



2. 原型和原型链 
> [参考王福朋博客](http://www.cnblogs.com/wangfupeng1988/tag/%E5%8E%9F%E5%9E%8B/)
 1. 略
 2. 函数和对象的关系
    函数是对象的一种，对象都是函数创建的。eg:
    ```
      function Employee(name,job,born)
      {
      this.name=name;
      this.job=job;
      this.born=born;
      }

      var bill=new Employee("Bill Gates","Engineer",1985);
    ```
  
 3. prototype 原型
    * 原型和函数的关系已经在开篇已经交代了.每个函数都有prototype,每个对象(函数也是对象)都有__proto__
 4. __proto__ 隐式原型
      * 每个对象都有一个隐式的属性，但是有些浏览器是不会让你发现的  

      * 文字版：  每个对象都有一个__proto__属性，指向创建该对象的函数的prototype:This is another regular paragraph.

      ```
        eg: bill.__proto__ === Employee.protitype  //true
        eg: var obj={}
            obj.__proto__ === Object.prototype  //true
            Object.prototype.__proto__ === null //true
      ```
      最终的__proto__ 都要指向 Object.prototype
       (考虑Object.prototype.__proto__,而Object.prototype.__proto__ 是个特例是null 固定的)
        函数是特殊的对象，他当然也是有__proto__Object.__proto__ === Functon.prototype
  
 5. instanceof 运算
      * Instanceof运算符的第一个变量是一个对象，暂时称为A；第二个变量一般是一个函数，暂时称为B。
      * 运算规则：沿着A的__proto__ 这条线来找，同时沿着B 的prototype 这条线来找，如果两条线能同
                时找到同一个对象，那么就返回true，如果找到终点还没有找到，则返回false
                  ```
                  console.log(Object instanceof Function) //true
                  console.log(Function instanceof Object) //true
                  console.log(Function instanceof Function) //true
                  console.log(Object instanceof Object) //true
                  ```
    instanceof表示的就是一种继承关系，或者原型链的结构。

 6. 继承
    * javescript中的继承是通过原型链来体现的：
      * 访问一个对象的属性时，先在基本属性中查找，如果没有，再沿着__proto__这条链向上找，这就是原型链。由于所有的对象的原型链都会找到Object.prototype，因此所有的对象都会有Object.prototype的方法。这就是所谓的“继承”。

 7. 原型的灵活性
    可以灵活的添加属性

 8. 简述执行上下文（上）
    我们总结一下，在“准备工作”中完成了哪些工作：

    变量、函数表达式——变量声明，默认赋值为undefined；
    this——赋值；
    函数声明——赋值；
    这三种数据的准备情况我们称之为“执行上下文”或者“执行上下文环境”。

 9. 执行上下文（下）               
    函数每调用一次，都会产生一个新的上下文环境因为不同的调用可能产生不同的参数
      ```
      bill.prototype    //undifined
      bill.constructor === employee.prototype.constructor  
      function employee(name, job, born) {
        this.name=name;
        this.job=job;thisborn=born;
      } //实例是个对象，指向构造函数

      employee.constructor  //function Function() { [native code] }
      var obj={}
      obj.constructor       //function Object() { [native code] }   
      ```
      
      错误的理解Object是个纯对象!!!
      举一个错误的例子，比如 obj = {} 和 Object 是一个级别的对象，Object应该是个函数.
      MDN 中描述到Object：
         对象构造函数为给定值创建一个对象包装器。如果给定值是  null or undefined，将会创建并返回一个空对象，否则，将返回一个与给定值对应类型的对象。
         当以非构造函数形式被调用时，Object 等同于 new Object()。
      ```
        typeof Object   //function                 
        typeof obj      //object
      ```
        
      所以Object 更加详细的描述就是function  


  10. 扩展
      new形式创建对象的过程实际上可以分为三步：

      1. 第一步是建立一个新对象（叫A吧）；

      2. 第二步将该对象（A）内置的原型对象设置为构造函数(就是Person)prototype 属性引用的那个原型对象；

      3. 第三步就是将该对象（A）作为this 参数调用构造函数(就是Person)，完成成员设置等初始化工作。      

      ```
       function collectNonEnumProps(obj, keys) {
          var nonEnumIdx = nonEnumerableProps.length;
          var constructor = obj.constructor;
          var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;
          ...
        }中(_.isFunction(constructor) && constructor.prototype) || ObjProto ？？？

         这是访问实例原型的一种方法：
              constructor.prototype ==> window(obj)
              ObjProto              ==> object(obj)

              没有发现_.isFunction(constructor)
      ```

   11. 例子
    ```
    function Personal(){};
    var p = new Personal();
    ①从p 画出 完成的__proto__链
    p-> Personal.prototype-> Object.prototype->null

    ②Personal() 的原型链
    Personal()-> Function.prototype->Object.prototype->null

    ③console.log(Personal.constructor)
    分析： Personal.__proto__ 指向的是Function.prototype.函数是没有constructor 属性的，所以会沿着__proto__ 向上一级寻找，是     Function.prototype，他的constructor 是function Function(){}

    ④console.log(Personal.prototype)
    ```
  
<h2 id="isElement">数据判断</h2>
《编写可维护的JavaScript》 中提提到的数据监测方法
1. string number  undefined boolean 
    * 这四中数据类型使用typeof 在检测即可
        typeof '1'  ==  'string'
        typeof  1   ==  'number'
        typeof found ==  'boolean' && found
        typeof undefined  ==  'undefined'

2. null 
    * 使用  value === null
3. 引用类型
    1. 一般  
        * 使用instanceof 

    2. array
        * Array.prototype.toString.call(array) == '[object Array]'

 4. function  
        * typeof fn === 'function'


    _.isElement = function(obj) {
      return (obj && obj.nodetype === 1);
    }

  >如果dom的nodeType的属性,返回boolean
5.  typeof NaN (number)
```
 // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

```

```
 // null的类型有些特殊，typeof null == 'object'  null == undefined ,检测他就和null自身比较，null用处多是初始化变量，这个变量可能是个对象在没有给变量赋值的时候，理解null可以是对象的占位符 可以var value = null;
  _.isNull = function(obj) {
    return obj === null;
  };
```

```
  // 看到源码可以知道，函数也被视为对象，undefined，null，NaN等则不被认为是对象
  // javascript 函数和object都是对象,其中null 也是object 要注意使用!!object 来判断
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };
```

```
     if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }
```

```
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

```

```
// 对于Arguments判断，IE9以前的版本，Object.prototype.toString返回的会是'[object Object]'而不是'[object Arguments]，需要通过判断对象是否具有callee来确定其是否Arguments类型，underscore对此进行了修正：
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

```


```
// 使用void 0 原因是undefined 可以被重写
_.isUndefined = function(obj) {
  return obj === void 0;
};
```

在underscore对象api中，很多函数内部都可以见到下面的一段代码：
var obj = Object(obj);
这段代码的意义是：
如果obj是一个对象，那么Object(obj)返回obj
**如果obj是undefined或null，那么Object(obj)返回一个{}**
如果obj是一个原始值(Primitive value)，那么Object(obj)返回一个被包裹的原始值:

```
var obj = 2;
obj = Object(obj); // 相当于new Number(obj);
// => obj: Number {[[PrimitiveValue]]: 2}
var value = obj.valueOf();
// => value: 2
```
Object(obj)就是将传入obj进行对象化


<h2 id="clone">Array.prototype.slice新发现</h2>
当obj 为array的时候，进行浅复制，发现使用obj.slice()，难道slice有浅复制的功能，查了一下MDNr原文如下：
> 
*slice() 方法将数组的一部分**浅拷贝**, 返回到从开始到结束（不包括结束）选择的新数组对象。原始数组不会改变*

```

  _.clone = function() {
    if(_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  }
```

关于这个方法还有
```
// 使用slice方法从myCar中创建一个newCar.
var myHonda = { color: 'red', wheels: 4, engine: { cylinders: 4, size: 2.2 } };
var myCar = [myHonda, 2, "cherry condition", "purchased 1997"];
var newCar = myCar.slice(0, 2);

// 输出myCar, newCar,以及各自的myHonda对象引用的color属性.
print('myCar = ' + myCar.toSource());
print('newCar = ' + newCar.toSource());

结果是：
myCar = [{color: 'red', wheels: 4, engine: {cylinders: 4, size: 2.2}}, 2, 'cherry condition', 'purchased 1997']
newCar = [{color: 'red', wheels: 4, engine: {cylinders: 4, size: 2.2}}, 2]

也就是myHonda是一个整体来进行计算的
```

<h2 id="isEqual">对象相等性判断</h2>

在进行a和b的比较的过程中，面临如下的问题：
有如下的:

*  ``0 === -0``
*  ``null === undefined``
*  ``NaN != NaN``
*  ``NaN !== NaN``

方法：

  *  ``0 === -0`` 解决
    对于该问题，我们可以借助如下等式解决
    ``1 / a === 1 / b``

  * NaN != NaN 及 NaN !== NaN：
    如果我们要认为NaN等于NaN（这更加符合认知和语义），我们只需要：
    ``if(a !== a) return b !== b``

<h2 id="debounceThrottle">函数节流和防抖</h2>
有些方法触发时会被频发触发，致使产生性能问题

1. window对象的resize、scroll事件

2. 拖拽时的mousemove事件

3. 射击游戏中的mousedown、keydown事件

4. 文字输入、自动完成的keyup事件



所以我们需要使用函数节流和函数

防抖来解决这个问题
```
// 函数防抖 debounce　
window.addEventListenter('scroll',function() {
  var timer;
  return function() {
    if (timer) {
        learTimeout(timer);
        timer = setTimeout(function(){
            console.log('do somthing')
        },500)  
    }
  }
}())
```


```
// 函数节流
window.addEventListenter('scroll',function() {
  var timer;
  var startTime = new Date();
  return function() {
    var crrtime = new Daate();
    if (crrtime > startTime) {
        timer = setTimeout(function(){
          console.log('do somthing')
        },500) 
        starttime = curTime;       
    }
  }
}())
```

<meta http-equiv="refresh" content="1">





























