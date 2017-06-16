let random = require("random-js")();
const TIMER_MS = 10;
const RAND_BEGIN = 1;
const RAND_END = 1000;
const RAND_HIT = 5;

exports.dataFactory = {

    datas: [],

    callback: null,

    timer: null,

    sequence: 1,

    start() {
        let self = this;
        this.timer = setInterval(() => {
            if (RAND_HIT === random.integer(RAND_BEGIN, RAND_END)) {
                self.datas.push({ seq: self.sequence++, time: new Date().toLocaleString() });
            }
            self.raiseCallback();
        }, TIMER_MS);
    },

    end() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    },

    /**
     * 尝试获取数据 
     * 获取到 直接返回 
     * 获取不到 返回 null 一旦返回都会把已有的数据清空  
     * @return null or datas
     */
    tryGetData() {
        if (this.datas.length === 0) {
            return null;
        } else {
            let datas = this.datas;
            this.datas = [];
            return datas;
        }
    },

    /**
     * 通过回调的方式获取数据
     * @param {*} callback 
     */
    setCallback(callback) {
        this.callback = callback;
        this.raiseCallback();
    },

    /**
     * 清理数据获取回调
     */
    cleanCallback() {
        this.callback = null;
    },

    raiseCallback() {
        //立刻执行一次
        if (this.callback && this.datas.length !== 0) {
            this.callback(this.datas);
            //回调之后清除数据 等待下一次获取
            this.datas = [];
        }
    }
}