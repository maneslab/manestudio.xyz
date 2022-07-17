import { format,fromUnixTime } from 'date-fns';
import {formatOverflowUnixtime} from 'helper/time'
export default function Showtime({unixtime}) {
    unixtime = formatOverflowUnixtime(unixtime);
    const select_date = fromUnixTime(unixtime);
    return (
        <span className="flex items-center">
            {format(select_date,'yyyy-MM-dd HH:mm')}
            <span className='text-gray-400 ml-4'>{format(select_date,'zzzz')}</span>
        </span>
    )
}
