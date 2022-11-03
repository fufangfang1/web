/**
 * @description: obj2混合obj1
 * @param {*} obj1
 * @param {*} obj2
 * @return {*} 新的对象
 */
function mixinObj(obj1, obj2) {
    // const newObj = {}
    // for (const prop in obj2) {
    //     newObj[prop] = obj2[prop]
    // }
    // for (const prop in obj1) {
    //     if (!(prop in newObj)) {
    //         newObj[prop] = obj1[prop]
    //     }
    // }
    // return newObj
    return Object.assign({}, obj1, obj2)
}

/**
 * @description: 克隆
 * @param {*} obj 克隆的原始对象
 * @param {*Boolean} deep 是否是深度克隆
 * @return {*} 克隆后的对象
 */
function clone(obj, deep) {
    // 先判断是不是数组
    if (Array.isArray(obj)) {
        if (deep) {
            // 如果深度克隆 递归数组
            const newArr = []
            for (let index = 0; index < obj.length; index++) {
                newArr[index] = clone(obj[index], deep)
            }
            return newArr
        }
        return [...obj]
    } else if (typeof obj === 'object') {
        const newObj = {}
        for (const prop in obj) {
            // 如果深度克隆 递归对象
            newObj[prop] = deep ? clone(obj[prop], deep) : obj[prop]
        }
        return newObj
    }
    // 原始类型和函数直接返回
    return obj
}

/**
 * @description: 函数防抖(高阶函数:函数的返回值是函数)
 * @param {*} callback 回调函数
 * @param {*} time 延迟时间
 * @return {*} 函数
 */
function debounce(callback, time) {
    let timer = null
    return function () {
        clearTimeout(timer)
        const _args = arguments
        timer = setTimeout(() => {
            callback.apply(null, _args)
        }, time)
    }
}


/**
 * @description: 函数节流
 * @param {*} callback 回调函数
 * @param {*} time 间隔时间
 * @param {*} immediately 是否立即执行
 * @return {*} 函数
 */
function throttle(callback, time, immediately = true) {
    if (immediately) {
        let timer;
        return function () {
            if (!timer || (Date.now() - timer) >= time) {
                callback.apply(null, arguments)
                timer = Date.now()
            }
        }
    } else {
        let timer;
        return function () {
            if (timer) {
                return;
            }
            const _argus = arguments
            timer = setTimeout(() => {
                callback.apply(null, _argus)
                timer = null
            }, time)
        }
    }
}

/**
 * !根据id找到数组中的value为id的对象
 * @param {Number} id 
 * @param {Array} arr 
 * @param {String} childName 默认值是children
 * @returns null 或者 object
 */
function getItemByArray(id, arr, childName = 'children') {
    if (!arr) return null;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
            return arr[i];
        }
        const result = getItemByArray(id, arr[i][childName])
        if (!result) {
            continue;
        }
        return result;
    }
    return null;
}

/**
 * @description: 刷新页面还原store的数据
 */
function initStoreData() {
    // 在页面加载时读取sessionStorage里的状态信息
    // 作用：防止页面刷新丢失store数据
    if (sessionStorage.getItem('store')) {
        this.$store.replaceState(
            Object.assign(
                {},
                this.$store.state,
                JSON.parse(sessionStorage.getItem('store'))
            )
        );
    }
    // 在页面刷新时将store里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
        if (this.$route.name !== loginRouterName) {
            sessionStorage.setItem('store', JSON.stringify(this.$store.state));
        }
    });
}

/**
 * 函数柯立化
 * 应用场景 ajax发送请求（type url params）
 * @param {*} fn 函数
 * @param {*} length 需要参数的个数
 */
var curry = (function () {
    /**
     * 固定参数才会fn的函数
     * @param {*} fn 应该执行的函数
     */
    function FixedParamsCurry(fn) {
        var _args = Array.prototype.slice.call(arguments, 1)
        return function () {
            var newArgs = _args.concat(Array.prototype.slice.call(arguments))
            return fn.apply(this, newArgs)
        }
    }
    return function (fn, length) {
        var length = length || fn.length
        return function () {
            if (arguments.length < length) {
                var combined = [fn].concat(Array.prototype.slice.call(arguments))
                return curry(FixedParamsCurry.apply(this, combined), length - arguments.length)
            } else {
                return fn.apply(this, arguments)
            }
        }
    }

})()


/**
 * 树形结构排序，根据汉字首字母
 * @param {*} arr 原始数据
 * @returns 
 */
function sortByPinYin(arr) {
    if (!arr) return;
    arr.sort((a, b) => a.label.localeCompare(b.label, 'zh'))
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].children) {
            arr[i].children = sortByPinYin(arr[i].children)
        }
    }
    return arr
}
