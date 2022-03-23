// 发布订阅模式
const eventObj = {
    clientList: {},
    listen: function (key, fn) {
        if (!this.clientList[key]) {
            this.clientList[key] = []
        }
        this.clientList[key].push(fn)
    },
    trigger: function () {
        var key = Array.prototype.shift.call(arguments)
        fns = this.clientList[key]

        if (!fns || fns.length === 0) {
            return false
        }
        for (var i = 0, fn; fn = fns[i++];) {
            fn.apply(this, arguments)
        }
    }
}
/**
 * 给构造函数原型增加发布订阅事件
 * @param {Class} constructor 
 */
const installEvent = function (constructor) {
    for (var key in eventObj) {
        constructor.prototype[key] = eventObj[key]
    }
}