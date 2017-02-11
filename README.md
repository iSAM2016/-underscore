# underscore
>参考[亚里士朱德的博客](http://yalishizhude.github.io/2015/09/22/underscore-source/)

###问题
1. 测试
2. if(typeof /./ != 'function' && typeof Int8Array != 'object'){
3. collectNonEnumProps 函数
4. _.keys = function(obj) {}
    if (!_.isObject(obj))

5. optimizeCb 中argu

6. (!undefinedOnly || obj[key] === void 0) 

---

###闭包

* IIFE 将window穿入进去
* JS中(function(){xxx})()

* 包围函数（function(){})的第一对括号向脚本返回未命名的函数，随后一对空括号立即执行返回的未命名函数，括号内为匿名函数的参数。
 其他写法
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



###原型
####原型赋值
*  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
  * Array,Object,Function 本质上都是函数，获取函数原型属性prototype也是为了便于压缩，如果代码中药扩展属性，
    Object.prototype.xxx = ....
  > 这种代码是不可压缩，Object prototype 这些名字修改了浏览器不认识，刚知道啊
  > 一段代码使用两次都应该定义成变量


#####Object 在理解
1. 高程（p148）
  * 无论什么时候只要创建一个新函数，就会根据一组特定的规则为该函数创建一个prototype（属性值是个对象）
属性，这个属性指向函数的原型对象。

  * 在默认情况下，所有的原型对象都会自动获取一个constructor属性，这个属性包含指向protorype
属性所在函数的指针。



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

      * 文字版：  每个对象都有一个__proto__属性，指向创建该对象的函数的prototype。
          ```
          eg: bill.__proto__ === Employee.protitype  //true

          eg: var obj={}
               obj.__proto__ === Object.prototype  //true
               Object.prototype.__proto__ === null //true
    
          最终的__proto__ 都要指向 Object.prototype（考虑Object.prototype.__proto__,而Object.prototype.__proto__ 是个特例是null 固定的）

          函数是特殊的对象，他当然也是有__proto__
          Object.__proto__ === Functon.prototype
          函数是有Function函数来创建的,所以函数的__proto__ 指向的是Function 函数的prototype而, Function的prototye 是一个对象，他的__proto__ 指向的是Object 函数的protype.
          ```
  
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
      bill.prototype        //undifined
      bill.constructor === employee.prototype.constructor
                            //function employee(name,job,born){this.name=name;
                              this.job=job;thisborn=born;} //实例是个对象，指向构造函数

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






























