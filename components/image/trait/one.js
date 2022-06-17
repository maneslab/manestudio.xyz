import React from 'react';
import PropTypes from 'prop-types';

import Link from 'next/link'
import {withTranslate} from 'hocs/index'
import {confirm} from 'components/common/confirm/index'

import {DotsVerticalIcon,PhotographIcon,TrashIcon,PencilIcon} from '@heroicons/react/outline'
import autobind from 'autobind-decorator';
import {percentDecimal} from 'helper/number'
import { t } from 'helper/translate';

@withTranslate
class TraitOne extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
        this.deleteTrait = ::this.deleteTrait;
    }

    componentDidMount() {
        this.setState({
            'generate_number' : this.props.trait.get('generate_number')
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
    handleValueChange(e) {
        console.log('debug07,e',e.target.value)
        const { trait } = this.props;

        this.setState({
            'generate_number' : e.target.value
        })

        this.props.handleUpdate(trait.get('id'),{'generate_number':e.target.value});
    }

    render() {

        const { trait } = this.props;
        const { open } = this.state;

        console.log('trait',trait.toJS())

        return <div className="mb-4 bg-white">
            <div className="">
                <div className=''>
                    <img src={trait.getIn(['upload_img','image_urls','url'])} />
                </div>
                <div onClick={this.selectItem} className="flex-grow flex justify-between p-2">
                    <div className='flex justify-center flex-col'>
                        <div className='text-sm text-black capitalize'>{
                            (trait.get('name')) ? trait.get('name') : '(no name)'
                        }</div>
                        <div className='text-xs text-blue-400'>
                            15%
                        </div>
                    </div>
                    <div class="dropdown dropdown-right">
                        <label tabindex="0" class="btn m-1 px-2 bg-gray-100 border-none text-gray-800 hover:bg-gray-200">
                            <DotsVerticalIcon className='icon-sm'/>
                        </label>
                        <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-white rounded-box w-52 capitalize">
                            <li><a onClick={this.deleteTrait}><TrashIcon className='icon-sm'/>delete</a></li>
                            <li><a onClick={this.props.handleEdit.bind({},trait)}><PencilIcon className='icon-sm'/>edit</a></li>
                            <li className='hidden'>
                                <div className='py-2 px-2 bg-white border-t border-gray-200 flex-col w-full'>
                                    <h4 className='text-sm text-gray-500 flex justify-start'>{t('occurrence probability')}</h4>
                                    <input type="range" min="0" max="1000" value={this.state.generate_number} class="range" onChange={this.handleValueChange}/>
                                </div>
                            </li>
                        </ul>
                        
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
