# -underscore
learn underscore

isuess 
   
    2 if(typeof /./ != 'function' && typeof Int8Array != 'object'){

#######

//IIFE 将window穿入进去
//JS中(function(){xxx})()
/*
* 包围函数（function(){})的第一对括号向脚本返回未命名的函数，随后一对空括号立即执行返回的未命名函数，括号内为匿名函数的参数。
* 其他写法
* (function () {  code  } ()); 
* !function () {  code  } ();
* ~function () {  code  } ();
* -function () {  code  } ();
* +function () {  code  } ();
  函数声明：  function name(){}
  函数表达式：var fnname = function(){}
  匿名函数：  function(){} 匿名函数属于函数表达式

  两者最主要的区别是： 一： 变量提升
                       二： 函数表达式可以在后面添加扩看，但是命名函数不行吧

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
#######原型

Object 在理解
1高程（p148）
无论什么时候只要创建一个新函数，就会根据一组特定的规则为该函数创建一个prototype（属性值是个对象）
属性，这个属性指向函数的原型对象。

在默认情况下，所有的原型对象都会自动获取一个constructor属性，这个属性包含指向protorype
属性所在函数的指针。



/**
* 原型和原型链 
* 参考王福朋博客
* http://www.cnblogs.com/wangfupeng1988/tag/%E5%8E%9F%E5%9E%8B/
*/
一： 略
二： 函数和对象的关系
    
    函数是对象的一种，对象都是函数创建的。eg:

      function Employee(name,job,born)
      {
      this.name=name;
      this.job=job;
      this.born=born;
      }

      var bill=new Employee("Bill Gates","Engineer",1985);

三：prototype 原型
  原型和函数的关系已经在开篇已经交代了

四：__proto__ 隐式原型
    每个对象都有一个隐式的属性，但是有些浏览器是不会让你发现的  

    文字版：  每个对象都有一个__proto__属性，指向创建该对象的函数的prototype。

    eg: bill.__proto__ === Employee.protitype  //true

    eg: var obj={}

        obj.__proto__ === Object.prototype  //true
        Object.prototype.__proto__ === null //true

    最终的__proto__ 都要指向 Object.prototype（考虑Object.prototype.__proto__）

    函数是特殊的对象，他当然也是有__proto__
    Object.__proto__ === Functon.prototype

五： instanceof 运算
      Instanceof运算符的第一个变量是一个对象，暂时称为A；第二个变量一般是一个函数，暂时称为B。
      运算规则：沿着A的__proto__ 这条线来找，同时沿着B 的prototype 这条线来找，如果两条线能同
                时找到同一个对象，那么就返回true，如果找到终点还没有找到，则返回false
                console.log(Object instanceof Function) //true
                console.log(Function instanceof Object) //true
                console.log(Function instanceof Function) //true
                console.log(Object instanceof Object) //true





bill.prototype        //undifined
bill.constructor === employee.prototype.constructor
                      //function employee(name,job,born){this.name=name;
                        this.job=job;thisborn=born;} //实例是个对象，指向构造函数

employee.constructor  //function Function() { [native code] }


var obj={}
obj.constructor       //function Object() { [native code] }   

错误的理解Object是个纯对象!!!
    比如 obj = {} 和 Object 是一个级别的对象，Object还是个函数.
    MDN 中描述到Object：
        对象构造函数为给定值创建一个对象包装器。如果给定值是  null or undefined，将会创建并返回一个空对象，否则，将返回一个与给定值对应类型的对象。
        当以非构造函数形式被调用时，Object 等同于 new Object()。

        typeof Object   //function                 
        typeof obj      //object

        所以Object 更加详细的描述就是function  


扩展
new形式创建对象的过程实际上可以分为三步：

第一步是建立一个新对象（叫A吧）；

第二步将该对象（A）内置的原型对象设置为构造函数(就是Person)prototype 属性引用的那个原型对象；

第三步就是将该对象（A）作为this 参数调用构造函数(就是Person)，完成成员设置等初始化工作。      


在function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;
    ...
  }中(_.isFunction(constructor) && constructor.prototype) || ObjProto ？？？

   这是访问实例原型的一种方法：
        constructor.prototype ==> window(obj)
        ObjProto              ==> object(obj)

        没有发现_.isFunction(constructor)





const addtocart = productId => (a,b) =>{
  console.log()
}

======》

function addtocart(product){
  return function(a,b){
      console.log(a)
  }
} 



getAddedIds( state )
    .reduce((total,id) =>{

      return total + getProduct(state, id).price * getQuantity(state, id)
      },0)
    
    .toFixed(2)

  没有写 {} 的时候就有return