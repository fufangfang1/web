// import { installEvent } from '../designMode/PublishSubscribe'

/**
 * 自定义ScrollBar
 */
class ScrollBar {

    constructor(options) {
        this.height = options.height; // 容器的高度
        this.scrollWrapper = options.scrollWrapper;//容器元素

        this.scrollContent = options.scrollContent;// 容器元素的内部包裹元素

        this.scrollBar;// 滚动条
        this.scrollBarColor = options.scrollBarColor;// 滚动条的颜色
        this.scrollWidth = options.scrollWidth || 10; // 滚动条的宽度 默认10px

        this.scrollBarContent; // 滚动条的容器
        this.scrollBarContentColor = options.scrollBarContentColor;// 滚动条容器的颜色


        this.setScrollWrapperStyle()

        this.addScrollBarContent()

        this.addListenerScrollBar()

        this.addListenerScrollWrapper()

        this.addScrollBarContentClick()

        // 监听页面滑动和滚动条滑动事件从而设置位置
        this.listen('scrollChange', function (originTop) {
            const resultTop = this.rollingBoundaryJudgment(originTop)
            this.setPosition(resultTop)
        })
    }

    /**
     *  设置容器的样式
     */
    setScrollWrapperStyle() {
        this.scrollWrapper.style.position = 'relative'
        this.scrollWrapper.style.overflow = 'hidden'
        this.scrollWrapper.style.height = this.height + 'px'
        this.scrollWrapper.style.paddingRight = this.scrollWidth + 'px';
        this.scrollWrapper.style.boxSizing = 'border-box';
        this.scrollContent.style.boxSizing = 'border-box';
        this.scrollContent.style.width = '100%';
        this.scrollContent.style.height = '100%';
        this.scrollContent.style.overflow = 'hidden';
    }

    /**
     * 给滚动条添加滚动的容器
     */
    addScrollBarContent() {
        const div = document.createElement('div');
        div.className = 'scroll-bar-content';
        this.scrollBarContent = div
        this.setScrollBarContentStyle()
        this.scrollWrapper.appendChild(this.scrollBarContent);
        this.addScrollBar()
    }

    /**
     * 设置滚动条容器的样式
     */
    setScrollBarContentStyle() {
        this.scrollBarContent.style.position = 'absolute';
        this.scrollBarContent.style.top = '0';
        this.scrollBarContent.style.right = '0';
        this.scrollBarContent.style.height = '100%';
        this.scrollBarContent.style.width = this.scrollWidth + 'px';
        this.scrollBarContent.style.backgroundColor = this.scrollBarContentColor
    }

    /**
     * 添加滚动条元素以及设置高度
     */
    addScrollBar() {
        // 容器的内部包裹元素视口高度
        const scrollHeight = this.scrollContent.scrollHeight
        // 容器的内部包裹元素的滚动高度
        const clientHeight = this.scrollContent.clientHeight
        // 设置滚动条的样式
        this.scrollBar = document.createElement('div');
        this.setScrollBarStyle()
        // 计算出来滚动条该有的高度
        this.scrollBar.style.height = clientHeight * clientHeight / scrollHeight + 'px'
        // 插入到滚动条容器中
        this.scrollBarContent.appendChild(this.scrollBar)
    }

    /**
     * 设置滚动条的样式
     */
    setScrollBarStyle() {
        this.scrollBar.className = 'scroll-bar'
        this.scrollBar.style.width = '100%'
        this.scrollBar.style.backgroundColor = this.scrollBarColor
        this.scrollBar.style.position = 'absolute'
        this.scrollBar.style.top = '0';
        this.scrollBar.right = '0';
    }

    /**
     * 监听滚动条的下拉事件
     */
    addListenerScrollBar() {
        const that = this
        this.scrollWrapper.ondragstart = function () {
            return false
        }
        this.scrollBar.onmousedown = function (point) {
            const originTop = that.scrollBar.offsetTop
            that.scrollWrapper.onmousemove = function (e) {
                let top = e.pageY - point.pageY + originTop
                that.trigger('scrollChange', top)
            }
        }
        document.onmouseup = function () {
            that.scrollWrapper.onmousemove = null;
        }
    }

    /**
     * 点击滚动条容器的事件
     */
    addScrollBarContentClick() {
        const that = this
        this.scrollBarContent.onclick = function (e) {
            if (e.target === that.scrollBarContent) {
                const barHeight = that.scrollBar.clientHeight
                let top = e.offsetY
                if (e.offsetY >= barHeight) {//点击进度条容器下方
                    top = e.offsetY - barHeight;
                }
                that.trigger('scrollChange', top)
            }
        }
    }

    /**
     * 监听容器鼠标滑动事件
     */
    addListenerScrollWrapper() {
        var that = this;
        this.scrollWrapper.onwheel = function (e) {
            let originTop = that.scrollBar.offsetTop
            if (e.deltaY > 0) {
                originTop += 10
            } else {
                originTop -= 10
            }
            that.trigger('scrollChange', originTop)
        }
    }

    /**
     * 滚动边界判定
     * @param {Number} top 获取到滚动条移动的top值
     * @return {Number} result 最终移动距离
     */
    rollingBoundaryJudgment(top) {
        const scrollBarHeight = this.scrollBar.clientHeight;
        const clientHeight = this.scrollContent.clientHeight
        const maxTop = clientHeight - scrollBarHeight;
        if (top >= maxTop) { //比最大移动距离大
            top = maxTop
        }
        if (top <= 0) { //移动负值
            top = 0
        }
        return top;
    }

    /**
     * 改变位置
     * @param {*} top 滚动条移动的最终top值
     */
    setPosition(top) {
        const scrollBarHeight = this.scrollBar.clientHeight;
        const wrapperHeight = this.scrollContent.scrollHeight
        const clientHeight = this.scrollContent.clientHeight
        this.scrollBar.style.top = top + 'px'
        this.scrollContent.scroll({
            top: wrapperHeight * (top + scrollBarHeight) / clientHeight - clientHeight
        })
    }

}
installEvent(ScrollBar);




/**
 * 使用方法
 */
// new ScrollBar({
//     scrollWrapper: document.getElementsByClassName('scroll-wrapper')[0], //外部容器
//     scrollContent: document.getElementsByClassName('scroll-content')[0], //包裹数据的容器
//     scrollWidth: 10,//滚动条的宽度
//     scrollBarContentColor: '#6C73FF',//滚动条容器的颜色
//     scrollBarColor: '#A5ABFF',//滚动条的颜色
//     height: 500 //容器的高度
// })

/* 
    <div class="scroll-wrapper">
        <div class="scroll-content">
            write....
        </div>
    </div>
*/

