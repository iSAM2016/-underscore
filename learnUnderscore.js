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

      _.keys = function(obj) {
        if (!_.isObject(obj)) return [];
        if (nativeKeys) return nativeKeys(obj);
        var keys = [];

        for (var key in obj) if (_.has(obj, key)) keys.push(key);
        // Ahem, IE < 9.
        if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
      };


问题集中在collectNonEnumProps 函数
第49行 的判断依据和原理是啥
第57行 的判断依据和原理是啥

