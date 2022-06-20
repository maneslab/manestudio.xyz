import React from 'react';
import PropTypes from 'prop-types';

import Link from 'next/link'
import {withTranslate} from 'hocs/index'
import {confirm} from 'components/common/confirm/index'

import {DotsVerticalIcon,CheckIcon,TrashIcon,PencilIcon,XIcon} from '@heroicons/react/outline'
import autobind from 'autobind-decorator';
import {percentDecimal} from 'helper/number'
import { t } from 'helper/translate';

@withTranslate
class SpecialOne extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            edit_mode : false,
            name : ''
        }
        this.deleteSpecial = ::this.deleteSpecial;
    }

    componentDidMount() {
        this.setState({
            'name'            : this.props.special.get('name')
        });
    }


    async deleteSpecial() {
        const {t} = this.props.i18n;
       
        console.log('this.props',this.props)

        if (await confirm({
            confirmation: t('are you sure you want to delete this special?')
        })) {
            const {special} = this.props;
            await this.props.handleDelete(special.get('id'));
            this.props.refreshList();
        }
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
    handleValueChange(e) {
        console.log('debug07,e',e.target.value)
        const { special } = this.props;

        this.setState({
            'generate_number' : e.target.value
        })

        this.props.handleUpdate(special.get('id'),{'generate_number':e.target.value});
    }
    @autobind
    handleNameChange(e) {
        this.setState({
            'name' : e.target.value
        })
    }
    render() {

        const { special } = this.props;
        const {edit_mode} = this.state;


        return <div>
            <div className="border border-gray-300">
                <div className="w-full border-b border-gray-200 cursor-pointer">
                    <div className='relative'>
                        <div>
                            <img src={special.getIn(['img','image_urls','url'])} className=""/>
                        </div>
                        <div class="dropdown dropdown-right absolute right-1 top-1">
                            <label tabindex="0" class="btn m-1 px-2 bg-gray-100 border-none text-gray-800 hover:bg-gray-200">
                                <DotsVerticalIcon className='icon-sm'/>
                            </label>
                            <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-white rounded-box w-52 capitalize">
                                <li><a onClick={this.deleteSpecial}><TrashIcon className='icon-sm'/>delete</a></li>
                                <li><a onClick={this.props.handleEdit.bind({},special)}><PencilIcon className='icon-sm'/>edit</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div className="p-4 bg-white flex justify-between items-center">
                    <div className='flex justify-center flex-col'>
                        {
                            (edit_mode) 
                            ? <div>
                            <div className='h-8 flex items-center'>
                                <input className='input input-bordered input-xs w-full max-w-xs mr-2' value={this.state.name} onChange={this.handleNameChange}/>
                                <a onClick={this.saveSpecial} className="cursor-pointer mr-1"><CheckIcon className='icon-xs'/></a>
                                <a onClick={this.toggleEditMode} className="cursor-pointer"><XIcon className='icon-xs'/></a>
                            </div>
                            <div className='text-xs pt-4 text-blue-500'>{t('name will appear in the metadata and in the attributes of the trading platform such as openesa, please fill in English and give a special name to each 1/1 of the special NFT')}</div>
                            </div>
                            : <div className='text-sm h-8 text-black flex justify-start items-center cursor-pointer trait-name' onClick={this.toggleEditMode}>
                                {
                                    (special.get('name')) ? special.get('name') : '(no name)'
                                }
                                <PencilIcon className='icon-xs ml-2 text-gray-400 edit-icon'/>
                            </div>
                        }
                    </div>
                </div>
                
            </div>
        </div>
    }
}


SpecialOne.propTypes = {
    special           : PropTypes.object.isRequired,
    handleDelete    : PropTypes.func.isRequired,
    handleEdit      : PropTypes.func.isRequired,
    handleEditProbability : PropTypes.func.isRequired,
    refreshList     : PropTypes.func.isRequired,
    total_number    : PropTypes.number.isRequired,
};
  

module.exports = SpecialOne
