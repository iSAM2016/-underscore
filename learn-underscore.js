//2016年11月6日18:13:10
/**
*JavaScript实用库，提供了一整套函数式编程的实用功能，但是没有扩展任何JavaScript内置对象。它是这个问
*/
//函数整体

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

    note: line 50
          line 117  
*/

(function(){
//基本配置
    var  root = this;
    
    var
        nativeKeys         = Object.keys;

    // Save bytes in the minified (but not gzipped) version:
    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
    
    var
         hasOwnProperty   = ObjProto.hasOwnProperty;
/**
* 没有研究套 
*/
     var _ = function(obj) {
        console.log('root')
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    };


/**
* --没有研究套 
*/
   

    if( typeof exports !== "undefined" ){
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    }else{

        root._ = _
    }




    var getLength = function(collection){
     return collection.length
     }

    var MAX_ARRAY_INDEX = Math.pow(2,53) - 1
      var isArrayLike = function(collection){
          var length = getLength( collection )  
          return  typeof length === "number" && length >=0 && length  <= MAX_ARRAY_INDEX;   
      }

      /**
      *  绑定context 主要是改变迭代器的绑定,
      *  
      *  在Es5 之前，window 下的undifined 是可以被重写的，于是导致了一定的差错  
      */
    var optimizeCb = function(func, context, argCount) {
        if (context === void 0) return func;
        switch (argCount == null ? 3 : argCount) {
          case 1: return function(value) {
            return func.call(context, value);
          };
          case 2: return function(value, other) {
            return func.call(context, value, other);
          };
          case 3: return function(value, index, collection) {
            return func.call(context, value, index, collection);
          };
          case 4: return function(accumulator, value, index, collection) {
            return func.call(context, accumulator, value, index, collection);
          };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

    //集合函数 (数组 或对象)
    _.each = _.forEach = function(obj, iteratee, context){
          iteratee = optimizeCb(iteratee, context);
          var i,length;
         if(isArrayLike(obj)){
            for(i = 0, length = obj.length; i < length; i++){

                iteratee(obj[i],i, obj)
            }
         }else{
           
            /**
            * Object.keys，该方法返回对象属性一个数组
            */
          
            var keys =  _.keys(obj)
          
            for (i = 0, length = keys.length; i < length; i++) {
            iteratee(obj[keys[i]], keys[i], obj);
          }

         }
         return obj
    }

/*遍历list中的所有元素，按顺序用遍历输出每个元素。
        如果传递了context参数，则把iteratee绑定到context对象上。每次
    调用iteratee都会传递三个参数：(element, index, list)。
        如果没有context 参数，optimizeCb直接返回iteratee,在iteratee上
    进行循环遍历  
        如果list是个JavaScript对象，iteratee的参数是 (value, key, list))。
    返回list以方便链式调用。（愚人码头注：如果存在原生的forEach方法，
    Underscore就使用它代替。）
*/

/**
* to determine object
*                1   typeof
*                2   instanceof  dott well, because instnaceof dott distinguish
*                    between array and object . licks
*
*                    fn : return (obj instanceof  Object)
*                    eg1: fn({}) // true
*                    eg2: fn([]) // true
*
*                3   Object.prototype.toString.call( obj )
*                       this ways is better
*
*/

    _.isObject = function(obj){
        var type = typeof obj
        console.log(type)
          return type === "function" || type=== "object" && !!obj 
    }

    // Shortcut function for checking if an object has a given property directly
    // on itself (in other words, not on a prototype).
    _.has = function(obj, key) {
        return obj != null && hasOwnProperty.call(obj, key);
    };
 

 /*
    *for-in
    *遍历可枚举的属性
    *有浏览器的兼容问题 IE< 9
    * IE < 9 下不能用 for in 来枚举的 key 值集合
            var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
    *                
    * propertyIsEnumerable是检测属性是否可用 for...in 枚举                
    *
    */
     var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
     //IE < 9 cntt use (for in)
     var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];


   /* Unsuited   use because IE < 9 "toString"  have problem
    _.isFunction = function(obj){
      
      return Object.prototype.toString( obj ).toLowerCase() === "[object function]"
    }*/

    if(typeof /./ != 'function' && typeof Int8Array != 'object'){
       _.isFunction = function(obj){
        return typeof obj === "function"  || false
      }
    }

    _.contains = _.includes = _.include = function(obj, item, fromIndex, guard){
        if (!isArrayLike(obj))  obj = _.values(obj);
        /**
        * note
        */
        if (typeof fromIndex != 'number' || guard) fromIndex = 0;
        return _.indexOf(obj, item, fromIndex) >= 0;
    }

    function collectNonEnumProps(obj, keys) {
      console.log(12100)
      var nonEnumIdx = nonEnumerableProps.length;
      var constructor = obj.constructor;
      var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;
                                                //window (obj)            // Object (obj)
      // Constructor is a special case.
      var prop = 'constructor';
      if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

      while (nonEnumIdx--) {
        prop = nonEnumerableProps[nonEnumIdx];
        if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
          keys.push(prop);
        }
      }
    }
//https://github.com/hanzichi/underscore-analysis/issues/3


    _.keys = function(obj) {
      console.log(!_.isObject(obj)+ "boool")
        if (!_.isObject(obj)) return [];
        console.log(nativeKeys +"nativeKeys")
        if (nativeKeys) return nativeKeys(obj);
        var keys = [];

        for (var key in obj) if (_.has(obj, key)) keys.push(key);
        // Ahem, IE < 9.
console.log(211212)
console.log(keys)
        if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
      };


}.call(this))
