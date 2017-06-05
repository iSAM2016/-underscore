# underscore 源码学习
>参考[亚里士朱德的博](http://yalishizhude.github.io/2015/09/22/underscore-source/)
>参考[源码解析](https://yoyoyohamapi.gitbooks.io/undersercore-analysis/content/base/%E7%BB%93%E6%9E%84.html)
>参考[JavaScript深入系列15篇](https://juejin.im/post/59278e312f301e006c2e1510)
>参考[淘金](https://github.com/jawil/blog/issues/4)

##目录
*   [undefined](#undefined)
*   [原型](#prototype)
    *   [原型赋值](#assignment)
    *   [Object 在理解](#understanding)
*   [作用域](#bindroot)
    *   [作用域类型](#scopeType)
        *   [函数作用域](#functionscope)
*   [类型转换](#TypeConversion)
*   [判断数据](#isElement)
*   [Array.prototype.slice新发现](#clone)
*   [对象相等性判断](#isEqual)
*   [数据判断](#isElement)
*   [对象相等性判断](#isEqual)
*   [函数节流和防抖](#debounceThrottle)



<h2 id="undefined">undefined</h2>
 在js中undefined是不靠谱的，他能被赋值，如果要获取到正宗的undefined使用void 0
 在一些框架中这样使用
```
    (function(window,undefined) {
    // ...
    })(window)
```
  将其他没有用的参数赋值给undefined,防止破坏函数内部逻辑

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
  
<h2 id="bindroot">作用域</h2>

2017年05月28日17:39:23  this和作用域 的误解
因为js采用的是词法作用域，函数的作用域在函数定义的时候就决定好了

作用域： 根据名称查找变量的一套规则,作用域最大的用处就是隔离变量，不同作用域下同名变量不会有冲突
当一个块或者一个函数嵌套在另外一个块或者函数的时候，就发生了作用域的嵌套
![作用域嵌套](/img/241708372951952.png)
```
function foo(a){console.log(a + b); b= a;}; foo(2)// b is not defined
function foo(a){console.log(a + b); var b= a;}; foo(2) //NaN
function foo(){var c= d =1};foo(); console.log(c); c is not defined
 (function() {
  var a=b=3;
  })()
  console.log(b)
  console.log(a)
```

<h5 id="scopeType">作用域类型</h5>
作用域共有两种工作模型
1. 词法作用域（js）
2. 动态作用域

词法作用域是由你写代码时将变量和块作用域写在哪里决定的，上下文的判断是根据调用代码的顺序来决定的
```
var value = 1;  
var ob6  6贴图也批语沪江英语 u6u6uu1234t597942635yrkynrmrbfdjtBHIJGUOUIYHY 
  foo();
} 
bar();

执行foo函数，先从foo函数内部查找内部有局部变量value, 如果没有就根据书写位置查找内部是否有局部变量value，如果没有则查找上一层代码，value是1

var scope = 'globel scope';
function a() {
  var scope = 'local scope'
  function f() {
    return scope;
  }
  return f();
}
a()


var scope = 'globel scope';
function a() {
  var scope = 'local scope'
  二位恶女reghitutrnt83y4r4ftthtut55594uvrg() {
    return scope;
  }
  return f;
}
a()()
结果都是相同的，函数的作用域是函数创建的位置
这两段代码是有蛇魔不同吗   
```
```
var value = 1;  
var obj = {value: 2};
function foo(){
  console.log(this.value);
  console.log(this)
}; 

function bar(){
  var value = 2; 
  foo.call(obj);
} 
bar();
```

<h5 id="functionscope">函数作用域</h5>
立即执行函数表达式
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

<h2 id="functionscope">执行上下文</h2>  
js在***执行***代码段（全局代码， 函数体， eval）的时候，会做一些准备工作

* 创建arguments对象、检查function函数声明创建、检查var变量声明创建属性
* scope chain
* this——赋值(只有在执行的时候才能确定，定义的时候不能确定)

这三种数据的准备情况我们称之为“执行上下文”或者“执行上下文环境”。

函数每调用一次，都会产生一个新的上下文环境因为不同的调用可能产生不同的参数;
函数在定义的时候（不是调用的时候），就已经确定了函数体内部自由变量的作用域;
作用域只是一个“地盘”，一个抽象的概念，其中没有变量。要通过作用域对应的执行上下文环境来获取变量的值。
同一个作用域下，不同的调用会产生不同的执行上下文环境，继而产生不同的变量的值。所以，作用域中变量的值是在执行过程中产生的确定的，而作用域却是在函数创建时就确定了。
所以，如果要查找一个作用域下某个变量的值，就需要找到这个作用域对应的执行上下文环境，再在其中寻找变量的值。

<h5 id="functionscope">关于Hoisting（变量提升）</h5>  
```

(function() {
    console.log(typeof foo); // function pointer
    console.log(typeof bar); // undefined
    var foo = 'hello',
        bar = function() {
            return 'world';
        };
    function foo() {
        return 'hello';
    }
}());​


```
现在我们可以回答下面这些问题了：

1. 在foo声明之前，为什么我们可以访问它？

如果我们来跟踪creation stage, 我们知道在代码执行阶段之前，变量已经被创建了。因此在函数流开始执行之前，foo已经在activation object中被定义了。

2. foo 被声明了两次，为什么 foo 最后显示出来是一个function，并不是undefined或者是string？

尽管 foo 被声明了两次，我们知道，在创建阶段，函数的创建是在变量之前的，并且如果属性名在activation object中已经存在的话，我们是会简单的跳过这个声明的。
因此，对 function foo()的引用在activation object上先被创建了，当解释器到达 var foo 时，我们会发现属性名 foo 已经存在了，因此代码什么都不会做，继续向下执行。

3. 为什么 bar 是undefined？

bar实际上是一个变量，并且被赋值了一个函数的引用。我们知道变量是在创建阶段被创建的，但是它们会被初始化为undefined，所以bar是undefined。希望现在你对JavaScript解释器如何执行你的代码能有一个好的理解了。理解execution context and stack会让你知道为什么你的代码有时候会输出和你最初期望不一样的值。

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

<h2 id="functionscope">作用域链（scope chain）</h2>  

先阅读（词法作用域）
作用域链:是由当前环境与上层环境的一系列变量对象组成，它保证了当前执行环境对符合访问权限的变量和函数的有序访问。是作用域的具体实施表现
```
var a = 10;
function fn() {
    var b = 20;
    function bar() {
        console.log(a + b)
    };
    return bar;
}
var x = fn(),
    b = 200;
x();
```

```
var a = 20;

function test() {
    var b = a + 10;

    function innerTest() {
        var c = 10;
        return b + c;
    }

    return innerTest();
}

test();
```
在上面的例子中，全局，函数test，函数innerTest的执行上下文先后创建。我们设定他们的变量对象分别为VO(global)，VO(test), VO(innerTest)。而innerTest的作用域链，则同时包含了这三个变量对象，所以innerTest的执行上下文可如下表示。
```
innerTestEC = {
    VO: {...},  // 变量对象
    scopeChain: [VO(innerTest), VO(test), VO(global)], // 作用域链
    this: {}
}
很多人会误解为当前作用域与上层作用域为包含关系，但其实并不是。以最前端为起点，最末端为终点的单方向通道我认为是更加贴切的形容。如图。
```

![作用域链](/img/5fd09372163bf05c34b3890287f88bd6.png)
是的，作用域链是由一系列变量对象组成，我们可以在这个单向通道中，查询变量对象中的标识符，这样就可以访问到上一层作用域中的变量了。

<h2 id="TypeConversion">闭包</h2>
应用的两种情况即可——函数作为返回值，函数作为参数传递
>假设函数A在函数B的内部进行定义了，并在函数B的作用域之外执行（不管是上层作用域，下层作用域，还有其他作用域），那么A就是一个闭包
```
var max = 10,
  fn = function(x) {
    if (x > max) {
      console.log(x)// 15
    }
  };
(function(f) {
  var max = 100;
  f(15);
})(fn)
```

```
var fn = null;
function foo() {
    var a = 2;
    function innnerFoo() { 
        console.log(a);
    }
    fn = innnerFoo; // 将 innnerFoo的引用，赋值给全局变量中的fn
}

function bar() {
    fn(); // 此处的保留的innerFoo的引用
}

foo();
bar(); // 2

```
在上面的例子中，foo()执行完毕之后，按照常理，其执行环境生命周期会结束，所占内存被垃圾收集器释放。但是通过fn = innerFoo，函数innerFoo的引用被保留了下来，复制给了全局变量fn。这个行为，导致了foo的变量对象，也被保留了下来。于是，函数fn在函数bar内部执行时，依然可以访问这个被保留下来的变量对象。所以此刻仍然能够访问到变量a的值。

这样，我们就可以称fn为闭包。

![作用域链](/img/afbdb2ad2330cf982d2b6fd2d6f3bc3a.png)


<h2 id="TypeConversion">原型</h2>


由于__proto__是每个对象都有的属性，而js 里面万物皆对象，所以会形成一条__proto__连起来的链条递归访问到__proto__必须是null，当js 引擎查找对象的属性的时候，会先查找对象本身会有该属性，如果不存在，会在原型链上查找，不会查找自身的prototype
![原型链](/img/877d6c73f3b810ddd1692fffd06c290b.png)
```
var A = function(){};
var a = new A();
console.log(a.__proto__); //Object {}（即构造器function A 的原型对象）
console.log(a.__proto__.__proto__); //Object {}（即构造器function Object 的原型对象）
console.log(a.__proto__.__proto__.__proto__); //null
```

<h2 id="TypeConversion">类型转换</h2>

console.log(1 + '2' + '2');
console.log(1 + + '2' + '2');
console.log('A' - 'B' + '2');
console.log('A' - "B" + 2);

  
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





























