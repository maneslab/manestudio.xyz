import React from 'react';
import PropTypes from 'prop-types';
import { confirmable } from 'react-confirm';
import Modal from 'components/common/modal'; 
// import useTranslation from 'next-translate/useTranslation'

const YourDialog = ({show, proceed, confirmation, options}) => {
    // let {t} = useTranslation("common")
    return <Modal title={null} 
        visible={show} 
        maskClosable={false}
        closeIcon={false}
        onClose={() => proceed(false)} >
        <div className="mb-2 font-ubuntu py-4 px-4 font-bold text-base text-gray-700 ">
            {confirmation}
        </div>
        <div className="flex justify-end items-center space-x-2">
            <button className="btn btn-default" onClick={() => proceed(false)}>cancel</button>
            <button className="btn btn-primary" onClick={() => proceed(true)}>OK</button>
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