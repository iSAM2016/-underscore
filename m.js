(function(){
    var root = this;
    var nativeKeys = Object.keys;
    /**
    * 名称
    */
    var _ = function(obj){
        //如果window对象 不是_函数的实例
        if(!(this instanceof _)) return new _(obj);
    }

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
        console.log(nativeKeys(obj))
        if(nativeKeys) return nativeKeys(obj);
    }

    _.isObject = function(){

    }

}.call(this))