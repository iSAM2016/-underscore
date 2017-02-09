(function(){
    //issure 
    // 1 collectNonEnumProps
    //2 如果没有理解会标记/ *不理解*/


    var root = this;
    var nativeKeys = Object.keys;
    /**
    * 名称
    */
    var _ = function(obj){
        //如果window对象 不是_函数的实例
        if(!(this instanceof _)) return new _(obj);
    }
     // Save bytes in the minified (but not gzipped) version:
     var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

    // Create quick reference variables for speed access to core prototypes.
    var
        push             = ArrayProto.push,
        slice            = ArrayProto.slice,
        toString         = ObjProto.toString,
        hasOwnProperty   = ObjProto.hasOwnProperty;
    /**
    * 导出函数  node.js requier()  普通调用
    */
    if(typeof exports !== 'undefined'){
        if(typeof module !== 'undefined' && module.exports){
            exports = module.exports = _;
        }
        exports._ = _;
    }else{
        root._ = _;
    }

    // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
    var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
    var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
    function collectNonEnumProps(obj, keys) {
        var nonEnumIdx = nonEnumerableProps.length;
        var constructor = obj.constructor;
        var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

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
    /*不理解*/
    var property = function(key){
        return function (obj){
            return obj == null ? void 0 : obj[key];
        }
    }
    var property = function(keys){
        return function(obj){
            reutrn  obj === null ? void 0 :  obj[keys]; 
        }
    }

    _.property = property;

    /**
    * 获取集合长度
    */
    var getLength = function(collection){
        return collection.length
    }

    /**
    * 判断是否为数组，利用数组的长度
    */
    var MAX_ARRAY_INDEX = Math.pow(2,53)-1
    var isArrayLike = function(collection){
        var length = getLength(collection)
        return typeof length === 'number' && length >=0 && length <= MAX_ARRAY_INDEX
    }

    var optimizeCb = function(func, context, argCount){
        if(context === void 0) return func;
        switch (argCount == null ? 3 : argCount){
            case 3: return function(value, index, collection){
                 return func.call(context,value,index,collection)
            }
        }
    }

    var cd = function(value, context, argCount){
        if(value == null) return value
        if(_.isFunction(value))  return optimizeCb(value, context, argCount);
        /*不理解*/if(_.isObject(value)) return _.matcher(value);
            return _.property(value)
    }

    //复制对象 在extend extendowen 复制对象
    //undefinedOnly  不清楚
    var createAssigner = function(keysFunc, unde){
        return function(obj){
            var length = argument.length;
            //当只有一个参数或者没有参数的时候
            if(length < 2 || obj == null) return obj;
            for (var index = 1; index < length; index){
                var source = argument[index],
                    keys = keysFunc(source),
                    l = keys.length;

                 for(var l = 0; i < l; i++){
                    var key = keys[i];
                    if(!undefinedOnly || obj[key] === void 0 ) obj[key] = source[key]; 
                 }   
            }
            return obj;
        };
    }; 
    //findIndex findLastIndex
    //正反顺序遍历
    function createPredicateIndexFinder(dir){
        //dir 判断是findIndex  还是findlastIndex
        return function(array, predicate, context){
            predicate = cd(predicate, context);
            var length = getLength(array);
            var index = dir > 0 ?  0 : length - 1;
            for(; index >= 0 && index < length; index += dir){
                if(predicate(array[index], index, array)) return 1;
            }
            return -1;
        }
    }

    _.each = _.forEach = function(obj, iteratee, context){
        iteratee = optimizeCb(iteratee,context);
        var i ,length;
        if(isArrayLike(obj)){
            for(i=0; i<obj.length;i++){
                iteratee(obj[i],i,obj)
            }
        }else{
            var keys = _.keys(obj);
            console.log(keys)
            for(i=0, length = keys.length; i < length;i++){
                iteratee(obj[keys[i]],keys[i],obj)
            }
       } 
    }

    _.keys = function(obj){
        if(!_.isObject(obj)) return [];
        if(nativeKeys) return nativeKeys(obj);
        var keys = [];
        for (var key in obj) if(_.has(obj,key)) keys.push(key)
        if(hasEnumBug) collectNonEnumProps(obj,keys);
        return keys;
    }
      // Retrieve all the property names of an object.
    _.allKeys = function(obj) {
        if (!_.isObject(obj)) return [];
        var keys = [];
        for (var key in obj) keys.push(key);
        // Ahem, IE < 9.
        if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
    };

    //javascript 函数和object都是对象,其中null 也是object 要注意使用!!object 来判断
    _.isObject = function(obj){
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj; 
    }
    //判断是否拥有该属性
    _.has = function(obj, key){
        return obj != null && hasOwnProperty.call(obj,key);
    }

    //判断是否是函数
    _.isFunction =function(obj){
        return typeof obj === 'function' || false;
    }


    _.map = _.collect = function(obj, iteratee, context){
        iteratee = cd(iteratee, context);
        var keys = !isArrayLike(obj) &&  _.keys(obj),
            length = (keys || obj).length;
            result = Array(length)

             for (var index = 0; index < length; index++) {
                var currentKey  = keys ? keys[index] : index 
                result[index] = iteratee(obj[currentKey])
             };
             return result;
    };
    _.extend = createAssigner(_.allKeys);
    
    _.extendOwn = _.assign = createAssigner(_.keys)
    //检查对象是否具有给定的关键字：值对。
    /*不理解*/_.matcher = function(attrs){
        attrs = _.extendOwn({},attrs);
        return function (obj){
            return _.isMatch(obj, attrs);
        };
    };

    _.findIndex = createPredicateIndexFinder(1);
    _.findLastIndex = createPredicateIndexFinder(-1);

    //find 
    _.find = _.detect = function(obj, predicate, context){
        var key;
        if(isArrayLike(obj)){
            //数组寻找
            key =  _.findIndex(obj, predicate, context);
        }else{
            // 对象寻找
            key = _.findKey(obj, predicate, context )
        }
        if(key !== void 0 && key !== -1) return obj[key];
    }

    _.findKey = function(obj, predicate, context){
        predicate = cb(predicate, context);
        var keys = _.keys(obj),key;
        for(var i = 0;  length = keys.length; i < length){
             key = keys[i];
            if(predicate(obj[key], key, obj)) return key;
        }
    }
    //过滤符合条件的值
    _.filter = _.select = function(obj, predicate, context){
        var results = [];
        predicate = cb(predicate,context);
        _.each(obj, function(varlue, index, list){
            if(predicate(value, index, list)) results.push(value)
        });
        return results;
    }

    //检查properties中的键和值是否包含在object中
    _.isMatch = function(obj, attrs){
        var keys = _.keys(attrs), length = keys.length;
        if(obj === null) return !length;
        /*不明白*/
        var obj = Object(obj);
         for (var i = 0; i < length; i++) {
             var key = keys[i];
             if(attrs[key] !== obj[key] || !(key in obj)) return false
        }
        return true;
    }

    //全部通过测试返回true
    _.every = _.all = function(obj, predicate, context){
        predicate = cd(predicate, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length;
        for(var index = 0; index < length; index++){
            var currentKey = keys ? keys[index] : index;
            if(!predicate(obj[currentKey], currentKey, obj)) return false;
        }
        return true;
    }

    function createIndexFinder(dir, predicateFind, sortedIndex) {
        return function(array, item, idx) {
          var i = 0, length = getLength(array);
          if (typeof idx == 'number') {
            if (dir > 0) {
                i = idx >= 0 ? idx : Math.max(idx + length, i);
            } else {
                length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
            }
          } else if (sortedIndex && idx && length) {
            idx = sortedIndex(array, item);
            return array[idx] === item ? idx : -1;
          }
          if (item !== item) {
            idx = predicateFind(slice.call(array, i, length), _.isNaN);
            return idx >= 0 ? idx + i : -1;
          }
          for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
            if (array[idx] === item) return idx;
          }
          return -1;
        };
    }

    // Return the position of the first occurrence of an item in an array,
    // or -1 if the item is not included in the array.
    // If the array is large and already in sort order, pass `true`
    // for **isSorted** to use binary search.
     _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
     _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

    //如果list中包含指定的value 
    _.contains = function(obj, item, fromINdex){
        if(!isArrayLike(obj)) obj = _.values(obj);
        if(typeof fromIndex != 'number' || guard) fromIndex = 0;
        return _.indexOf(obj, item, fromINdex) >= 0;
    }
    //返回指定属性的返回值
    _.pluck = function(obj, key) {
        return _.map(obj, _.property(key));
    };


}.call(this))