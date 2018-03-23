import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

/**
 * 基于 moment 日期格式化，显示更多细节参考：
 *
 * @see http://momentjs.com/docs/#/displaying
 *
 * @example
 * ```html
 * {{ data | _date }}
 * 2017-09-17 15:35
 *
 * {{ data | _date: 'YYYY年MM月DD日' }}
 * 2017年09月17
 *
 * {{ data | _date: 'fn' }}
 * 10 秒前
 * ```
 */
@Pipe({ name: '_date' })
export class MomentDatePipe implements PipeTransform {
    transform(value: Date, formatString: string = 'YYYY-MM-DD HH:mm'): string {
        if (value) {
            if (formatString === 'fn')
                return moment(value).fromNow();
            return moment(value).format(formatString);
        } else {
            return '';
        }
    }
}
