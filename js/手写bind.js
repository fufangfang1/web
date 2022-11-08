/**
 * 手写bind函数
 * @param {*} oThis this指向的对象
 * @returns 新的函数
 */
Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
        // 与 ECMAScript 5 最接近的 
        // 内部 IsCallable 函数
        throw new TypeError("Function.prototype.bind - what is trying " + "to be bound is not callable")
    }
    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () { },
        fBound = function () {
            console.log(this, oThis)
            return fToBind.apply(
                (this instanceof fNOP && oThis ? this : oThis), aArgs.concat(Array.prototype.slice.call(
                    arguments))
            )
        };
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
};