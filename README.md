# -underscore
learn underscore

isuess 
    1、_.isFunction(constructor) ？？？ 



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


Object 在理解
1高程（p148）
无论什么时候只要创建一个新函数，就会根据一组特定的规则为该函数创建一个prototype属性，
这个属性指向函数的原型对象。
在默认情况下，所有的原型对象都会自动获取一个constructor属性，这个属性包含指向protorype属性所在函数的指针。


理解:
1、只有函数对象有prototype属性
2、任何对象都有构造函数constructor
3、prototype不是函数
4、obj 的构造函数是obj.constructor（本质是函数）
5、函数的prototype属性只有该函数作为构造器构造一个对象时才有意义，他所指向的对象保存了构造出来的新对象所继承的属性
6、一切函数对象的构造函数都是 Function
7、当一个函数被声明时，这个函数的prototype属性的constructor属性值是这个函数的自身
8、第7点理解不了就算了，但事实就是这样，你可以验证一下


function employee(name,job,born)
{
this.name=name;
this.job=job;
this.born=born;
}

var bill=new employee("Bill Gates","Engineer",1985);


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
