

(function(){
//基本配置
  // Establish the root object, `window` in the browser, or `exports` on the server.
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

    var property = function(key) {
      return function(obj) {
        return obj == null ? void 0 : obj[key];
      };
    };

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
          //optimizeCb(iteratee, context, 4);
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

      _.property = property;

    _.contains = _.includes = _.include = function(obj, item, fromIndex, guard){
        if (!isArrayLike(obj))  obj = _.values(obj);
        /**
        * note
        */
       
        if (typeof fromIndex != 'number' || guard) fromIndex = 0;
        return _.indexOf(obj, item, fromIndex) >= 0;
    }

    function collectNonEnumProps(obj, keys) {
      var nonEnumIdx = nonEnumerableProps.length;
      var constructor = obj.constructor;
      var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;
                                                //window (obj)            // Object (obj)
      // Constructor is a special case.
      var prop = 'constructor';
      if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

      while (nonEnumIdx--) {
        prop = nonEnumerableProps[nonEnumIdx]
        if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
          keys.push(prop);
        }
      }
    }
    //https://github.com/hanzichi/underscore-analysis/issues/3

     _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);

     
    _.keys = function(obj) {
        if (!_.isObject(obj)) return [];
        if (nativeKeys) return nativeKeys(obj);
        var keys = [];

        for (var key in obj) if (_.has(obj, key)) keys.push(key);
        // Ahem, IE < 9.
        if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
      };


      // 2016年11月22日
      /*map_.map(list, iteratee, [context]) Alias: collect
        通过转换函数(iteratee迭代器)映射列表中的每个值产生价
        值的新数组。iteratee传递三个参数：value，然后是迭代 
        index(或 key 愚人码头注：如果list是个JavaScript对象是，
        这个参数就是key)，最后一个是引用指向整个list。
      */

      var cb = function(value,context,argCount){
        //iteratee, context 
          if( value === null ) return _.identity;
          if(_.isFunction(value)) {
             return optimizeCb(value, context, argCount)
          } 
            console.log(value)
          if(_.isObject(value))  return _.matcher(value)
            return _.property(value)
       }

           // An internal function for creating assigner functions.
           /*
            * 
           */
      var createAssigner = function(keysFunc, undefinedOnly) {

          return function( obj ){
            var length = arguments.length;
            //当没有obj 和 attr符合的判断条件
            //或者obj为空
            if( length < 2 ||  obj === null ) return obj
              for( var index = 1; index < length; index++ ){
                var  source = arguments[index],
                     keys = keysFunc( source ),
                     l = keys.length;
                     console.log(keys)
                     for (var i = 0; i < l; i++) {
                      var key = keys[i];
                      /*
                      *
                      */
                       if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];

                     }
              }
              return obj;
          }
      };

      _.map = _.collect = function(obj, iteratee, context){
        
        iteratee = cb(iteratee, context);
        console.log(iteratee)

        var keys = !isArrayLike(obj) && _.keys( obj ),
            length = (keys || obj).length,
            results = Array(length);

        for(var index = 0; index < length; index++){
            var currentKey = keys ?  keys[index] : index
            results[index] = iteratee( obj[currentKey], currentKey, obj)

        }    

        return results
      }

     /* reduce_.reduce(list, iteratee, [memo], [context]) Aliases: inject, foldl
      别名为 inject 和 foldl, reduce方法把list中元素归结为一个单独的数值。Memo是
      reduce函数的初始值，reduce的每一步都需要由iteratee返回。这个迭代传递4个参
      数：memo,value 和 迭代的index（或者 key）和最后一个引用的整个 list。
      如果没有memo传递给reduce的初始调用，iteratee不会被列表中的第一个元素调用。
      第一个元素将取代 传递给列表中下一个元素调用iteratee的memo参数。
                                                                      */

     _.reduce = _.foldl = _.inject = createReduce(1)

    
     function createReduce (dir){
        function iterator(obj, iteratee, memo, keys, index, length  ){
          for (; index >= 0 && index < length; index+= dir){
            var currentKey = keys ? keys[index] : index;
            memo  =  iteratee(memo, obj[currentKey], currentKey, obj);


          }
          return memo;
        }


        return function(obj, iteratee, memo,context){
            iteratee = optimizeCb(iteratee, context, 4);

            //case 4: return function(accumulator, value, index, collection) {
            //return func.call(context, accumulator, value, index, collection);
            var keys = !isArrayLike(obj) && _.keys(obj),
                length = (keys || obj).length,
                index = dir> 0 ? 0 : length-1;

                if(arguments.length < 3){
                  memo = obj[keys ? keys[index] : index]
                  index += dir;
                }
              return iterator(obj, iteratee, memo, keys, index, length);
          };
        }

  /*find_.find(list, predicate, [context]) Alias: detect

在list中逐项查找，返回第一个通过predicate迭代函数真值检测
的元素值，如果没有值传递给测试迭代器将返回undefined。 如果
找到匹配的元素，函数将立即返回，不会遍历整个list。
*/

   function createPredicateIndexFinder(dir){

    return function(array, predicate, context){
        predicate = cb(predicate,context )
       var length = getLength(array);
       var index = dir > 0  ? 0  : length - 1

       
      for(; index >= 0&& index <length; index+=dir){
        if(predicate(array[index], index, array)) return index 
      }
      return -1;
    }
   }



 // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
 
  _.findKey = function(obj,obj, predicate, context){
     predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  }

  _.find = _.detect = function(obj,predicate,context){
    var key;
    if (isArrayLike(obj)){

        key = _.findIndex(obj,predicate,context)
    }else{
        key = _.findKey(obj,predicate,context)
    }
      if (key !== void 0 && key !== -1) return obj[key];
  }


/*filter_.filter(list, predicate, [context]) Alias: select
遍历list中的每个值，返回包含所有通过predicate真值检测的元素值。
（愚人码头注：如果存在原生filter方法，则用原生的filter方法。）
*
* 对于_.find 和 _filter 的比较；find 提供前后的顺序的访问 
*/
  _.filter = _.select = function( obj,predicate,context ){
      var results = [];
      predicate = cb(predicate, context);
    
      _.each( obj, function(value,index, list) {
        if( predicate( value,index,list ))  results.push(value) 
      });
      return results
  }


/*where_.where(list, properties)
遍历list中的每一个值，返回一个数组，这个数组包含properties所列出的
属性的所有的 键 - 值对。
*/
 _.extendOwn = _.assign = createAssigner(_.keys);

 _.isMatch = function( object,attrs ){
 
  var keys = _.keys(attrs), length = keys.length;
  if( object == null ) return !length;
   var obj = Object(object);
    for (var i =0 ; i < length; i++){
      var key = keys[i];
      if( attrs[key] !== obj[key] || !(key in obj)) return false
    }

   return true

 }


  _.where = function( obj, attrs ){
      return _.filter(obj,_.matcher(attrs));
  }

  _.matcher = function( attrs ){
    attrs = _.extendOwn({},attrs);
    return function( obj ){
         return _.isMatch(obj, attrs);
    }
  }


/*findWhere_.findWhere(list, properties)
遍历整个list，返回匹配 properties参数所列出的所有 键 - 值 对的第一
个值。如果没有找到匹配的属性，或者list是空的，那么将返回undefined。
*/
  _.findWhere = function( obj,attrs ){
    return _.find( obj, _.matcher(attrs) )
  }

  _.negate = function(predicate) {
    return function(){
      return !predicate.apply( this,arguments )
    }
  };

  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  //every_.every(list, [predicate], [context]) Alias: all
//如果list中的所有元素都通过predicate的真值检测就返回true。（愚人码头注：如果存在原生的every方法，就使用原生的every。）

  _.every =_.all = function(obj, predicate, context){
    predicate = cb(predicate,context)
     var keys = !isArrayLike(obj) && _.keys(obj),
     length = ( keys || obj ).length;

     for(var i  = 0; i < length; i++){
        var currentkey = keys ?  keys[i]: i;
        if( !predicate( obj[currentkey], currentkey, obj )) return false 
     }

   return true
     
  }


  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };



}.call(this))
