
import dayjs from 'dayjs'
const relativeTime = require('dayjs/plugin/relativeTime')
require('dayjs/locale/zh-cn')

dayjs.extend(relativeTime)
dayjs.locale('en-us') 

export const showtime = function(unixtime) {
    
    let now_unixtime = getUnixtime();
    let gap = (now_unixtime - parseInt(unixtime)) ;

    if (Math.abs(gap) > 86400) {
        return dayjs.unix(unixtime).format('YYYY-MM-DD HH:mm:ss');
    }else {
        if (gap > 0) {
            return dayjs.unix(unixtime).fromNow('')
        }else {
            return dayjs.unix(unixtime).fromNow('')
        }
    }
}

export const showTimeLeft = (unixtime) => {

    let now_unixtime = getUnixtime();

    let now_time = dayjs.unix(now_unixtime);
    let input_time = dayjs.unix(unixtime);

    let day_gap =  input_time.diff(now_time,'day') 


    if (day_gap > 0) {
        return input_time.fromNow(true) + ' left';
    }

    let hour_gap =  input_time.diff(now_time,'hour') 

    if (hour_gap > 1) {
        return hour_gap + 'hours left';
    }else if (hour_gap == 1){
        return hour_gap + 'hour left';
    }

    let minute_gap =  input_time.diff(now_time,'minute') 

    if (minute_gap > 1) {
        return minute_gap + 'minutes left';
    }else  if (minute_gap == 1){
        return minute_gap + 'minute left';
    }

    return 'expire soon';
}





export function getUnixtime() {
    return Math.floor(Date.now() / 1000)
}