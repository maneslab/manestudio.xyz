import React from 'react';

import {withTranslate} from 'hocs/index'

@withTranslate
class Footer extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
        }
    }


    render() {

        return (
            <div className='bg-gray-100 p-4 flex justify-between items-center'>
                <div className='font-black text-gray-400'>zkpayroll</div>
                <div className='text-gray-400  ml-4 text-sm'>Easy-to-use salary system</div>
            </div>
        );
    }
}


export default Footer
