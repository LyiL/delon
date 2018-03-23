import * as moment from 'moment';

/**
 * 转化成RMB元字符串
 */
export function yuan(value: any): string {
    return `&yen ${value}`;
}

/**
 * 不满两位数自动填充 `0`
 * @param val 数值
 */
export function fixedZero(val) {
    return val * 1 < 10 ? `0${val}` : val;
}

/**
 * 获取时间范围
 * @param type 类型
 * @param time 开始时间
 */
export function getTimeDistance(type: 'today' | 'week' | 'month' | 'year', time: Date = new Date()) {
    const oneDay = 1000 * 60 * 60 * 24;

    if (type === 'today') {
        time.setHours(0);
        time.setMinutes(0);
        time.setSeconds(0);
        return [moment(time), moment(time.getTime() + (oneDay - 1000))];
    }

    if (type === 'week') {
        let day = time.getDay();
        time.setHours(0);
        time.setMinutes(0);
        time.setSeconds(0);

        if (day === 0) {
            day = 6;
        } else {
            day -= 1;
        }

        const beginTime = time.getTime() - day * oneDay;

        return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
    }

    if (type === 'month') {
        const year = time.getFullYear();
        const month = time.getMonth();
        const nextDate = moment(time).add(1, 'months');
        const nextYear = nextDate.year();
        const nextMonth = nextDate.month();

        return [
            moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
            moment(
                moment(
                    `${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`
                ).valueOf() - 1000
            )
        ];
    }

    if (type === 'year') {
        const year = time.getFullYear();

        return [
            moment(`${year}-01-01 00:00:00`),
            moment(`${year}-12-31 23:59:59`)
        ];
    }
}

/**
 * 类似 `_.get`，根据 `path` 获取安全值
 * jsperf: https://jsperf.com/es-deep-get
 */
export function deepGet(obj: any, path: string[], defaultValue: any) {
    if (!obj) return defaultValue;
    if (path.length <= 1) {
        const checkObj = path.length ? obj[path[0]] : obj;
        return typeof checkObj === 'undefined' ? defaultValue : checkObj;
    }
    return path.reduce((o, k) => (o || {})[k], obj) || defaultValue;
}

/**
 * 生成 uuid
 * @param len 长度，默认64位
 * @param radix 基数 2,10,16
 * @returns {string}
 */
export function uuid(len:number = 64, radix:number=16) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data. At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random()*16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}
/**
 * 克隆新数据
 * @param obj 克隆对象
 * @param filters 过滤字段
 * @returns {any} 返回新对象
 */
export function newClone(obj:any,filters?:any[]):any{
    let o:any;
    if (typeof obj == "object") {
        if (obj === null) {
            o = null;
        } else {
            if (obj instanceof Array) {
                o = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    o.push(newClone(obj[i]));
                }
            } else {
                o = {};
                for (var j in obj) {
                    if(filters && filters['findIndex']((filter)=>{return filter == j;}) != -1){
                        continue;
                    }
                    o[j] = newClone(obj[j]);
                }
            }
        }
    } else {
        o = obj;
    }
    return o;
}

export function strFormat(str:string, ...args:any[]){
    if(args){
        args.forEach((val,index)=>{
            var re = new RegExp('\\{' + (index) + '\\}','gm');
            str = str.replace(re, args[index]);
        })
    }
    return str;
}
