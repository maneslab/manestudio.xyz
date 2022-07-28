import React from 'react';
import PropTypes from 'prop-types';
import { confirmable } from 'react-confirm';
import Modal from 'components/common/modal'; 
import CloseIcon from 'public/img/icons/close.svg'
// import useTranslation from 'next-translate/useTranslation'

const YourDialog = ({show, proceed, confirmation, title, closeIcon, confirm_text, cancel_text, options}) => {
    let closeIconComponent;
    if (closeIcon === false) {
        closeIconComponent = null
    }else {
        closeIconComponent = <CloseIcon className="w-4 h-4" />
    }        

    return <Modal title={null} 
        visible={show} 
        maskClosable={false}
        closeIcon={closeIconComponent}
        onClose={() => proceed(false)} >
        {
            (confirmation && !title)
            ? <div className="font-bold capitalize border-b d-border-c-1 pb-4 mb-4 text-xl">
                {confirmation}
            </div>
            : <div>
                <div className="font-bold capitalize border-b  d-border-c-1 pb-4 mb-4 text-xl">
                    {title}
                </div>
                <div className='mb-8 text-gray-800 dark:text-white'>
                    {confirmation}
                </div>
            </div>
        }
        
        <div className="flex justify-end items-center space-x-2">
            <button className="btn btn-outline" onClick={() => proceed(false)}>{cancel_text?cancel_text:"cancel"}</button>
            <button className="btn btn-primary" onClick={() => proceed(true)}>{confirm_text?confirm_text:"confirm"}</button>
        </div>
    </Modal>

}

YourDialog.propTypes = {
  show: PropTypes.bool,            // from confirmable. indicates if the dialog is shown or not.
  proceed: PropTypes.func,         // from confirmable. call to close the dialog with promise resolved.
  confirmation: PropTypes.string,  // arguments of your confirm function
  options: PropTypes.object        // arguments of your confirm function
}

// confirmable HOC pass props `show`, `dismiss`, `cancel` and `proceed` to your component.
export default confirmable(YourDialog);