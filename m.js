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
        for(var key in obj) if(_.has(obj,key)) keys.push(key)
        if(hasEnumBug) collectNonEnumProps(obj,keys);
        return keys;
    }
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

    var cd = function(value, context, argCount){
        if(value == null) return value
        if(_.isFunction(value))  return optimizeCb(value, context, argCount);
        /*不理解*/if(_.isObject(value)) return _.matcher(value);
            return _.property(value)
    }

    _.map = _.collect = function(obj, iteratee, context){
        iteratee = cd(iteratee, context);
        console.log(iteratee)
        var keys = !isArrayLike(obj) &&  _.keys(obj),
            length = (keys || obj).length;
            result = Array(length)
             for (var index = 0; index < length; index++) {
                var currentKey  = keys ? keys[index] : index 
                result[index] = iteratee(obj[currentKey])
             };
             return result;
    };

    //检查对象是否具有给定的关键字：值对。
    /*不理解*/_.matcher = function(attrs){
        attrs = _.extendOwn({},attrs);
        return function (obj){
            return _.isMatch(obj, attrs);
        };
    };

}.call(this))