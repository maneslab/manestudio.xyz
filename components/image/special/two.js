import React from 'react';
import PropTypes from 'prop-types';

import {withTranslate} from 'hocs/index'

import {CheckIcon,PencilIcon,XIcon} from '@heroicons/react/outline'
import autobind from 'autobind-decorator';
import {percentDecimal} from 'helper/number'

@withTranslate
class SpecialOne extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            edit_mode : false,
            name : ''
        }
    }

    componentDidMount() {
        this.setState({
            'name'            : this.props.special.get('name')
        });
    }

    @autobind
    toggleEditMode() {
        this.setState({
            'edit_mode' : !this.state.edit_mode
        })
    }

    @autobind
    saveSpecial() {
        this.setState({
            'edit_mode' : !this.state.edit_mode
        })
        this.props.handleUpdate(this.props.special.get('id'),{'name':this.state.name});
    }

    @autobind
    handleNameChange(e) {
        this.setState({
            'name' : e.target.value
        })
    }

    render() {

        const { special,total_count } = this.props;
        const {edit_mode} = this.state;


        return <div className="flex justify-between py-2 px-4 hover:bg-gray-100 dark:hover:bg-[#333]">
            <div className='flex justify-start items-center '>
                <img src={special.getIn(['img','image_urls','url'])} className="w-12 border d-border-c-1 rounded-md"/>
                
                <div className="py-1 px-4 flex justify-between items-center">
                    <div className='flex justify-center flex-col'>
                        {
                            (edit_mode) 
                            ? <div>
                            <div className='h-8 flex items-center'>
                                <input className='input input-bordered input-xs w-full max-w-xs mr-2' value={this.state.name} onChange={this.handleNameChange}/>
                                <a onClick={this.saveSpecial} className="cursor-pointer mr-1"><CheckIcon className='icon-xs'/></a>
                                <a onClick={this.toggleEditMode} className="cursor-pointer"><XIcon className='icon-xs'/></a>
                            </div>
                            </div>
                            : <div className='text-sm h-8  flex justify-start items-center cursor-pointer trait-name' onClick={this.toggleEditMode}>
                                {
                                    (special.get('name')) ? special.get('name') : '(no name)'
                                }
                                <PencilIcon className='icon-xs ml-2 text-gray-400 edit-icon'/>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className='flex justify-center items-center text-sm'>
                <div className='mr-4'>(1)</div>
                <div className=''>{
                    (total_count > 0)
                    ? percentDecimal(1/total_count) + '%'
                    : null
                }</div>
            </div>
            
        </div>
    }
}


SpecialOne.propTypes = {
    special           : PropTypes.object.isRequired,
    handleEdit      : PropTypes.func.isRequired,
    refreshList     : PropTypes.func.isRequired,
};
  

module.exports = SpecialOne
