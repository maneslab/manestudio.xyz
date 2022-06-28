import React from 'react';

import autobind from 'autobind-decorator'

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format,getUnixTime,fromUnixTime } from 'date-fns';
import {getDayBeginUnixtime} from 'helper/time'

class TimeSelect extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            date : null,
            hour : null,
            minute : null
        }
    }

    componentDidMount() {
        let {date,hour,minute} = this.getDateArrFromUnixtime(this.props.value);
        this.setState({
            date,
            hour,
            minute
        })
    }

    componentDidUpdate(prevProps,prevState) {
        if (this.props.value != prevProps.value) {
            let {date,hour,minute} = this.getDateArrFromUnixtime(this.props.value);
            this.setState({
                date,
                hour,
                minute
            })
        }
    }

    getDateArrFromUnixtime(value) {

        // console.log('debug04,从props拿到新的时间',value);

        let select_date_unixtime = getDayBeginUnixtime(value);
        let select_date = fromUnixTime(select_date_unixtime);
        // let select_date_unixtime = getUnixTime(select_date)

        // console.log('debug04,value',value);
        // console.log('debug04,select_date_unixtime',select_date_unixtime);

        let gap_time = value - select_date_unixtime;

        // console.log('debug04,gap_time',gap_time);

        let hour = Math.floor(gap_time / 3600)
        // console.log('debug04,hour',hour);

        let gap_time_2 = gap_time - hour *3600;

        // console.log('debug04,gap_time_2',gap_time_2);

        let minute = Math.floor(gap_time_2 / 60)

        // console.log('debug04,从props拿到新的时间分析结果是：',{
        //     date : select_date,
        //     hour : hour,
        //     minute : minute,
        // });

        return {
            date : select_date,
            hour : hour,
            minute : minute,
        }

    }

    getHoursOption() {
        let res = [];
        res.push(<option key={'no'} value="">hour</option>)
        for (var i = 0;i < 24; i++)
        res.push(<option value={i} key={i}>
        {i < 10 ? "0"+i : i} 
        </option>)
        return res;
    }

    getMinutesOption() {
        let res = [];
        res.push(<option key={'no'} value="">minutes</option>)
        for (var i = 0;i < 60; i++)
        res.push(<option value={i} key={i}>
        {i < 10 ? "0"+i : i} 
        </option>)
        return res;
    }

    @autobind
    selectHour(e) {
        this.setState({
            hour : e.target.value
        })
    }

    @autobind
    selectMinute(e) {
        this.setState({
            minute : e.target.value
        })
    }

    @autobind
    confirm() {
        const {value} = this.props;
        let {date,hour,minute} = this.state;

        const select_date = fromUnixTime(value);
        // console.log('this.state',this.state)
        // console.log('value',value,select_date)

        ///1.检查是否有选中的日期。否则的话用props传入的value对应的日期。
        let date_unixtime;
        if (date) {
            let uxtime = getUnixTime(date)
            date_unixtime  = getDayBeginUnixtime(uxtime) 
        }else {
            date_unixtime = getDayBeginUnixtime(value) 
        }


        ///2.检查hour和minute，否则的话都用0.
        if (!hour) {
            hour = 0;
        }
        if (!minute) {
            minute = 0
        }
        console.log('finnal_unxtime_from',date_unixtime,hour,minute);

        ///3.获得新的unixtime
        let finnal_unixtime = date_unixtime + hour *3600 + minute *60;
        console.log('finnal_unxtime',finnal_unixtime);

        ///4.写入value中
        this.props.onChange(finnal_unixtime);

        this.props.toggleDropdown();
    }


    render() {

        const {value} = this.props;
        const {date,hour,minute} = this.state;

        // let select_date;
        // if (date) {
        //     select_date = date;
        // }else {
        //     select_date = fromUnixTime(value);
        // }
        console.log('debug04,hour,minute',hour,minute);

        return <div className="w-96">
            <div className='bg-white p-4 shadow-xl border border-gray-200 '>
                <div className='flex justify-center'>
                <DayPicker 
                    fromYear={2022} 
                    toYear={2050} 
                    mode="single" 
                    captionLayout="dropdown" 
                    selected={date} 
                    onSelect={(v)=>{
                        this.setState({
                            date : v
                        })
                        // setFieldValue(name,getUnixTime(v))
                        // this.props.toggleDropdown();
                    }} 
                    required />
                </div>
                <div className='flex justify-between items-center w-full border-t border-gray-200 pt-4'>
                    <div className='flex justify-center items-center flex-grow'>
                        <select class="select-one w-20" value={hour} onChange={this.selectHour}>
                            {this.getHoursOption()}
                        </select>
                        <span className='font-bold font-ubuntu text-xl mx-2 py-1'>:</span>
                        <select class="select-one w-28" value={minute} onChange={this.selectMinute}>
                            {this.getMinutesOption()}
                        </select>
                    </div>
                    <button className='btn btn-primary ml-4' onClick={this.confirm}>{'confirm'}</button>
                </div>
            </div>
        </div>

    }
}

module.exports = TimeSelect
