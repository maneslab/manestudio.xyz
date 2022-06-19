import React from 'react';
import PropTypes from 'prop-types';

// import Link from 'next/link'
import {withTranslate} from 'hocs/index'
import {confirm} from 'components/common/confirm/index'

import {DotsVerticalIcon,PencilIcon,TrashIcon,CheckIcon,XIcon,AdjustmentsIcon} from '@heroicons/react/outline'
import autobind from 'autobind-decorator';
// import {percentDecimal} from 'helper/number'
import { t } from 'helper/translate';

@withTranslate
class TraitOne extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            'edit_mode' : false,
            'name'      : ''
        }
        this.deleteTrait = ::this.deleteTrait;
    }

    componentDidMount() {
        this.setState({
            'generate_number' : this.props.trait.get('generate_number'),
            'name'            : this.props.trait.get('name')
        });
    }

    static getDerivedStateFromProps(props, state) {
        return {
            'generate_number' : props.trait.get('generate_number')
        }
    }

    @autobind
    selectItem() {

    }

    @autobind
    toggleEditMode() {
        this.setState({
            'edit_mode' : !this.state.edit_mode
        })
    }

    @autobind
    saveTrait() {

        this.setState({
            'edit_mode' : !this.state.edit_mode
        })

        this.props.handleUpdate(this.props.trait.get('id'),{'name':this.state.name});
    }

    async deleteTrait() {
        const {t} = this.props.i18n;
       
        console.log('this.props',this.props)

        if (await confirm({
            confirmation: t('are you sure you want to delete this trait?')
        })) {
            const {trait} = this.props;
            await this.props.handleDelete(trait.get('id'));
            this.props.refreshList();
        }
    }

    @autobind
    handleNameChange(e) {
        // console.log('debug07,e',e.target.value)
        // const { trait } = this.props;

        this.setState({
            'name' : e.target.value
        })

        // this.props.handleUpdate(trait.get('id'),{'generate_number':e.target.value});
    }

    render() {

        const { trait } = this.props;
        const { edit_mode } = this.state;

        console.log('trait',trait.toJS())

        return <div className="mb-4 bg-white">
            <div className="">
                <div className='relative trait-image'>
                    <img src={trait.getIn(['upload_img','image_urls','url'])} />
                    <div class="dropdown dropdown-right absolute right-1 top-1">
                        <label tabindex="0" class="btn m-1 px-2 bg-transparent border-none text-gray-600 hover:text-black hover:bg-transparent">
                            <DotsVerticalIcon className='icon-sm'/>
                        </label>
                        <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-white rounded-box w-52 capitalize">
                            <li><a onClick={this.deleteTrait}><TrashIcon className='icon-sm'/>delete</a></li>
                            <li><a onClick={this.props.handleEditProbability}><AdjustmentsIcon className='icon-sm'/>rarity</a></li>
                        </ul>
                    </div>
                </div>
                <div onClick={this.selectItem} className="flex-grow flex justify-between p-2">
                    <div className='flex justify-center flex-col'>
                        {
                            (edit_mode) 
                            ? <div className='h-8 flex items-center'>
                                <input className='input input-bordered input-xs w-full max-w-xs mr-2' value={this.state.name} onChange={this.handleNameChange}/>
                                <a onClick={this.saveTrait} className="cursor-pointer mr-1"><CheckIcon className='icon-xs'/></a>
                                <a onClick={this.toggleEditMode} className="cursor-pointer"><XIcon className='icon-xs'/></a>
                            </div>
                            : <div className='text-sm h-8 text-black flex justify-start items-center cursor-pointer trait-name' onClick={this.toggleEditMode}>
                                {
                                    (trait.get('name')) ? trait.get('name') : '(no name)'
                                }
                                <PencilIcon className='icon-xs ml-2 text-gray-400 edit-icon'/>
                            </div>
                        }
                        <div className='text-xs text-blue-400'>
                            15%
                        </div>
                    </div>

                </div>
            </div>


        </div>
    }
}


TraitOne.propTypes = {
    trait           : PropTypes.object.isRequired,
    handleDelete    : PropTypes.func.isRequired,
    handleEdit      : PropTypes.func.isRequired,
    handleEditProbability : PropTypes.func.isRequired,
    refreshList     : PropTypes.func.isRequired,
    total_number    : PropTypes.number.isRequired,
};
  

module.exports = TraitOne
