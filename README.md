# -underscore
learn underscore

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
