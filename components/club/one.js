import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import EthIcon from 'public/img/token/eth.svg'

import {BadgeCheckIcon} from '@heroicons/react/solid'
import Link from 'next/link'
import {showTimeLeft} from 'helper/time'

import {getItemImage} from 'helper/common'

class clubOne extends React.Component {

    render() {

        const { club } = this.props;

        return <div>
            <Link href={"/project/"+club.get('id')+"/group"}>
            <div className="flex justify-between mb-4 d-bg-c-1 p-4 cursor-pointer">
                <div className="w-48 mr-4">
                    {
                        (!club.get('image'))
                        ? <div className='bg-gray-100 text-gray-400 dark:bg-[#33363e] dark:text-[#555] flex justify-center items-center h-48'>
                            NO COVER
                        </div>
                        : null
                    }
                </div>
                <div className="flex-grow p-4">
                    <h2 className='font-bold text-xl capitalize'>{club.get('name')}</h2>
                </div>
            </div>
            </Link>
        </div>
    }
}


module.exports = clubOne
