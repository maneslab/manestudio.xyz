import React from 'react';
import PropTypes from 'prop-types';

import Link from 'next/link'
import {withTranslate} from 'hocs/index'
import {confirm} from 'components/common/confirm/index'

import {DotsVerticalIcon,PhotographIcon,TrashIcon,PencilIcon,AdjustmentsIcon} from '@heroicons/react/outline'
import autobind from 'autobind-decorator';
import {percentDecimal} from 'helper/number'

@withTranslate
class GroupOne extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            'generate_number' : 0
        }
        this.deleteGroup = ::this.deleteGroup;
    }

    componentDidMount() {
        this.setState({
            'generate_number' : this.props.group.get('generate_number')
        });
    }

    static getDerivedStateFromProps(props, state) {
        return {
            'generate_number' : props.group.get('generate_number')
        }
    }


    async deleteGroup() {
        const {t} = this.props.i18n;
       
        console.log('this.props',this.props)

        if (await confirm({
            confirmation: t('are you sure you want to delete this group?')
        })) {
            const {group} = this.props;
            await this.props.handleDelete(group.get('id'));
            this.props.refreshList();
        }
    }

    @autobind
    handleValueChange(e) {
        console.log('debug07,e',e.target.value)
        const { group } = this.props;

        this.setState({
            'generate_number' : e.target.value
        })

        this.props.handleUpdate(group.get('id'),{'generate_number':e.target.value});
    }

    render() {

        const { group,total_number,is_lock} = this.props;
        const {t} = this.props.i18n;
/*                                <li className='hidden'>
                                    <div className='py-2 px-2 bg-white border-t border-gray-200 flex-col w-full'>
                                        <h4 className='text-sm text-gray-500 flex justify-start'>{t('occurrence probability')}</h4>
                                        <input type="range" min="0" max="1000" value={this.state.generate_number} class="range" onChange={this.handleValueChange}/>
                                    </div>
                                </li>*/
        return <div>
            <div className="border border-gray-300 dark:border-[#292C31] ">
                <Link href={"/project/"+group.get('club_id')+"/group/"+group.get('id')+"/layer"}>
                <div className="w-full border-b border-gray-200 dark:border-[#292C31] cursor-pointer">
                    {
                        (!group.get('image_url'))
                        ? <div className='bg-white text-gray-500 dark:bg-[#25282e]  flex justify-center items-center w-full aspect-square'>
                            <PhotographIcon className='icon-base text-gray-300 dark:text-[#4c4f54]'/>
                        </div>
                        : <div className='aspect-square bg-white dark:bg-[#25282e]'>
                            <img src={group.get('image_url')} />
                        </div>
                    }
                </div>
                
                </Link>
                <div className="p-4 bg-white dark:bg-[#22252b] flex justify-between items-center">
                    <div>
                        <h2 className='font-bold text-black capitalize dark:text-white'>{group.get('name')}</h2>
                        <div className='text-red-400 text-sm'>
                            {percentDecimal(group.get('generate_number')/total_number)} %
                        </div>
                    </div>
                    <div>
                        <div class="dropdown dropdown-right">
                            <label tabindex="0" class="btn m-1 px-2 bg-gray-100 dark:bg-[#191c20] dark:text-white border-none text-gray-800 hover:bg-gray-200">
                                <DotsVerticalIcon className='icon-sm'/>
                            </label>
                            <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-white dark:bg-[#191c20] dark:text-white  rounded-box w-52 capitalize">
                                {
                                    (!is_lock)
                                    ? <>
                                        <li><a onClick={this.deleteGroup}><TrashIcon className='icon-sm'/>{t('delete')}</a></li>
                                        <li><a onClick={this.props.handleEditProbability}><AdjustmentsIcon className='icon-sm'/>{t('rarity')}</a></li>
                                    </>
                                    : null
                                }
                                <li><a onClick={this.props.handleEdit.bind({},group)}><PencilIcon className='icon-sm'/>{t('edit')}</a></li>

                            </ul>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    }
}


GroupOne.propTypes = {
    is_lock         : PropTypes.bool.isRequired,
    group           : PropTypes.object.isRequired,
    handleDelete    : PropTypes.func.isRequired,
    handleEdit      : PropTypes.func.isRequired,
    handleEditProbability : PropTypes.func.isRequired,
    refreshList     : PropTypes.func.isRequired,
    total_number    : PropTypes.number.isRequired,
};
  

module.exports = GroupOne
