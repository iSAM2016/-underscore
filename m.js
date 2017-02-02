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
console.log(_)
}.call(this))