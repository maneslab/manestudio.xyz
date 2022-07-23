import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames'
// import Link from 'next/link'
import {withTranslate} from 'hocs/index'
import {confirm} from 'components/common/confirm/index'

import {DotsVerticalIcon,PencilIcon,TrashIcon,CheckIcon,XIcon,AdjustmentsIcon,EyeIcon} from '@heroicons/react/outline'
import autobind from 'autobind-decorator';
import {percentDecimal} from 'helper/number'
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
        /*value = value.replace(/[^A-Za-z0-9-_]/ig, '') */
        let value = e.target.value;
        this.setState({
            'name' : value
        })

        // this.props.handleUpdate(trait.get('id'),{'generate_number':e.target.value});
    }

    @autobind
    onkeydown(e) {
        if (e.keyCode === 13) {
			this.saveTrait()
		}
    }

    render() {

        const { trait,is_selected,group_id,layer_id,trait_id,is_lock } = this.props;
        const { edit_mode } = this.state;
        const {t} = this.props.i18n;

        if (trait.get('delete_time')) {
            return null;
        }

        return <div className={classNames("w-36 bg-white dark:bg-[#121518] dark:border-[#121518] border-2",{"border-black dark:border-white":is_selected})}>
            <div className="">
                <div className='relative trait-image asset-bg'>
                    <img src={trait.getIn(['img','image_urls','url'])} className="cursor-pointer" onClick={this.props.setActiveTraitId.bind({},{
                        'group_id' : group_id,
                        'layer_id' : layer_id,
                        'trait_id' : (is_selected) ? null : trait.get('id')
                    })} />
                    {
                        (!is_lock)
                        ? <div class="dropdown dropdown-right absolute right-1 top-1">
                            <label tabindex="0" class="btn m-1 px-2  border-none text-gray-600  bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white">
                                <DotsVerticalIcon className='icon-sm'/>
                            </label>
                            <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-white dark:bg-[#191c20] rounded-box w-52 capitalize">
                                <li><a onClick={this.deleteTrait}><TrashIcon className='icon-sm'/>{t('delete')}</a></li>
                                <li><a onClick={this.props.handleEditProbability}><AdjustmentsIcon className='icon-sm'/>{t('rarity')}</a></li>
                            </ul>
                        </div>
                        : null
                    }
                    {
                        (is_selected)
                        ? <EyeIcon className='w-4 h-4 absolute left-1 top-1'/>
                        : null
                    }
                </div>
                <div className="flex-grow flex justify-between p-2">
                    <div className='flex justify-center flex-col'>
                        {
                            (edit_mode) 
                            ? <div className='h-8 flex items-center'>
                                <input className='input input-bordered input-xs w-full max-w-xs mr-2' value={this.state.name} onChange={this.handleNameChange} onKeyDown={(e)=>this.onkeydown(e)}/>
                                <a onClick={this.saveTrait} className="cursor-pointer mr-1"><CheckIcon className='icon-xs'/></a>
                                <a onClick={this.toggleEditMode} className="cursor-pointer"><XIcon className='icon-xs'/></a>
                            </div>
                            : <div className='text-sm h-8  flex justify-start items-center cursor-pointer trait-name' onClick={this.toggleEditMode}>
                                {
                                    (trait.get('name')) ? trait.get('name') : '(no name)'
                                }
                                <PencilIcon className='icon-xs ml-2 text-gray-400 edit-icon'/>
                            </div>
                        }
                        <div className='text-xs text-blue-400'>
                            {percentDecimal(trait.get('generate_prob'))}%
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
    setActiveTraitId : PropTypes.func.isRequired,
    refreshList     : PropTypes.func.isRequired,
    total_number    : PropTypes.number.isRequired,
};
  

module.exports = TraitOne
