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
            <Link href={"/project/"+club.get('id')}>
            <div className="flex justify-between mb-4 border-2 border-black">
                <div className="w-48">
                    {
                        (!club.get('image'))
                        ? <div className='bg-secondary text-white flex justify-center items-center h-48'>
                            NO COVER
                        </div>
                        : null
                    }
                </div>
                <div className="flex-grow p-4">
                    <h2 className='font-bold text-white capitalize'>{club.get('name')}</h2>
                </div>
            </div>
            </Link>
        </div>
    }
}


module.exports = clubOne
