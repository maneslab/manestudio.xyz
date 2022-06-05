import React from 'react';
import Countdown from 'react-countdown';

import Image from 'next/image'
import {isMobile} from 'react-device-detect';

class CountDown extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }

    }

    render() {

        const {end_time} = this.props;

        let width = (isMobile) ? 16 : 24;
        return (
            <div className="flex justify-between px-4 md:px-0 md:justify-center md:justify-end items-center text-2xl font-pixel w-full md:w-auto md:text-4xl md:w-64">
                <div className="mr-4 text-3xl md:text-4xl">
                    Remaining Time
                </div>
                <div className="text-4xl flex items-center justify-end">
                    <img src="/img/clock.svg" className="w-4 h-4 md:w-8 md:h-8 mr-4" />
                    <Countdown date={end_time*1000}/>
                </div>
            </div>
        );
    }
}

module.exports = CountDown
