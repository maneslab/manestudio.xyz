import React from 'react';
import PropTypes from 'prop-types';

import Modal from 'components/common/modal'
// import { withRouter } from 'next/router';
//@withRouter

import {CheckIcon} from '@heroicons/react/outline'

class SuccessModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        const {visible,title,desc,link_text,link_href,link_target,link_text2,link_href2,link_target2} = this.props;

        if (!visible) {
            return null;
        }

        console.log('success-title',title,this.props);

        return  <Modal
                    width={650}
                    title={null}
                    visible={visible} 
                    footer={null}
                    onClose={this.props.closeModal}>
                  
                    <div className='pt-12'>

                        <div className='flex justify-center mb-8'>
                            <div className='border-4 border-green-500 rounded-full w-20 h-20 flex justify-center items-center'>
                                <CheckIcon className='text-green-500 w-12'/>
                            </div>
                        </div>

                        <div className='text-2xl font-bold text-center mb-2'>
                            {title}
                        </div>

                        <div className='text-base text-center mb-14'>
                            {desc}
                        </div>

                        {
                            (this.props.desc2)
                            ?  <div className='text-base text-center -mt-8 mb-14'>
                                {this.props.desc2}
                            </div>
                            : null
                        }
                        
                        {
                            (link_text)
                            ?   <div>
                                <a className='btn btn-outline btn-block capitalize' href={link_href} target={link_target}>
                                    {link_text}
                                </a>
                            </div>
                            : null
                        }

                        {
                            (link_text2)
                            ?   <div className='mt-4'>
                                <a className='btn btn-outline btn-block capitalize' href={link_href2} target={link_target2}>
                                    {link_text2}
                                </a>
                            </div>
                            : null
                        }

                    </div>
        </Modal>
    }
}
SuccessModal.propTypes = {
    visible     : PropTypes.bool.isRequired,
    closeModal  : PropTypes.func.isRequired,
    title       : PropTypes.string.isRequired,
    desc        : PropTypes.string,
    link_text   : PropTypes.string,
    link_href   : PropTypes.string,
    link_target : PropTypes.string,

};
SuccessModal.defaultProps = {
    link_target: "_self",
}
  

module.exports = SuccessModal


